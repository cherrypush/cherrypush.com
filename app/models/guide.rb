# frozen_string_literal: true

class Guide
  class << self
    def all
      Dir.glob("#{Rails.root}/public/guides/*.md").map { |path| build(path) }
    end

    def find(permalink)
      all.find { |guide| guide.permalink == permalink }
    end

    private

    def build(path)
      OpenStruct.new(
        {
          title: title(path),
          content: content(path),
          permalink: File.basename(path, '.md'),
          images: images(content(path))
        }
      )
    end

    def content(path)
      File.read(path).lines[1..].join
    end

    def title(path)
      File.read(path).lines.first[2..].strip
    end

    def images(content)
      content
        .scan(/!\[.*\]\((.*)\)/)
        .flatten
        .map { |image| "#{Rails.application.routes.url_helpers.guides_url}/#{image}" }
    end
  end
end
