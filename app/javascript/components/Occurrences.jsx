import classnames from 'classnames'
import { Table } from 'flowbite-react'
import React, { useState } from 'react'

const DEFAULT_MAX_OCCURRENCES = 20

const Occurrences = ({ occurrences }) => {
  const [showAll, setShowAll] = useState(false)

  const filteredOccurrences = showAll ? occurrences : occurrences.slice(0, DEFAULT_MAX_OCCURRENCES)
  const hasOwners = Boolean(occurrences[0]?.owners)
  const hasValue = Boolean(occurrences[0]?.value)

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <Table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Occurrences ({occurrences.length.toLocaleString()}) 🙇🏻‍♂️
        </caption>
        <Table.Head className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <Table.HeadCell className={classnames({ 'w-4/5': hasOwners || hasValue, 'w-full': !hasOwners && !hasValue })}>
            Name
          </Table.HeadCell>
          {hasOwners && <Table.HeadCell className="w-1/5">Owners</Table.HeadCell>}
          {hasValue && <Table.HeadCell className="w-1/5">Value</Table.HeadCell>}
        </Table.Head>
        <Table.Body>
          {filteredOccurrences.map((occurrence) => (
            <Table.Row
              key={occurrence.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 w-full text-xs"
            >
              <Table.Cell className="truncate">
                {occurrence.url ? (
                  <a href={occurrence.url} target="_blank" className="text-link" title={occurrence.text}>
                    {occurrence.text}
                  </a>
                ) : (
                  occurrence.text
                )}
              </Table.Cell>
              {occurrence.owners && (
                <Table.Cell className="truncate" title={occurrence.owners.join(', ')}>
                  {occurrence.owners.join(', ')}
                </Table.Cell>
              )}
              {occurrence.value && <Table.Cell>{occurrence.value}</Table.Cell>}
            </Table.Row>
          ))}
          {!showAll && occurrences.length > DEFAULT_MAX_OCCURRENCES && (
            <Table.Row
              onClick={() => setShowAll(true)}
              className="border-b dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600 cursor-pointer"
            >
              <Table.Cell colSpan="100%" className="text-center">
                Show all
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  )
}

export default Occurrences
