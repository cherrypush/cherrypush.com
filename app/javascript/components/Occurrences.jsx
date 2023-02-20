import classnames from 'classnames'
import React from 'react'
import { useState } from 'react'

const DEFAULT_MAX_OCCURRENCES = 20

const Occurrences = ({ occurrences }) => {
  const [showAll, setShowAll] = useState(false)

  const filteredOccurrences = showAll ? occurrences : occurrences.slice(0, DEFAULT_MAX_OCCURRENCES)

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Occurrences 🙇🏻‍♂️
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            {occurrences[0]?.owners && (
              <th scope="col" className="px-6 py-3">
                Owners
              </th>
            )}
            {occurrences[0]?.value && (
              <th scope="col" className="px-6 py-3">
                Value
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredOccurrences.map((occurrence) => (
            <tr
              key={occurrence.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td scope="row" className="px-6 py-4">
                {occurrence.url ? (
                  <a href={occurrence.url} target="_blank" className="text-link">
                    {occurrence.text}
                  </a>
                ) : (
                  occurrence.text
                )}
              </td>
              {occurrence.owners && <td className="px-6 py-4">{occurrence.owners.join(', ')}</td>}
              {occurrence.value && <td className="px-6 py-4">{occurrence.value}</td>}
            </tr>
          ))}
          {!showAll && occurrences.length > DEFAULT_MAX_OCCURRENCES && (
            <tr
              onClick={() => setShowAll(true)}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
            >
              <td colSpan="100%" className="px-6 py-3 text-center">
                Show all
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Occurrences
