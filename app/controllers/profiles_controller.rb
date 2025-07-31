class ProfilesController < ApplicationController
  def show
    @profile = current_user
  end

  def edit
  end
end
