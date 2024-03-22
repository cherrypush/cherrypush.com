# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: 'Flavio Wuensche <flavio@cherrypush.com>'
  layout 'mailer'
end
