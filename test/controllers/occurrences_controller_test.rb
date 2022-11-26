# frozen_string_literal: true

require 'test_helper'

class OccurrencesControllerTest < ActionDispatch::IntegrationTest
  test 'creates basic occurrences' do
    occurrences = build_list(:occurrence, 3)
    post(api_occurrences_path, params: { occurrences: occurrences.to_json })
    assert_response :ok
    assert_equal 3, Occurrence.count
  end

  test 'creates occurrences with owners' do
    occurrence = build(:occurrence, owners: ['@fwuensche'])
    post(api_occurrences_path, params: { occurrences: [occurrence].to_json })
    assert_response :ok
    assert_includes Occurrence.first.owners, '@fwuensche'
  end

  test 'cleans previous occurrences of the same project' do
    create(:occurrence, repo: 'rails/rails')
    create(:occurrence, repo: 'ruby/ruby')
    new_occurrence = build(:occurrence, repo: 'cherrypush/cherry-cli')
    post(api_occurrences_path, params: { occurrences: [new_occurrence].to_json })
    post(api_occurrences_path, params: { occurrences: [new_occurrence].to_json })
    assert_response :ok
    assert_equal 3, Occurrence.all.count
    assert_equal 1, Occurrence.where(repo: 'rails/rails').count
    assert_equal 1, Occurrence.where(repo: 'ruby/ruby').count
  end
end
