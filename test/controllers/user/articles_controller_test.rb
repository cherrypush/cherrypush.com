# frozen_string_literal: true

require 'test_helper'

class User::ArticlesControllerTest < ApplicationIntegrationTest
  describe '#index' do
    it 'renders articles' do
      get(articles_path)
      assert_select 'h1', 'Articles'
      assert_select '.card', Article.all.first.title
    end
  end

  describe '#show' do
    it 'renders article' do
      article = Article.all.first
      get(article_path(article.permalink))
      assert_select 'h1', article.title
    end

    it 'redirect to articles if article not found' do
      get(article_path('not-found'))
      assert_redirected_to articles_path
    end
  end
end
