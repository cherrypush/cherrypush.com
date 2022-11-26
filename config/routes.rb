# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    resources :occurrences, only: :create
  end

  resources :projects, only: %i[index show]

  root 'pages#home'
end
