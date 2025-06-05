class AnalysesController < ApplicationController
  def weekly
    @start_date = 6.days.ago.to_date
    @end_date = Date.today
    @start_time = @start_date.beginning_of_day
    @end_time = @end_date.end_of_day
    @date_range = (@start_date..@end_date).to_a

    @recordings_count = current_user.recordings
      .where(recorded_at: @start_time..@end_time)
      .group_by_day(:recorded_at)
      .count
    @reports_count = current_user.noise_reports
      .where(created_at: @start_time..@end_time)
      .group_by_day(:created_at)
      .count
    @certificates_count = current_user.certificates
      .where(created_at: @start_time..@end_time)
      .group_by_day(:created_at)
      .count

    @daily_stats = @date_range.index_with do |date|
      {
        recordings: @recordings_count[date] || 0,
        reports:    @reports_count[date] || 0,
        certificates:  @certificates_count[date] || 0
      }
    end

    @noise_stats = NoiseReport.noise_types.keys.index_with do |key|
      recordings = Recording.joins(:noise_report)
                            .where(noise_reports: { user_id: current_user.id, noise_type: key })
      {
        count: recordings.count,
        duration: recordings.sum(:duration),
        avg_max_db: recordings.maximum(:max_decibel)&.round(1) || 0.0,
        avg_db: recordings.average(:average_decibel)&.round(1) || 0.0
      }
    end

    @weekly_noise_stats = NoiseReport.noise_types.keys.index_with do |key|
      recordings = Recording.joins(:noise_report)
                            .where(noise_reports: { user_id: current_user.id, noise_type: key })
                            .where(recorded_at: @start_time..@end_time)
      {
        count: recordings.count,
        duration: recordings.sum(:duration),
        avg_max_db: recordings.maximum(:max_decibel)&.round(1) || 0.0,
        avg_db: recordings.average(:average_decibel)&.round(1) || 0.0
      }
    end
  end
end
