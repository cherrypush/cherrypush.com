# frozen_string_literal: true

namespace :demo do # rubocop:disable Metrics/BlockLength
  desc 'Refresh demo data'
  task refresh: :environment do
    metric_names = [
      'deprecated components',
      'deprecated methods',
      'deprecated imports',
      'redux',
      '@ts-expect-error',
      'eslint-disable',
      'axios legacy imports',
      'files without test coverage',
      'deprecated test setup',
    ].freeze

    team_names = 12.times.map { Faker::Company.industry.parameterize }

    ActiveRecord::Base.transaction do
      # take one existing project as reference
      base_project = Project.find_by(id: 9)
      raise 'Project not found' if base_project.blank?

      # clear duplicate demo projects
      demo_projects = Project.where(name: 'demo/project')
      demo_projects.first.destroy if demo_projects.count > 1

      # update demo project attributes
      demo_project = Project.find_or_create_by(name: 'demo/project')
      demo_project.user = User.find_by!(github_handle: 'fwuensche')
      demo_project.save

      # delete all previous demo data
      Occurrence.joins(report: :metric).where(metrics: { project_id: demo_project.id }).delete_all
      Report.joins(:metric).where(metrics: { project_id: demo_project.id }).delete_all
      demo_project.metrics.delete_all

      # create demo metrics
      base_project
        .metrics
        .first(metric_names.length)
        .each_with_index do |metric, index|
          demo_metric = Metric.create!(name: metric_names[index], project: demo_project)

          metric.reports.map do |report|
            new_report = report.dup
            new_report.created_at = demo_project.created_at
            new_report.updated_at = demo_project.updated_at
            new_report.metric_id = demo_metric.id
            new_report.value = report.value
            new_report.value_by_owner = report.value_by_owner.transform_keys { |_| "@#{team_names.sample}" }
            new_report.save!

            occurrences =
              report.occurrences.map do |_|
                {
                  name: Faker::File.file_name(dir: Faker::File.dir, ext: 'js'),
                  url: Faker::Internet.url,
                  owners: ["@#{team_names.sample}"],
                  report_id: new_report.id,
                }
              end
            Occurrence.upsert_all(occurrences) if occurrences.any?
          end
        end
    end
  end
end
