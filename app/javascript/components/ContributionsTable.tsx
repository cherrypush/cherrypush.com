import { Table } from 'flowbite-react'
import { formatDiff, timeAgoInWords } from '../helpers/applicationHelper'

interface Contribution {
  id: number
  metric: {
    id: number
    name: string
    project: {
      id: number
      name: string
    }
  }
  commit_sha: string
  diff: number
  commit_date: string
  commit_url: string
}

const ContributionsTable = ({ contributions }: { contributions: Contribution[] }) => (
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
          className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-xs dark:bg-gray-800"
        >
          <Table.Cell>
            <a className="text-link" href={`/user/projects?project_id=${contribution.metric.project.id}`}>
              {contribution.metric.project.name}
            </a>
          </Table.Cell>
          <Table.Cell>
            <a
              className="text-link"
              href={`/user/projects?project_id=${contribution.metric.project.id}&metric_id=${contribution.metric.id}`}
            >
              {contribution.metric.name}
            </a>
          </Table.Cell>
          <Table.Cell>{formatDiff(contribution.diff)}</Table.Cell>
          <Table.Cell>
            <a className="text-link" href={contribution.commit_url} target="_blank" rel="noreferrer">
              <pre>{contribution.commit_sha.substring(0, 6)}</pre>
            </a>
          </Table.Cell>
          <Table.Cell>{timeAgoInWords(contribution.commit_date)}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)

export default ContributionsTable
