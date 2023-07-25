#! /usr/bin/env node

import axios from 'axios'
import { program } from 'commander'
import dotenv from 'dotenv'
import fs from 'fs'
import _ from 'lodash'
import prompt from 'prompt'
import Codeowners from '../src/codeowners.js'
import {
  configurationExists,
  createConfigurationFile,
  createWorkflowFile,
  getConfiguration,
  workflowExists,
} from '../src/configuration.js'
import { computeContributions } from '../src/contributions.js'
import { substractDays, toISODate } from '../src/date.js'
import { panic } from '../src/error.js'
import { getFiles } from '../src/files.js'
import * as git from '../src/git.js'
import { guessProjectName } from '../src/git.js'
import { setVerboseMode } from '../src/log.js'
import { findOccurrences } from '../src/occurences.js'

dotenv.config()

const API_BASE_URL = process.env.API_URL ?? 'https://www.cherrypush.com/api'

program.command('init').action(async () => {
  if (configurationExists()) {
    console.error('.cherry.js already exists.')
    process.exit(0)
  }

  prompt.message = ''
  prompt.start()

  let projectName = await guessProjectName()
  if (!projectName) {
    projectName = await prompt.get({
      properties: { repo: { message: 'Enter your project name', required: true } },
    }).repo
  }
  createConfigurationFile(projectName)

  if (!workflowExists()) createWorkflowFile()
  console.log('Your initial setup is done! Now try the command `cherry run` to see your first metrics.')
})

program
  .command('run')
  .option('--owner <owner>', 'only consider given owner code')
  .option('--metric <metric>', 'only consider given metric')
  .option('-o, --output <output>', 'export stats into a local json file')
  .action(async (options) => {
    const configuration = await getConfiguration()
    const codeOwners = new Codeowners()
    const owners = options.owners ? options.owners.split(',') : null
    const files = options.owner ? await getFiles(options.owner.split(','), codeOwners) : await getFiles()

    const occurrences = await findOccurrences({ configuration, files, metric: options.metric, codeOwners })
    if (options.owner || options.metric) {
      let displayedOccurrences = occurrences
      if (owners) displayedOccurrences = displayedOccurrences.filter((o) => _.intersection(o.owners, owners).length)
      if (options.metric) displayedOccurrences = displayedOccurrences.filter((o) => o.metricName === options.metric)

      displayedOccurrences.forEach((occurrence) => console.log(`👉 ${occurrence.text}`))
      console.log('Total occurrences:', displayedOccurrences.length)
    } else console.table(sortObject(countByMetric(occurrences)))

    if (options.output) {
      const metrics = buildMetricsPayload(occurrences)
      const filepath = process.cwd() + '/' + options.output
      const content = JSON.stringify(metrics, null, 2)

      fs.writeFile(filepath, content, 'utf8', function (err) {
        if (err) panic(err)
        console.log(`JSON file has been saved as ${filepath}`)
      })
    }
  })

program
  .command('push')
  .option('--api-key <api_key>', 'Your cherrypush.com api key')
  .action(async (options) => {
    const configuration = await getConfiguration()
    const apiKey = options.apiKey || process.env.CHERRY_API_KEY
    const initialBranch = await git.branchName()
    if (!initialBranch) panic('Not on a branch, checkout a branch before pushing metrics.')
    const sha = await git.sha()

    let error
    try {
      console.log('Computing metrics for current commit...')
      const occurrences = await findOccurrences({
        configuration,
        files: await getFiles(),
        codeOwners: new Codeowners(),
      })
      console.log(`  Uploading metrics...`)
      await upload(apiKey, configuration.project_name, await git.commitDate(sha), occurrences)

      console.log('')
      console.log('Computing metrics for previous commit...')
      await git.checkout(`${sha}~`)
      const previousOccurrences = await findOccurrences({
        configuration,
        files: await getFiles(),
        codeOwners: new Codeowners(),
      })

      const contributions = computeContributions(occurrences, previousOccurrences)

      if (contributions.length) {
        console.log(`  Uploading contributions...`)
        await uploadContributions(
          apiKey,
          configuration.project_name,
          await git.authorName(sha),
          await git.authorEmail(sha),
          sha,
          await git.commitDate(sha),
          contributions
        )
      } else console.log('No contribution found, skipping')
    } catch (exception) {
      error = exception
    } finally {
      git.checkout(initialBranch)
    }
    if (error) {
      console.error(error)
      process.exit(1)
    }

    console.log('Your dashboard is available at https://www.cherrypush.com/user/projects')
  })

program
  .command('diff')
  .requiredOption('--metric <metric>')
  .requiredOption(
    '--api-key <api_key>',
    'Your cherrypush.com API key (available on https://www.cherrypush.com/user/settings)'
  )
  .option('--error-if-increase', 'Return an error status code (1) if the metric increased since its last report')
  .action(async (options) => {
    const configuration = await getConfiguration()
    const apiKey = options.apiKey || process.env.CHERRY_API_KEY
    const metric = options.metric

    let lastMetricValue
    let previousOccurrences
    try {
      const params = { project_name: configuration.project_name, metric_name: metric, api_key: apiKey }
      const response = await axios.get(API_BASE_URL + '/metrics', { params })
      lastMetricValue = response.data.value
      previousOccurrences = response.data.occurrences
      if (!Number.isInteger(lastMetricValue)) {
        console.log('No last value found for this metric, aborting.')
        process.exit(0)
      }
      console.log(`Last metric value: ${lastMetricValue}`)
    } catch (e) {
      console.error(e)
      process.exit(0)
    }

    const occurrences = await findOccurrences({
      configuration,
      files: await getFiles(),
      codeOwners: new Codeowners(),
      metric,
    })

    const currentMetricValue = countByMetric(occurrences)[metric] || 0
    console.log(`Current metric value: ${currentMetricValue}`)

    const diff = currentMetricValue - lastMetricValue
    console.log(`Difference: ${diff}`)

    if (diff > 0) {
      console.log('Added occurrences:')
      const newOccurrencesTexts = occurrences.filter((o) => o.metricName === metric).map((o) => o.text)
      console.log(newOccurrencesTexts.filter((x) => !previousOccurrences.includes(x)))
    }

    if (diff > 0 && options.errorIfIncrease) process.exit(1)
  })

