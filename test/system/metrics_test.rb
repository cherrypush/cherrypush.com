require 'application_system_test_case'

class MetricsTest < ApplicationSystemTestCase
  let!(:user) { create(:user) }
  let!(:project) { create(:project, user: user, name: 'rails/rails') }
  let!(:metric) { create(:metric, project: project, name: 'rubocop') }
  let!(:report1) do
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
  let!(:report2) do
    create(:report, metric: metric, value: 9, date: 2.days.ago, value_by_owner: { '@fwuensche' => 7, '@rchoquet' => 8 })
  end
  let!(:occurrence2a) do
    create(
      :occurrence,
      name: 'filepath:1',
      url: 'permalink/filepath:2',
      report: report2,
      owners: ['@fwuensche'],
      value: 1.2,
    )
  end
  let!(:occurrence2b) do
    create(
      :occurrence,
      name: 'filepath:2',
      url: 'permalink/filepath:2',
      report: report2,
      owners: %w[@fwuensche @rchoquet],
      value: 2.8,
    )
  end

  it 'applies filters to metrics' do
    sign_in(user, to: user_metrics_path)
    assert_text 'Project: rails/rails'

    click_on 'Filter by metric'
    within_dropdown { click_on 'rubocop' }

    within(all('tr')[1]) do
      assert_text '@rchoquet'
      assert_text '8'
    end

    within(all('tr')[2]) do
      assert_text '@fwuensche'
      assert_text '7'
    end

    assert_text 'filepath:1'
    assert_text '1.2'
    assert_text 'filepath:2'
    assert_text '2.8'

    click_on 'Filter by owner'
    within_dropdown { click_on '@rchoquet' }

    assert_text 'filepath:2'
    assert_no_text 'filepath:1'
  end

  private

  # TODO: extract into a helper
  def within_dropdown(&block)
    within(find('[data-test-id="dropdown"]', visible: true)) { yield }
  end
end
