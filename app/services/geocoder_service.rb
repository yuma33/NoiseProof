class GeocoderService
  def self.reverse_geocode(place_id)
    api_key = ENV['GOOGLE_MAPS_API_KEY']
    url = "https://maps.googleapis.com/maps/api/geocode/json?place_id=#{place_id}&key=#{api_key}&language=ja"

    begin
      response = HTTP.get(url)
      parsed = JSON.parse(response.body.to_s)
      if parsed["status"] == "OK" && parsed["results"].present?
        parsed["results"][0]["formatted_address"] # 文字列で返す（hashではなく）
      else
        nil
      end
    rescue => e
      Rails.logger.error("Geocoding error: #{e.message}")
      nil
    end
  end
end
