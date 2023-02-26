import { Turbo } from '@hotwired/turbo-rails'
import React, { useEffect, useRef } from 'react'
import 'ninja-keys'
import { useProjectsIndex } from '../queries/user/projects'
import { useMetricsIndex } from '../queries/user/metrics'

const CommandPalette = () => {
  const { data: projects } = useProjectsIndex()
  const { data: metrics } = useMetricsIndex()

  const ninjaKeys = useRef(null)

  let hotkeys = [
    {
      id: 'projects',
      title: 'List All Projects',
      section: 'Links',
      handler: () => Turbo.visit('/user/projects'),
    },
    {
      id: 'docs',
      title: 'Open Docs',
      section: 'Links',
      handler: () => Turbo.visit('/docs'),
    },
  ]

  if (projects) {
    hotkeys = hotkeys.concat(
      projects.map((project) => ({
        id: `project-${project.id}`,
        title: project.name,
        section: 'Projects',
        handler: () => Turbo.visit(`/user/metrics?project_id=${project.id}`),
      }))
    )
  }

  if (metrics) {
    hotkeys = hotkeys.concat(
      metrics.map((metric) => ({
        id: `metric-${metric.id}`,
        title: metric.name,
        section: metric.project_name,
        handler: () => Turbo.visit(`/user/metrics?project_id=${metric.project_id}&metric_id=${metric.id}`),
      }))
    )
  }

  useEffect(() => {
    if (ninjaKeys.current) {
      ninjaKeys.current.data = hotkeys
    }
  }, [projects, metrics])

  return <ninja-keys hideBreadcrumbs ref={ninjaKeys}></ninja-keys>
}

export default CommandPalette
