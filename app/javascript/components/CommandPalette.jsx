import SearchIcon from '@mui/icons-material/Search'
import { Button } from 'flowbite-react'
import 'ninja-keys'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useMetricsIndex } from '../queries/user/metrics'
import { useProjectsIndex } from '../queries/user/projects'

export const CommandPaletteButton = () => (
  <Button pill color="dark" className="ml-3" size="xs" onClick={openCommandPalette}>
    <div className="flex items-center gap-2">
      <SearchIcon fontSize="md" />
      <kbd className="px-1.5 py-1 text-xs font-semibold bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
        <span className="mr-1">⌘</span>
        <span>k</span>
      </kbd>
    </div>
  </Button>
)

const openCommandPalette = () => {
  const ninja = document.querySelector('ninja-keys')
  ninja.open()
}

const CommandPalette = () => {
  const { data: projects } = useProjectsIndex()
  const { data: metrics } = useMetricsIndex({})
  const navigate = useNavigate()

  const ninjaKeys = useRef(null)

  let hotkeys = []

  if (projects) {
    hotkeys = hotkeys.concat(
      projects.map((project) => ({
        id: `project-${project.id}`,
        title: project.name,
        section: 'Projects',
        handler: () => navigate(`/user/projects?project_id=${project.id}`),
      }))
    )
  }

  if (metrics) {
    hotkeys = hotkeys.concat(
      metrics.map((metric) => ({
        id: `metric-${metric.id}`,
        title: metric.name,
        section: `Metrics for ${metric.project.name}`,
        handler: () => navigate(`/user/projects?project_id=${metric.project_id}&metric_id=${metric.id}`),
      }))
    )
  }

  useEffect(() => {
    if (ninjaKeys.current) ninjaKeys.current.data = hotkeys
  }, [projects, metrics])

  return <ninja-keys placeholder="Search for projects and metrics" hideBreadcrumbs ref={ninjaKeys} />
}

export default CommandPalette
