import React, { useState } from 'react'
import _ from 'lodash'
import { timeAgoInWords } from '../helpers/applicationHelper'
import SearchIcon from '@mui/icons-material/Search'
import { Table, TextInput } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

const MetricsTable = ({ metrics, selectedOwners = [] }) => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filteredMetrics = _.sortBy(
    metrics.filter(
      (metric) =>
        metric.name.toLowerCase().includes(search.toLowerCase()) ||
        metric.project_name.toLowerCase().includes(search.toLowerCase())
    ),
    (metric) => metric.name.toLowerCase()
  )

  const handleClick = (metric) => navigate(`/user/metrics?project_id=${metric.project_id}&metric_id=${metric.id}`)

  return (
    <>
      <TextInput
        type="text"
        id="table-search"
        className="mb-3 w-80"
        placeholder="Filter metrics"
        onChange={(event) => setSearch(event.target.value)}
        icon={SearchIcon}
        autoComplete="off"
      />
      <Table>
        <Table.Head>
          <Table.HeadCell>Metric</Table.HeadCell>
          <Table.HeadCell>Project</Table.HeadCell>
          <Table.HeadCell className="text-right">Value</Table.HeadCell>
          <Table.HeadCell>Last report</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {filteredMetrics.map((metric) => (
            <Table.Row
              key={metric.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => handleClick(metric)}
              title={metric.name}
            >
              <Table.HeadCell className="dark:text-white">{metric.name}</Table.HeadCell>
              <Table.Cell>{metric.project_name}</Table.Cell>
              <Table.Cell className="text-right">
                {selectedOwners.length > 0 && metric.last_report ? (
                  <>
                    {_(metric.last_report.value_by_owner).pick(selectedOwners).values().flatten().sum()} /{' '}
                    {metric.last_report.value.toLocaleString()}
                  </>
                ) : (
                  metric.last_report?.value.toLocaleString()
                )}
              </Table.Cell>
              <Table.Cell>{metric.last_report && timeAgoInWords(new Date(metric.last_report.date))}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

export default MetricsTable
