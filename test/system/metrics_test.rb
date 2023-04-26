require 'application_system_test_case'

class MetricsTest < ApplicationSystemTestCase
  let!(:user) { create(:user) }
  let!(:project) { create(:project, user: user, name: 'rails/rails') }
  let!(:eslint_metric) { create(:metric, project: project, name: 'eslint') }
  let!(:eslint_report) { create(:report, metric: eslint_metric, value: 60, date: 4.days.ago) }
  let!(:rubocop_metric) { create(:metric, project: project, name: 'rubocop') }
  let!(:rubocop_report) do
    create(
      :report,
      metric: rubocop_metric,
      value: 12,
      date: 1.day.ago,
      value_by_owner: {
        '@fwuensche' => 10,
        '@rchoquet' => 8,
      },
    )
  end
  let!(:previous_report) do
    create(
      :report,
      metric: rubocop_metric,
      value: 9,
      date: 2.days.ago,
      value_by_owner: {
        '@fwuensche' => 7,
        '@rchoquet' => 8,
      },
    )
  end

  let!(:occurrence_1) do
    create(
      :occurrence,
      text: 'filepath:1',
      url: 'permalink/filepath:2',
      report: rubocop_report,
      owners: ['@fwuensche'],
      value: 1.2,
    )
  end

  let!(:occurrence_2) do
    create(
      :occurrence,
      text: 'filepath:2',
      url: 'permalink/filepath:2',
      report: rubocop_report,
      owners: %w[@fwuensche @rchoquet],
      value: 2.8,
    )
  end

  let!(:contribution) do
    create(:contribution, metric: rubocop_metric, author_name: 'Flavinho', commit_date: 1.week.ago)
  end

  it 'applies filters to metrics' do
    sign_in(user, to: user_projects_path)
    find('tr', text: 'rails/rails').click
    assert_text 'eslint'
    fill_in 'Filter metrics', with: 'rubo'
    assert_no_text 'eslint'
    find('tr', text: 'rubocop').click

    # Contributions
    assert_text 'Contributions'
    assert_text 'Flavinho'
    assert_text '1 week ago'

    # Occurrences
    assert_equal ['filepath:2 @fwuensche, @rchoquet 2.8', 'filepath:1 @fwuensche 1.2'], all('tr').map(&:text).last(2)

    # Apply filters
    find('tr', text: '@rchoquet', match: :first).click
    fill_in('Filter by owners', with: '@rchoquet')
    find('li', text: '@rchoquet (8)').click
    assert_equal ['NAME OWNERS VALUE', 'filepath:2 @fwuensche, @rchoquet 2.8'], all('tr').map(&:text).last(2)
  end
end
