require 'application_system_test_case'

class MetricsTest < ApplicationSystemTestCase
  let!(:user) { create(:user) }
  let!(:project) { create(:project, user: user, name: 'rails/rails') }
  let!(:metric) { create(:metric, project: project, name: 'rubocop') }
  let!(:last_report) do
    create(
      :report,
      metric: metric,
      value: 12,
      date: 1.day.ago,
      value_by_owner: {
        '@fwuensche' => 10,
        '@rchoquet' => 8,
      },
    )
  end
  let!(:previous_report) do
    create(:report, metric: metric, value: 9, date: 2.days.ago, value_by_owner: { '@fwuensche' => 7, '@rchoquet' => 8 })
  end

  let!(:occurrence_1) do
    create(
      :occurrence,
      text: 'filepath:1',
      url: 'permalink/filepath:2',
      report: last_report,
      owners: ['@fwuensche'],
      value: 1.2,
    )
  end

  let!(:occurrence_2) do
    create(
      :occurrence,
      text: 'filepath:2',
      url: 'permalink/filepath:2',
      report: last_report,
      owners: %w[@fwuensche @rchoquet],
      value: 2.8,
    )
  end

  it 'applies filters to metrics' do
    sign_in(user, to: user_metrics_path)
    assert_text 'rails/rails'
    find('tr', text: 'rubocop').click
    assert_text 'Owners'

    within(all('tr')[1]) do
      assert_text '@fwuensche'
      assert_text '10'
    end

    within(all('tr')[2]) do
      assert_text '@rchoquet'
      assert_text '8'
    end

    assert_text 'filepath:1'
    assert_text '1.2'
    assert_text 'filepath:2'
    assert_text '2.8'

    find('tr', text: '@rchoquet', match: :first).click
    assert_text 'filepath:2'
    assert_no_text 'filepath:1'
  end

  private

  # TODO: extract into a helper
  def within_dropdown(&block)
    within(find('[data-test-id="dropdown"]', visible: true)) { yield }
  end
end
