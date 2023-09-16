import { Table } from 'flowbite-react'
import { useContributorsIndex } from '../queries/user/contributors'

const getMedalFor = (index: number): string => {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return ''
}

const TopContributors = ({ metricId }: { metricId: number }) => {
  const { data: contributors } = useContributorsIndex({ metricId })

  if (!contributors) return null

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-3">
      <Table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          <div className="flex justify-between">
            <span>Top Contributors 🏆</span>
          </div>
        </caption>

        <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell className="text-right">Diff</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {contributors.map((contributor, index) => (
            <Table.Row
              key={contributor.name}
              className="bg-white border-b dark:border-gray-700 text-xs dark:bg-gray-800"
            >
              <Table.Cell>
                {getMedalFor(index)} {contributor.name}
              </Table.Cell>
              <Table.Cell className="text-right">{contributor.diff}</Table.Cell>
            </Table.Row>
          ))}
          {contributors.length === 0 && (
            <Table.Row className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50">
              <Table.Cell colSpan={100} className="px-4 py-2">
                No contributors yet
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  )
}

export default TopContributors
