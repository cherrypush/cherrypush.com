import { Button } from 'flowbite-react'
import 'ninja-keys'
import { useEffect, useRef } from 'react'
import { MdSearch } from 'react-icons/md'
import { useNavigate } from 'react-router'
import { useDashboardsIndex } from '../queries/user/dashboards'
import { useMetricsIndex } from '../queries/user/metrics'
import { useProjectsIndex } from '../queries/user/projects'
import './CommandPalette.css'

export const CommandPaletteButton = () => (
  <Button pill color="dark" className="ml-3" size="xs" onClick={openCommandPalette}>
    <div className="flex items-center gap-2">
      <MdSearch className="w-4 h-4" />
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
  const { data: dashboards } = useDashboardsIndex()

  const navigate = useNavigate()

  const ninjaKeys = useRef(null)

  let hotkeys = []

  if (dashboards) {
    hotkeys = hotkeys.concat(
      dashboards
        .map((dashboard) => ({
          id: `dashboard-${dashboard.id}`,
          title: `${dashboard.name} (${dashboard.project.name})`,
          section: 'Dashboards',
          handler: () => navigate(`/user/dashboards/${dashboard.id}`),
        }))
        .sort((a, b) => a.title.localeCompare(b.title))
    )
  }

  if (projects) {
    hotkeys = hotkeys.concat(
      projects
        .map((project) => ({
          id: `project-${project.id}`,
          title: `${project.name}`,
          section: 'Projects',
          handler: () => navigate(`/user/projects?project_id=${project.id}`),
        }))
        .sort((a, b) => a.title.localeCompare(b.title))
    )
  }

  if (metrics) {
    hotkeys = hotkeys.concat(
      metrics
        .map((metric) => ({
          id: `metric-${metric.id}`,
          title: `${metric.name} (${metric.project.name})`,
          section: `Metrics`,
          handler: () => navigate(`/user/projects?project_id=${metric.project_id}&metric_id=${metric.id}`),
        }))
        .sort((a, b) => a.title.localeCompare(b.title))
    )
  }

  useEffect(() => {
    if (ninjaKeys.current) ninjaKeys.current.data = hotkeys
  }, [projects, metrics, dashboards])

  return <ninja-keys placeholder="Search for projects and metrics" hideBreadcrumbs ref={ninjaKeys} class="dark" />
}

export default CommandPalette
