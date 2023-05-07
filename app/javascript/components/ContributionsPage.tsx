import { Table } from 'flowbite-react'
import React from 'react'
import { buildCommitUrl, formatDiff, timeAgoInWords } from '../helpers/applicationHelper'
import { useContributionsIndex } from '../queries/user/contributions'

const ContributionsPage = () => {
  const { data: contributions } = useContributionsIndex()

  if (!contributions) return null

  console.log({ contributions })

  return (
    <div className="container">
      <h1>My Contributions</h1>
      <Table>
        <Table.Head>
          <Table.HeadCell>Project</Table.HeadCell>
          <Table.HeadCell>Metric</Table.HeadCell>
          <Table.HeadCell>Diff</Table.HeadCell>
          <Table.HeadCell>Commit</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {contributions.map((contribution) => (
            <Table.Row
              key={contribution.id}
              className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-xs dark:bg-gray-800 cursor-pointer"
              onClick={() =>
                window.open(
                  buildCommitUrl({
                    projectName: contribution.metric.project.name,
                    commitSha: contribution.commit_sha,
                  }),
                  '_blank'
                )
              }
            >
              <Table.Cell>{contribution.metric.project.name}</Table.Cell>
              <Table.Cell>{contribution.metric.name}</Table.Cell>
              <Table.Cell>{formatDiff(contribution.diff)}</Table.Cell>
              <Table.Cell>
                <pre>{contribution.commit_sha.substring(0, 6)}</pre>
              </Table.Cell>
              <Table.Cell>{timeAgoInWords(contribution.commit_date)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ContributionsPage
