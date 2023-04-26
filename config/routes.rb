# frozen_string_literal: true

require_relative 'route_utils'

Rails.application.routes.draw do
  mount Blazer::Engine, at: 'blazer' # authentication method set in blazer.yml

  get 'auth/:provider/callback', to: 'sessions#create'
  get '/sign_out', to: 'sessions#destroy', as: :signout
  get '/auth/github', as: :github_sign_in

  namespace :api do
    resource :push, only: :create
    resources :contributions, only: :create
  end

  # SPA ROUTES
  namespace :user do
    constraints(->(request) { request.format == :json }) do
      resource :favorites, only: %i[create destroy]
      resources :authorization_requests, only: %i[index create destroy]
      resources :authorizations, only: %i[index new create destroy]
      resources :charts, only: %i[create update destroy]
      resources :dashboards, only: %i[index show create update destroy]
      nested_resources :metrics, only: %i[index show destroy] do
        resources :occurrences, only: %i[index]
      end
      resources :owners, only: %i[index]
      resources :projects, only: %i[index update destroy]
      resource :settings, only: %i[update]
      resources :users, only: %i[index]
    end

    constraints(->(request) { request.format == :html }) do
      %w[
        docs
        projects
        dashboards
        dashboards/:id
        dashboards/:dashboard_id/charts/new
        dashboards/:dashboard_id/charts/:chart_id/edit
        projects/new
        authorizations
        settings
        user/docs
      ].each { |route| get route, to: 'application#spa' }
    end
  end

  get :demo, to: 'pages#demo'
  get :docs, to: 'pages#docs'
  get :pricing, to: 'pages#pricing'
  get :privacy, to: 'pages#privacy'
  get :terms, to: 'pages#terms'

  root 'pages#home'
end
