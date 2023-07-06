# frozen_string_literal: true

class Article
  class << self
    def all
      Dir.glob("#{Rails.root}/public/articles/*.md").map { |path| build(path) }
    end

    def find(permalink)
      all.find { |article| article.permalink == permalink }
    end

    private

    def build(path)
      OpenStruct.new(
        {
          title: title(path),
          content: content(path),
          permalink: File.basename(path, '.md'),
          images: images(content(path)),
        },
      )
    end

    def content(path)
      @content ||= File.read(path).lines[1..].join
    end

    def title(path)
      File.read(path).lines.first[2..].strip
    end

    def images(content)
      content
        .scan(/!\[.*\]\((.*)\)/)
        .flatten
        .map { |image| "#{Rails.application.routes.url_helpers.articles_url}/#{image}" }
    end
  end
end
