# frozen_string_literal: true

class User::SettingsController < User::ApplicationController
  def update
    current_user.update!(weekly_report: params[:weekly_report])
  end
end
