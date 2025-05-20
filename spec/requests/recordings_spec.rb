require 'rails_helper'

RSpec.describe "recordings", type: :request do
  let(:user) { create(:user) }
  let(:recording) { create(:recording, user: user) }

  describe "GET /home" do
    context "ホームページにアクセス" do
      it "ステータスコード200を返す" do
        get root_path
        expect(response).to have_http_status(:success)
      end
    end
  end



  describe "GET /index" do
    context "録音の一覧ページにアクセス" do
      it "ステータスコード200を返す" do
        login_user(user)
        get recordings_path
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "DELETE /recordings/:id" do
    context "正常系（削除が成功する場合）" do
      it "ステータスコード303を返す" do
        login_user(user)
        delete recording_path(recording)
        expect(response).to have_http_status(:see_other)
      end
    end
  end
end
