# frozen_string_literal: true

Rails.application.routes.draw do
  mount Blazer::Engine, at: 'blazer' # authentication method set in blazer.yml

  get 'auth/:provider/callback', to: 'sessions#create'
  get '/sign_out', to: 'sessions#destroy', as: :signout
  get '/auth/github', as: :github_sign_in

  namespace :api do
    resources :reports, only: [] do # TODO: remove this controller
      get :last, on: :collection
    end
    resource :push, only: :create
  end

  # SPA ROUTES
  namespace :user do
    constraints(->(request) { request.format == :json }) do
      resource :favorites, only: %i[create destroy]
      resources :authorization_requests, only: %i[index create destroy]
      resources :authorizations, only: %i[index new create destroy]
      resources :charts, only: %i[create destroy]
      resources :dashboards, only: %i[index show create destroy]
      resources :metrics, only: %i[index show destroy]
      resources :owners, only: %i[index]
      resources :projects, only: %i[index update destroy]
      resources :users, only: %i[index]
    end

    constraints(->(request) { request.format == :html }) do
      %w[docs projects dashboards dashboards/:id projects/new authorizations settings user/docs].each do |route|
        get route, to: 'application#spa'
      end
    end
  end

  get :demo, to: 'pages#demo'
  get :docs, to: 'pages#docs'
  get :pricing, to: 'pages#pricing'
  get :privacy, to: 'pages#privacy'
  get :terms, to: 'pages#terms'

  root 'pages#home'
end