program
  .command('backfill')
  .option('--api-key <api_key>', 'Your cherrypush.com api key')
  .option('--since <since>', 'yyyy-mm-dd | The date at which the backfill will start (defaults to 90 days ago)')
  .option('--until <until>', 'yyyy-mm-dd | The date at which the backfill will stop (defaults to today)')
  .option('--interval <interval>', 'The number of days between backfills (defaults to 30 days)')
  .action(async (options) => {
    const since = options.since ? new Date(options.since) : substractDays(new Date(), 90)
    const until = options.until ? new Date(options.until) : new Date()
    const interval = options.interval ? parseInt(options.interval) : 30
    if (isNaN(since)) panic('Invalid since date')
    if (isNaN(until)) panic('Invalid until date')
    if (since > until) panic('The since date must be before the until date')
    const initialBranch = await git.branchName()
    if (!initialBranch) panic('Not on a branch, checkout a branch before running the backfill.')
    const hasUncommitedChanges = (await git.uncommittedFiles()).length > 0
    if (hasUncommitedChanges) panic('Please commit your changes before running this command')

    const configuration = await getConfiguration()
    const apiKey = options.apiKey || process.env.CHERRY_API_KEY
    let date = until
    let sha = await git.sha()
    try {
      while (date >= since) {
        const committedAt = await git.commitDate(sha)
        console.log(`On day ${toISODate(date)}...`)

        await git.checkout(sha)

        const files = await getFiles()
        const codeOwners = new Codeowners()
        const occurrences = await findOccurrences({ configuration, files, codeOwners })
        await upload(apiKey, configuration.project_name, committedAt, occurrences)

        date = substractDays(committedAt, interval)
        sha = await git.commitShaAt(date, initialBranch)
        if (!sha) {
          console.log(`no commit found after ${toISODate(date)}, ending backfill`)
          break
        }
        if (committedAt > until || committedAt < since) break
      }
    } catch (error) {
      console.error(error)
      await git.checkout(initialBranch)
      process.exit(1)
    }

    await git.checkout(initialBranch)
    console.log('Your dashboard is available at https://www.cherrypush.com/user/projects')
  })

const handleApiError = async (callback) => {
  try {
    return await callback()
  } catch (error) {
    if (error.response)
      throw new Error(
        `❌ Error while calling cherrypush.com API ${error.response.status}: ${
          error.response.data?.error || error.response.statusText
        }`
      )
    throw error
  }
}

const upload = (apiKey, projectName, date, occurrences) => {
  if (!projectName) panic('specify a project_name in your cherry.js configuration file before pushing metrics')

  return handleApiError(() =>
    axios
      .post(API_BASE_URL + '/push', buildPushPayload(projectName, date, occurrences), { params: { api_key: apiKey } })
      .then(({ data }) => data)
  )
}

const buildMetricsPayload = (occurrences) =>
  _(occurrences)
    .groupBy('metricName')
    .mapValues((occurrences, metricName) => ({
      name: metricName,
      occurrences: occurrences.map((o) => _.pick(o, 'text', 'value', 'url', 'owners')),
    }))
    .values()
    .flatten()
    .value()

const buildPushPayload = (projectName, date, occurrences) => ({
  project_name: projectName,
  date: date.toISOString(),
  metrics: buildMetricsPayload(occurrences),
})

const uploadContributions = async (apiKey, projectName, authorName, authorEmail, sha, date, contributions) =>
  handleApiError(() =>
    axios
      .post(
        API_BASE_URL + '/contributions',
        buildContributionsPayload(projectName, authorName, authorEmail, sha, date, contributions),
        { params: { api_key: apiKey } }
      )
      .then(({ data }) => data)
  )

const buildContributionsPayload = (projectName, authorName, authorEmail, sha, date, contributions) => ({
  project_name: projectName,
  author_name: authorName,
  author_email: authorEmail,
  commit_sha: sha,
  commit_date: date.toISOString(),
  contributions: contributions.map((contribution) => ({
    metric_name: contribution.metricName,
    diff: contribution.diff,
  })),
})

const sortObject = (object) => _(object).toPairs().sortBy(0).fromPairs().value()

const countByMetric = (occurrences) =>
  _(occurrences)
    .groupBy('metricName')
    .mapValues((occurrences) => _.sumBy(occurrences, (occurrence) => occurrence.value || 1))
    .value()

program
  .option('-v, --verbose', 'Enable verbose mode')
  .hook('preAction', (thisCommand) => {
    if (thisCommand.opts().verbose) setVerboseMode(true)
  })
  .parse(process.argv)
