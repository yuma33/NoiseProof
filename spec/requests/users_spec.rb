require 'rails_helper'

RSpec.describe "users", type: :request do
  describe "GET /new" do
    context "ユーザーの新規登録ページにアクセス" do
      it "ステータスコード200を返す" do
        get new_user_path
        expect(response).to have_http_status(:success)
      end
    end
  end
end