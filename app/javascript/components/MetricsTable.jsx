import React, { useState } from 'react'
import _ from 'lodash'
import { timeAgoInWords } from '../helpers/applicationHelper'
import SearchIcon from '@mui/icons-material/Search'

const MetricsTable = ({ metrics, selectedOwners }) => {
  const [search, setSearch] = useState('')

  const filteredMetrics = _.sortBy(
    metrics.filter((metric) => metric.name.toLowerCase().includes(search.toLowerCase())),
    (metric) => metric.name.toLowerCase()
  )

  const handleClick = (metric) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.append('metric_id', metric.id)
    window.location.search = searchParams.toString()
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between pb-4">
        <label for="table-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="text-gray-500 dark:text-gray-400 w-5 h-5" />
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for items"
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Metric
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Value
            </th>
            <th scope="col" className="px-6 py-3">
              Last report
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredMetrics.map((metric) => (
            <tr
              key={metric.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => handleClick(metric)}
              title={metric.name}
            >
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {metric.name}
              </th>
              <td className="px-6 py-4 text-right">
                {selectedOwners.length > 0 && metric.last_report ? (
                  <>
                    {_(metric.last_report.value_by_owner)
                      .pick(selectedOwners.map((o) => o.handle))
                      .values()
                      .flatten()
                      .sum()}{' '}
                    / {metric.last_report.value.toLocaleString()}
                  </>
                ) : (
                  metric.last_report.value.toLocaleString()
                )}
              </td>
              <td className="px-6 py-4">{timeAgoInWords(new Date(metric.last_report.date))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MetricsTable
