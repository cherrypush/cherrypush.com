# frozen_string_literal: true

Rails.application.routes.draw do
  get 'auth/:provider/callback', to: 'sessions#create'
  get '/sign_out', to: 'sessions#destroy', as: :signout
  get '/auth/github', as: :github_sign_in

  namespace :api do
    resources :reports, only: :create do
      get :last, on: :collection
    end
    resource :push, only: :create
  end

  # namespace dedicated to user authenticated routes
  namespace :user do
    resources :projects, only: %i[index update destroy] do
      post :privatize, on: :member
      post :publicize, on: :member
    end
    resource :settings, only: :show
    resources :authorizations, only: %i[index new create destroy]
    resources :metrics, only: %i[index]
  end

  resources :projects, only: %i[index]

  get :privacy, to: 'pages#privacy'
  get :pricing, to: 'pages#pricing'
  get :terms, to: 'pages#terms'
  get :docs, to: 'pages#docs'

  root 'pages#home'
end
