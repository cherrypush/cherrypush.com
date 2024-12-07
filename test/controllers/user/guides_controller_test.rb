# frozen_string_literal: true

require 'test_helper'

class User::GuidesControllerTest < ApplicationIntegrationTest
  describe '#index' do
    it 'renders guides' do
      get(guides_path)
      assert_select 'h1', 'Guides'
      assert_select '.card', Guide.all.first.title
    end
  end

  describe '#show' do
    it 'renders guide' do
      guide = Guide.all.first
      get(guide_path(guide.permalink))
      assert_select 'h1', guide.title
    end

    it 'redirect to guides if guide not found' do
      get(guide_path('not-found'))
      assert_redirected_to guides_path
    end
  end
end
