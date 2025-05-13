class PagesController < ApplicationController
  skip_before_action :require_login, only: %i[form policy term guide]
  def form; end

  def policy; end

  def term; end

  def guide; end
end
