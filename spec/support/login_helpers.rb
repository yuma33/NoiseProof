module LoginHelpers
  def login_user(user)
    post login_path, params: { email: user.email, password: 'password123' }
  end
end

RSpec.configure do |config|
  config.include LoginHelpers, type: :request
end
