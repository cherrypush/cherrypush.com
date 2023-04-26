import { Autocomplete, Chip, TextField } from '@mui/material'
import React from 'react'
import useSelectedOwners from '../hooks/useSelectedOwners'
import { useOwnersIndex } from '../queries/user/owners'

const OwnerSelector = ({ projectId, metricId }: { projectId?: number; metricId?: number }) => {
  const { selectedOwners, setSelectedOwners } = useSelectedOwners()
  const { data: owners } = useOwnersIndex({ projectId, metricId })

  if (!owners) return null

  const ownerOptions = owners.map((owner) => ({ id: owner.handle, label: `${owner.handle} (${owner.count})` })) ?? []

  return (
    <Autocomplete
      multiple
      value={selectedOwners.map((owner) => ownerOptions.find((item) => item.id === owner))}
      options={ownerOptions}
      renderInput={(params) => <TextField {...params} label="Filter by owners" />}
      onChange={(_event, items) => setSelectedOwners(items.flatMap((item) => (item ? item.id : [])))}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option.id}
            label={option.label}
            onClick={() => setSelectedOwners([option.id])}
          />
        ))
      }
    />
  )
}

export default OwnerSelector
