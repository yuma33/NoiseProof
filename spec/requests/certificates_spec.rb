require 'rails_helper'

RSpec.describe "certificates", type: :request do
  let(:user) { create(:user) }
  let(:recording) { create(:recording, user: user) }
  let!(:report1) { create(:noise_report, recording: recording, user: user, title: "レポート1") }
  let!(:report2) { create(:noise_report, recording: recording, user: user, title: "レポート2") }
  let!(:certificate) do
    create(:certificate, user: user).tap do |cert|
      cert.noise_reports << report1
    end
  end
  let(:params) { { report_ids: [ report1.id, report2.id ] } }

  before do
    login_user(user)
  end

  describe "POST /noise_reports/:noise_report_id/certificates" do
    context "正常系（作成が成功する場合）" do
      it "ステータスコードがリダイレクトになること" do
        post noise_report_certificates_path(report1), params: params
        expect(response).to have_http_status(:redirect)
      end

      it "証明書ページにリダイレクトされること" do
        post noise_report_certificates_path(report1), params: params
        certificate = Certificate.last
        expect(response).to redirect_to(certificate_path(certificate))
      end
    end
  end

  describe "GET /certificates" do
    context "診断書の一覧ページにアクセス" do
      it "ステータスコード200を返すこと" do
        get certificates_path
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "GET /certificates/:id" do
    context "診断書の詳細ページにアクセス" do
      it "ステータスコード200を返すこと" do
        get certificate_path(certificate)
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "DELETE /certificates/:id" do
    context "正常系（削除が成功する場合）" do
      it "ステータスコード303を返すこと" do
        delete certificate_path(certificate)
        expect(response).to have_http_status(:see_other)
      end

      it "一覧ページにリダイレクトされること" do
        delete certificate_path(certificate)
        expect(response).to redirect_to(certificates_path)
      end
    end
  end
end
