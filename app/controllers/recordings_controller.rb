class RecordingsController < ApplicationController
  skip_before_action :require_login, only: %i[home]

  def home
  end
end
