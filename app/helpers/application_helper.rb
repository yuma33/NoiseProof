module ApplicationHelper
  def flash_color(type)
    case type.to_sym
    when :success then "bg-teal-200"
    when :danger  then "bg-rose-200"
    else "bg-gray-500"
    end
  end

  def formatted_duration(seconds)
    minutes = seconds / 60
    secs = seconds % 60
    if minutes > 0 && secs > 0
      "録音時間 : #{minutes}分#{secs}秒"
    elsif minutes > 0
      "録音時間 : #{minutes}分"
    else
      "|  録音時間 : #{secs}秒"
    end
  end

  def formatted_max_decibel(db)
    rounded_db = (db + 83).round(1)
    max_decibel = [rounded_db, 0].max
    "#{max_decibel} dB"
  end
end
