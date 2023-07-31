# frozen_string_literal: true

filenames = Dir.entries('.')
filenames.each do |filename|
  next unless filename.include?('.png') || filename.include?('.jpg')
  output = "#{filename.split('.').first}.webp"
  `cwebp #{filename} -o #{output}`
  `rm #{filename}`
end
