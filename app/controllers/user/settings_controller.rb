# frozen_string_literal: true

class User::SettingsController < User::ApplicationController
  def update
    current_user.update!(user_params)
  end

  private

  def user_params
    params.require(:user).permit(:weekly_report, :github_handle)
  end
end
