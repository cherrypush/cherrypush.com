# frozen_string_literal: true

namespace :demo do # rubocop:disable Metrics/BlockLength
  desc 'Refresh demo data'
  task refresh: :environment do
    METRIC_NAME_MAPPING = {
      'Deprecated Components' => 'deprecated components',
      'Deprecated Props' => 'deprecated methods',
      'Legacy FS access' => 'deprecated imports',
      'formApi' => 'RxJS',
      '@ts-expect-error' => '@ts-expect-error',
      'eslint-disable-next-line' => 'eslint-disable',
      'useAsyncTask' => 'axios legacy imports',
      'let without bang!' => 'deprecated test setup',
    }.freeze

    ActiveRecord::Base.transaction do
      # take one existing project as reference
      base_project = Project.find_by(id: 9)
      return if base_project.blank?

      # clear duplicate demo projects
      demo_projects = Project.where(name: 'demo/project')
      demo_projects.first.destroy if demo_projects.count > 1

      # update demo project attributes
      demo_project = Project.find_or_create_by(name: 'demo/project')
      demo_project.name = 'demo/project'
      demo_project.user = User.find_by!(github_handle: 'fwuensche')
      demo_project.save

      # duplicate reports with anonymized data
      demo_project.reports.delete_all
      Report.insert_all(demo_reports(base_project, demo_project))

      # duplicate contributions with anonymized data
      demo_project.contributions.delete_all
      Contribution.insert_all(demo_contributions(base_project, demo_project))
    end
  end

  private

  def demo_reports(base_project, demo_project) # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
    base_project.reports.map do |report|
      new_report = report.dup
      new_report.created_at = demo_project.created_at
      new_report.updated_at = demo_project.updated_at
      new_report.commit_sha = SecureRandom.uuid
      new_report.project_id = demo_project.id
      new_report.metrics =
        report
          .metrics
          .map do |key, value|
            next if METRIC_NAME_MAPPING[key].blank?
            [
              METRIC_NAME_MAPPING[key],
              {
                total: value['total'],
                owners: value['owners'].transform_keys { |_| "@#{Faker::Company.industry.parameterize}" },
              },
            ]
          end
          .compact
          .to_h
      new_report.attributes.except('id')
    end
  end

  def demo_contributions(base_project, demo_project) # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
    base_project.contributions.map do |contribution|
      new_contribution = contribution.dup
      new_contribution.created_at = contribution.created_at
      new_contribution.updated_at = contribution.updated_at
      new_contribution.author_name = Faker::ProgrammingLanguage.creator
      new_contribution.author_email = "#{new_contribution.author_name.parameterize}@example.com"
      new_contribution.commit_sha = SecureRandom.uuid
      new_contribution.project_id = demo_project.id
      new_contribution.metrics = contribution.metrics.transform_keys { |key| METRIC_NAME_MAPPING[key] }
      new_contribution.attributes.except('id')
    end
  end
end
