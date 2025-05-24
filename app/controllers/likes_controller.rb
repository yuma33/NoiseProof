class LikesController < ApplicationController
  def create
    post = Post.find(params[:post_id])
    current_user.like(post)
    redirect_to posts_path, success: t("defaults.flash_message.success_like")
  end

  def destroy
    post = current_user.likes.find(params[:id]).post
    current_user.unlike(post)
    redirect_to posts_path, success: t("defaults.flash_message.not_success_like"), status: :see_other
  end
end
