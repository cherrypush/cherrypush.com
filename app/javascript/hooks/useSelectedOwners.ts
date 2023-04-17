import { useSearchParams } from 'react-router-dom'

const useSelectedOwners = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedOwners = searchParams.get('owners')?.split(',') ?? []
  const setSelectedOwners = (owners) => {
    if (owners.length > 0) {
      searchParams.set('owners', owners.join(','))
    } else {
      searchParams.delete('owners')
    }
    setSearchParams(searchParams)
  }

  return { selectedOwners, setSelectedOwners }
}

export default useSelectedOwners
