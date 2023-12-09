# frozen_string_literal: true

class ArticlesController < ApplicationController
  layout "landing"

  def index
    @articles = Article.all
  end

  def show
    @article = Article.find(params[:id])
    redirect_to articles_path unless @article
  end
end
