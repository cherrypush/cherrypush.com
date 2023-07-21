import InfoIcon from '@mui/icons-material/Info'
import { Tooltip } from 'flowbite-react'

const InfoCircle = ({ tooltip }: { tooltip: string }) => (
  <Tooltip content={tooltip} style="light">
    <InfoIcon fontSize="small" />
  </Tooltip>
)

export default InfoCircle
