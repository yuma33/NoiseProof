module ApplicationHelper
  def flash_color(type)
    case type.to_sym
    when :success then "bg-teal-200"
    when :danger  then "bg-rose-200"
    else "bg-gray-500"
    end
  end
end
