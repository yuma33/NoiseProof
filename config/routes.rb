Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Defines the root path route ("/")
  # root "posts#index"
  root "recordings#home"
  resources :recordings, only: %i[index destroy] do
    resources :noise_reports, only: %i[new create show destroy edit update], shallow: true
  end

  resources :noise_reports, only: %i[index] do
    resources :certificates, only: %i[new create], shallow: true
  end

  resources :certificates, only: %i[create show index destroy]

  namespace :api do
    resources :recordings, only: %i[create show]
  end

  get "login", to: "user_sessions#new"
  post "login", to: "user_sessions#create"
  get "logout", to: "user_sessions#destroy"

  get "/form", to: "pages#form", as: :inquiry_form
  get "/policy", to: "pages#policy", as: :privacy_policy
  get "/term", to: "pages#term", as: :term
  get "/guide", to: "pages#guide", as: :usage_guide

  get "quick_report", to: "noise_reports#quick_new", as: "quick_noise_report"

  get "oauth/callback", to: "oauths#callback", as: :oauth_callback
  get "/login/:provider", to: "oauths#oauth", as: :login_at_provider
  get "oauth/:provider", to: "oauths#oauth", as: :oauth_at


  resources :users, only: %i[new create]
end
