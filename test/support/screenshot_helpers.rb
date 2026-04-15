# frozen_string_literal: true

require 'mini_magick'
require 'open3'

module ScreenshotHelpers
  SCREENSHOTS_DIR = Rails.root.join('test/screenshots')
  SCREENSHOT_DIFF_THRESHOLD = 0.01 # 1% difference

  def capture_screenshot(name)
    return if ENV['CI']

    hide_toasts

    target_path = SCREENSHOTS_DIR.join("#{name}.png")
    FileUtils.mkdir_p(target_path.dirname)

    Tempfile.create(['screenshot', '.png']) do |temp_file|
      page.save_screenshot(temp_file.path) # rubocop:disable Lint/Debugger

      should_save = !File.exist?(target_path) || images_differ?(temp_file.path, target_path)
      FileUtils.cp(temp_file.path, target_path) if should_save
    end
  end

  private

  def hide_toasts
    page.execute_script("document.querySelector('[data-rht-toaster]')?.remove()")
  rescue StandardError # ignore if JS execution fails
    nil
  end

  def images_differ?(new_image_path, existing_image_path)
    new_image = MiniMagick::Image.open(new_image_path)
    existing_image = MiniMagick::Image.open(existing_image_path)
    return true if new_image.dimensions != existing_image.dimensions

    _, stderr, = Open3.capture3('compare', '-metric', 'AE', existing_image_path.to_s, new_image_path.to_s, 'null:')
    different_pixels = stderr.to_i
    total_pixels = existing_image.width * existing_image.height
    (different_pixels.to_f / total_pixels) > SCREENSHOT_DIFF_THRESHOLD
  end
end
