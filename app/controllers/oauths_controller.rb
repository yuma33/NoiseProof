class OauthsController < ApplicationController
  skip_before_action :require_login

  def oauth
    provider = params[:provider]
    redirect_to sorcery_login_url(provider), allow_other_host: true
  end

  def callback
    provider = params[:provider]

    unless provider.present?
      redirect_to root_path, danger: t("defaults.flash_message.not_success_login")
      return
    end

    if user = login_from(provider)
      auto_login(user)
      redirect_to root_path, success: t("defaults.flash_message.success_login")
    else
      user = create_from(provider)

      if user.save
        auto_login(user)
        redirect_to root_path, success: t("defaults.flash_message.success_login")
      else
        flash[:danger] = t("defaults.flash_message.not_success_login")
        redirect_to login_path
      end
    end
  end
end
