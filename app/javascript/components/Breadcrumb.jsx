import { Breadcrumb as BaseBreadcrumb, Card } from 'flowbite-react'
import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Breadcrumb = ({ projects, metrics }) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const projectId = searchParams.get('project_id')
  const currentProject = projectId ? projects.find((project) => project.id === parseInt(projectId)) : null

  const metricId = searchParams.get('metric_id')
  const currentMetric = metricId ? metrics.find((metric) => metric.id === parseInt(metricId)) : null

  return (
    <Card className="mb-3">
      <BaseBreadcrumb>
        <BaseBreadcrumb.Item>
          <button onClick={() => navigate('/user/projects')} className="hover:text-white cursor-pointer">
            Projects
          </button>
        </BaseBreadcrumb.Item>

        {currentProject && (
          <BaseBreadcrumb.Item onClick={() => navigate(`/user/projects?project_id=${currentProject.id}`)}>
            <div className="hover:text-white cursor-pointer">{currentProject.name}</div>
          </BaseBreadcrumb.Item>
        )}

        {currentMetric && (
          <BaseBreadcrumb.Item>
            <div className="hover:text-white">{currentMetric.name}</div>
          </BaseBreadcrumb.Item>
        )}
      </BaseBreadcrumb>
    </Card>
  )
}
export default Breadcrumb
