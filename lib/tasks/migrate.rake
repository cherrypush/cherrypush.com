# frozen_string_literal: true

namespace :migrate do # rubocop:disable Metrics/BlockLength
  desc 'Migrate data'
  task refresh: :environment do
    # NEW METRICS
    Project.all.each do |project|
      project.deprecated_metrics.each { |metric| Metric.create!(project_id: metric.project.id, name: metric.name) }
    end

    # NEW REPORTS
    DeprecatedReport.all.each do |report|
      report.metrics.each do |metric_name, metric|
        new_metric = Metric.find_by(name: metric_name, project_id: report.project_id)
        next if new_metric.nil?

        Report.create!(
          date: report.commit_date,
          value: metric['total'],
          value_by_owner: metric['owners'],
          metric_id: new_metric.id,
        )
      end
    end
  end
end
