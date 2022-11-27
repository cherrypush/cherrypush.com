# frozen_string_literal: true

Rails.application.routes.draw do
  get 'auth/:provider/callback', to: 'sessions#create'
  get '/sign_out', to: 'sessions#destroy', as: :signout

  namespace :api do
    resources :occurrences, only: :create
  end

  resources :projects, only: %i[index show]

  get :privacy, to: 'pages#privacy'
  get :terms, to: 'pages#terms'

  root 'pages#home'
end
