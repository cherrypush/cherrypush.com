# frozen_string_literal: true

require 'mini_magick'
require 'open3'

module ScreenshotHelpers
  SCREENSHOTS_DIR = Rails.root.join('test/screenshots')
  SCREENSHOT_DIFF_THRESHOLD = 0.01 # 1% difference

  def capture_screenshot(name)
    return if ENV['CI']

    disable_animations

    target_path = SCREENSHOTS_DIR.join("#{name}.png")
    FileUtils.mkdir_p(target_path.dirname)

    Tempfile.create(['screenshot', '.png']) do |temp_file|
      with_toasts_hidden { page.save_screenshot(temp_file.path) } # rubocop:disable Lint/Debugger

      should_save = !File.exist?(target_path) || images_differ?(temp_file.path, target_path)
      FileUtils.cp(temp_file.path, target_path) if should_save
    end
  end

  private

  def disable_animations
    page.execute_script(<<~JS)
      if (!document.getElementById('disable-animations')) {
        const style = document.createElement('style');
        style.id = 'disable-animations';
        style.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }';
        document.head.appendChild(style);
      }
    JS
  rescue StandardError
    nil
  end

  # Hides react-hot-toast while yielding. Targets the Toaster container by
  # its distinctive inline styles and toast items by their aria attributes,
  # so no production-side hook is needed.
  def with_toasts_hidden
    page.execute_script(<<~JS)
      const style = document.createElement('style');
      style.id = 'hide-toasts';
      style.textContent = [
        'div[style*="z-index: 9999"][style*="pointer-events: none"]',
        '[role="status"][aria-live]'
      ].join(',') + ' { display: none !important; }';
      document.head.appendChild(style);
    JS
    yield
  ensure
    page.execute_script("document.getElementById('hide-toasts')?.remove()")
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
