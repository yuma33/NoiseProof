class PostsController < ApplicationController
  def index
    @q = Post.ransack(params[:q])
    @posts = @q.result(distinct: true).includes(:user).page(params[:page]).per(9)
  end

  def new
  @post = Post.new
  end

  def create
    @post = current_user.posts.new(post_params)
    if @post.save
      redirect_to post_params, success: t("defaults.flash_message.success_post", item: Post.model_name.human)
    else
      flash.now[:danger]= t("defaults.flash_message.not_success_post", item: Post.model_name.human)
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @post = Post.find(params[:id])
    @comment = Comment.new
    @comments = @post.comments
  end

  def edit
    @post = current_user.posts.find(params[:id])
  end

  def update
    @post = current_user.posts.find(params[:id])
    if @post.update(post_params)
      redirect_to posts_path, success: t("defaults.flash_message.success_edit_post", item: Post.model_name.human)
    else
      flash.now[:danger]= t("defaults.flash_message.not_success_edit_post", item: Post.model_name.human)
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @post = current_user.posts.find(params[:id])
    if @post.destroy!
      redirect_to posts_path, success: t("defaults.flash_message.destroy_post", item: Post.model_name.human), status: :see_other
    end
  end

  private
  def post_params
    params_hash = params.require(:post).permit(:title, :body, :noise_type,  :frequency)
    params_hash[:noise_type] = params_hash[:noise_type].to_i if params_hash[:noise_type].present?
    params_hash[:frequency] = params_hash[:frequency].to_i if params_hash[:frequency].present?
    params_hash
  end
end
