require 'rails_helper'

RSpec.describe "noise_reports", type: :request do

  let(:user) { create(:user) }
  let(:recording) { create(:recording, user: user) }
  let(:noise_report) { create(:noise_report, user: user, recording: recording) }
  let(:params) { { noise_report: { location: "新宿区", title: "テストタイトル" } } }

  before do
    login_user(user)
  end

  describe "GET /noise_reports" do
    context "レポートの一覧ページにアクセス" do
      it "ステータスコード200を返す" do
        get noise_reports_path
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "GET /recordings/:recording_id/noise_reports/new" do
    context "レポートの新規作成ページにアクセス" do
      it "ステータスコード200を返す" do
        get new_recording_noise_report_path(recording)
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "GET /quick_report" do
    context "クイックレポートページにアクセス" do
      it "ステータスコードがリダイレクトになること" do
        create(:recording, user: user)
        get quick_noise_report_path
        expect(response).to have_http_status(:redirect)
      end
      it "リダイレクト先がクイックレポート作成ページであること" do
        create(:recording, user: user)
        get quick_noise_report_path
        expect(response).to redirect_to(new_recording_noise_report_path(Recording.last))
      end
    end
  end

  describe "POST /recordings/:recording_id/noise_reports" do
    context "正常系（作成が成功する場合）" do
      it "ステータスコードがリダイレクトになること" do
        post recording_noise_reports_path(recording), params: params
        expect(response).to have_http_status(:redirect)
      end

      it "リダイレクト先が詳細ページであること" do
        post recording_noise_reports_path(recording), params: params
        expect(response).to redirect_to(noise_report_path(NoiseReport.last))
      end
    end
  end

  describe "GET /noise_reports/:id/edit" do
    context "レポートの編集ページにアクセス" do
      it "ステータスコード200を返す" do
        get edit_noise_report_path(noise_report)
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "GET /noise_reports/:id" do
    context "レポートの詳細ページにアクセス" do
      it "ステータスコード200を返す" do
        get noise_report_path(noise_report)
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "PATCH /noise_reports/:id" do
    context "正常系（編集が成功する場合）" do
      it "ステータスコードがリダイレクトになること" do
        patch noise_report_path(noise_report), params: params
        expect(response).to have_http_status(:redirect)
      end

      it "リダイレクト先が詳細ページであること" do
        patch noise_report_path(noise_report), params: params
        expect(response).to redirect_to(noise_report_path(noise_report))
      end
    end
  end
end