import React from 'react'
import { numberToDiff } from '../helpers/applicationHelper'
import InfoCircle from './InfoCircle'

const MAX_ITEMS = 9

const TopContributors = ({ contributors }) => {
  const [showAll, setShowAll] = React.useState(false)

  const filteredContributors = showAll ? contributors : contributors.slice(0, 9)

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Top Contributors 🏆
        </caption>
        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              AUTHOR
            </th>
            <th scope="col" className="px-6 py-3 text-right flex items-center justify-end gap-1">
              CHANGES
              <InfoCircle tooltip="Number of added or removed occurrences per person."></InfoCircle>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredContributors.map((contributor) => (
            <tr
              key={contributor.name}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td scope="row" className="px-6 py-4">
                {contributor.name}
              </td>
              <td className="px-6 py-4 text-right">
                <span className="mr-2">{numberToDiff(contributor.changes)}</span>
              </td>
            </tr>
          ))}
          {showAll && (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => setShowAll(false)}
            >
              <td colSpan="2" className="px-6 py-4 text-center">
                Show less
              </td>
            </tr>
          )}
          {!showAll && contributors.length > MAX_ITEMS && (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => setShowAll(true)}
            >
              <td colSpan="2" className="px-6 py-4 text-center">
                Show all
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TopContributors
