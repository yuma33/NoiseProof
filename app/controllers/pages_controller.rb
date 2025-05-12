class PagesController < ApplicationController
  skip_before_action :require_login, only: %i[form policy term]
  def form
  end

  def policy
  end

  def term
  end
end
