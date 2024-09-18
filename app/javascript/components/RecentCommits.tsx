import { Table, Tooltip } from 'flowbite-react'
import { buildCommitUrl, timeAgoInWords } from '../helpers/applicationHelper'

import React from 'react'
import { useContributionsIndex } from '../queries/user/contributions'

const INITIALLY_VISIBLE_CONTRIBUTIONS = 5

const RecentCommits = ({ metricId, projectName }: { metricId: number; projectName: string }) => {
  const { data: contributions } = useContributionsIndex({ metricId })

  const [showAll, setShowAll] = React.useState(false)

  if (!contributions) return null

  const contributionsToShow = showAll ? contributions : contributions.slice(0, INITIALLY_VISIBLE_CONTRIBUTIONS)

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <Table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Recent Commits 🤗
        </caption>

        <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <Table.HeadCell>Commit Author</Table.HeadCell>
          <Table.HeadCell className="text-right">Diff</Table.HeadCell>
          <Table.HeadCell className="text-right">Date</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {contributionsToShow.map((contribution) => (
            <Table.Row
              key={contribution.id}
              className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-xs dark:bg-gray-800 cursor-pointer"
              onClick={() => window.open(buildCommitUrl({ projectName, commitSha: contribution.commit_sha }), '_blank')}
            >
              <Table.Cell>
                <Tooltip content={contribution.author_email}>{contribution.author_name}</Tooltip>
              </Table.Cell>
              <Table.Cell className="text-right">{contribution.diff}</Table.Cell>
              <Table.Cell className="text-right">{timeAgoInWords(contribution.commit_date)}</Table.Cell>
            </Table.Row>
          ))}
          {contributions.length === 0 && (
            <Table.Row className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
              <Table.Cell colSpan={100} className="px-4 py-2">
                No contributions yet
              </Table.Cell>
            </Table.Row>
          )}
          {contributions.length > INITIALLY_VISIBLE_CONTRIBUTIONS && (
            <Table.Row
              className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-xs dark:bg-gray-800 cursor-pointer"
              onClick={() => setShowAll(!showAll)}
            >
              <Table.Cell colSpan={100} className="px-4 py-2">
                <div className="flex justify-center">{showAll ? 'Show less' : 'Show more'}</div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  )
}

export default RecentCommits
