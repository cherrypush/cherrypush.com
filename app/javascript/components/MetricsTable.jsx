import SearchIcon from '@mui/icons-material/Search'
import { Button, Rating, Table, TextInput } from 'flowbite-react'
import _ from 'lodash'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { timeAgoInWords } from '../helpers/applicationHelper'
import useCurrentUser from '../hooks/useCurrentUser'
import { useFavoritesCreate, useFavoritesDestroy } from '../queries/user/favorites'

const MetricsTable = ({ metrics, selectedOwners = [] }) => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { mutate: addFavorite } = useFavoritesCreate()
  const { mutate: removeFavorite } = useFavoritesDestroy()
  const { user } = useCurrentUser()

  const filteredMetrics = _.sortBy(
    metrics.filter(
      (metric) =>
        metric.name.toLowerCase().includes(search.toLowerCase()) ||
        metric.project.name.toLowerCase().includes(search.toLowerCase())
    ),
    (metric) => (user.favorite_metric_ids.includes(metric.id) ? 0 : 1) + metric.name.toLowerCase()
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
              <Table.HeadCell className="dark:text-white flex items-center gap-3">
                <Button
                  size="sm"
                  color="dark"
                  onClick={(event) => {
                    event.stopPropagation()
                    user.favorite_metric_ids.includes(metric.id)
                      ? removeFavorite({ id: metric.id, type: 'metric' })
                      : addFavorite({ id: metric.id, type: 'metric' })
                  }}
                >
                  <Rating>
                    <Rating.Star filled={user.favorite_metric_ids.includes(metric.id)} />
                  </Rating>
                </Button>{' '}
                {metric.name}
              </Table.HeadCell>
              <Table.Cell>{metric.project.name}</Table.Cell>
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
              <Table.Cell>{timeAgoInWords(new Date(metric.updated_at))}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

export default MetricsTable
