# frozen_string_literal: true

require_relative 'route_utils'

Rails.application.routes.draw do # rubocop:disable Metrics/BlockLength
  mount Blazer::Engine, at: 'blazer' # authentication method set in blazer.yml

  # AUTHENTICATION ROUTES
  get 'auth/:provider/callback', to: 'sessions#create'
  get '/sign_out', to: 'sessions#destroy', as: :signout
  get '/auth/github', as: :github_sign_in

  # CLI ROUTES
  namespace :api do
    resource :push, only: :create
    resources :contributions, only: :create
    resources :metrics, only: :index
  end

  # SPA ROUTES
  namespace :user do # rubocop:disable Metrics/BlockLength
    constraints(->(request) { request.format == :json }) do
      resource :favorites, only: %i[create destroy]
      resources :authorization_requests, only: %i[index create destroy]
      resources :authorizations, only: %i[index new create destroy]
      resources :charts, only: %i[create update destroy]
      resources :contributions, only: %i[index]
      resources :dashboards, only: %i[index show create update destroy]
      nested_resources :metrics, only: %i[index show destroy] do
        resources :occurrences, only: %i[index]
      end
      resource :metric_watchers, only: %i[create destroy]
      resources :notifications, only: %i[index] do
        put 'mark_as_seen', on: :member
        put 'mark_all_as_seen', on: :collection
      end
      resources :owners, only: %i[index]
      resources :projects, only: %i[index update destroy]
      resource :settings, only: %i[update]
      resources :users, only: %i[index]
    end

    constraints(->(request) { request.format == :html }) do
      %w[
        authorizations
        contributions
        dashboards
        dashboards/:dashboard_id/charts/:chart_id/edit
        dashboards/:dashboard_id/charts/new
        dashboards/:id
        docs
        notifications
        projects
        projects/new
        settings
      ].each { |route| get route, to: 'application#spa' }
    end
  end

  # STATIC ROUTES
  get :demo, to: 'pages#demo'
  get :docs, to: 'pages#docs'
  get :pricing, to: 'pages#pricing'
  get :privacy, to: 'pages#privacy'
  get :terms, to: 'pages#terms'

  resources :articles, only: %i[index show]

  root 'pages#home'
end
