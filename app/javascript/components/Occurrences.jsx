import classnames from 'classnames'
import React from 'react'
import { useState } from 'react'

const DEFAULT_MAX_OCCURRENCES = 20

const Occurrences = ({ occurrences }) => {
  const [showAll, setShowAll] = useState(false)

  const filteredOccurrences = showAll ? occurrences : occurrences.slice(0, DEFAULT_MAX_OCCURRENCES)
  const hasOwners = Boolean(occurrences[0]?.owners)
  const hasValue = Boolean(occurrences[0]?.value)

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Occurrences ({occurrences.length.toLocaleString()}) 🙇🏻‍♂️
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th
              scope="col"
              className={classnames('px-6 py-3', { 'w-4/5': hasOwners || hasValue, 'w-full': !hasOwners && !hasValue })}
            >
              Name
            </th>
            {hasOwners && (
              <th scope="col" className="px-6 py-3 w-1/5">
                Owners
              </th>
            )}
            {hasValue && (
              <th scope="col" className="px-6 py-3 w-1/5">
                Value
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredOccurrences.map((occurrence) => (
            <tr key={occurrence.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 w-full text-xs">
              <td scope="row" className="px-4 py-2 truncate">
                {occurrence.url ? (
                  <a href={occurrence.url} target="_blank" className="text-link" title={occurrence.text}>
                    {occurrence.text}
                  </a>
                ) : (
                  occurrence.text
                )}
              </td>
              {occurrence.owners && (
                <td className="px-4 py-2 truncate" title={occurrence.owners.join(', ')}>
                  {occurrence.owners.join(', ')}
                </td>
              )}
              {occurrence.value && <td className="px-4 py-2">{occurrence.value}</td>}
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
