class ApplicationController < ActionController::Base
  require "react/rails/component_mount"
  before_action :require_login
  add_flash_types :success, :danger

  private

  def not_authenticated
    redirect_to login_path
  end
end
