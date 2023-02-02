import { Tooltip } from 'flowbite-react'
import React from 'react'
import { numberToDiff } from '../helpers/applicationHelper'
import InfoCircle from './InfoCircle'

const MAX_ITEMS = 9

const RecentCommits = ({ commits }) => {
  const [showAll, setShowAll] = React.useState(false)

  const filteredCommits = showAll ? commits : commits.slice(0, MAX_ITEMS)

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Recent Commits 🔥
        </caption>
        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              AUTHOR
            </th>
            <th scope="col" className="px-6 py-3 flex items-center justify-end gap-1 text-center">
              CHANGES
              <InfoCircle tooltip="Number of added or removed occurrences on each commit." />
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              COMMIT
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCommits.map((commit) => (
            <tr
              key={commit.commit_sha}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td scope="row" className="px-6 py-4">
                {commit.author_name}
              </td>
              <td className="px-6 py-4 text-right">
                <span className="mr-2">{numberToDiff(commit.changes)}</span>
              </td>
              <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                <Tooltip content={commit.time_ago_in_words}>
                  <a alt="hello" title={commit.time_ago_in_words} href={commit.url} className="text-link">
                    <code>{commit.commit_sha?.slice(0, 6)}</code>
                  </a>
                </Tooltip>
              </td>
            </tr>
          ))}
          {showAll && (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => setShowAll(false)}
            >
              <td colSpan="3" className="px-6 py-4 text-center">
                Show less
              </td>
            </tr>
          )}
          {!showAll && commits.length > MAX_ITEMS && (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => setShowAll(true)}
            >
              <td colSpan="3" className="px-6 py-4 text-center">
                Show all
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RecentCommits
