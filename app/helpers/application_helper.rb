module ApplicationHelper
  def flash_color(type)
    case type.to_sym
    when :success then "bg-teal-200"
    when :danger  then "bg-rose-200"
    else "bg-gray-500"
    end
  end

  def formatted_duration(seconds)
    total_seconds = seconds.round
    minutes = total_seconds / 60
    secs = total_seconds % 60
    if minutes > 0 && secs > 0
      "#{minutes}分#{secs}秒"
    elsif minutes > 0
      "#{minutes}分"
    else
      "#{secs}秒"
    end
  end

  def formatted_max_decibel(db)
    rounded_db = (db + 83).round(1)
    max_decibel = [ rounded_db, 0 ].max
    "#{max_decibel} dB"
  end

  def noise_type_color(noise_type)
    case noise_type
    when "noise_type_other"
      "bg-gray-200 text-gray-800 px-2"
    when "footstep"
      "bg-yellow-100 text-yellow-800 pl-2"
    when "appliance"
      "bg-blue-100 text-blue-800 pl-2"
    when "human_voice"
      "bg-purple-100 text-purple-800 px-2"
    when "entertainment"
      "bg-pink-100 text-pink-800 pl-2"
    when "impact"
      "bg-red-100 text-red-800 px-2"
    when "pet"
      "bg-green-100 text-green-800 pl-2"
    when "external"
      "bg-orange-100 text-orange-800 px-2"
    else
      "bg-gray-200 text-gray-800" # デフォルト
    end
  end
end
