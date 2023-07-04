import { CONFIG_FILE_LOCAL_PATH } from './configuration.js'
import { toISODate } from './date.js'
import sh from './sh.js'

const REPO_NAME_REGEX = /([\w\-_\.]+\/[\w\-_\.]+)\.git/g

const git = async (cmd) => {
  const stdout = await sh(`git ${cmd}`)
  return stdout.toString().split('\n').filter(Boolean)
}

export const files = async () => {
  const trackedFiles = await git('ls-files')
  const untrackedFiles = await git('ls-files --others --exclude-standard')
  const deletedFiles = await git('ls-files -d')
  const rejectedFiles = [...deletedFiles, CONFIG_FILE_LOCAL_PATH]

  return trackedFiles.concat(untrackedFiles).filter((file) => !rejectedFiles.includes(file))
}

export const guessProjectName = async () => {
  const remotes = await git('remote')
  if (!remotes.length) return ''

  const url = (await git(`remote get-url ${remotes[0]}`))[0]
  if (!url) return ''

  const matches = Array.from(url.matchAll(REPO_NAME_REGEX))[0]
  return matches[1] || ''
}

export const sha = async () => (await git('rev-parse HEAD')).toString()

export const authorName = async (sha) => (await git(`show ${sha} --format=%an --no-patch`))[0]

export const authorEmail = async (sha) => (await git(`show ${sha} --format=%ae --no-patch`))[0]

export const commitDate = async (sha) => new Date((await git(`show -s --format=%ci ${sha}`))[0])

export const commitShaAt = async (date, branch) =>
  (await git(`rev-list --reverse --after=${toISODate(date)} ${branch}`))[0]

export const checkout = async (sha) => await git(`checkout ${sha}`)

export const branchName = async () => (await git(`branch --show-current`))[0]

export const uncommittedFiles = async () => await git('status --porcelain=v1')
