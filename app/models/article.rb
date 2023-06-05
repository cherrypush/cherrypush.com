# frozen_string_literal: true

class Article
  class << self
    def all
      Dir.glob("#{Rails.root}/content/articles/*.md").map { |path| build(path) }
    end

    def find(permalink)
      all.find { |article| article.permalink == permalink }
    end

    private

    def build(path)
      OpenStruct.new(
        {
          title: File.read(path).lines.first[2..-1].strip,
          content: File.read(path).lines[1..-1].join,
          permalink: File.basename(path, '.md'),
        },
      )
    end
  end
end
