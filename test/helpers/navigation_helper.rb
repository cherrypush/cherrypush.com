# frozen_string_literal: true

module NavigationHelper
  def mui_select(field, from:)
    find_field(from, visible: false).first(:xpath, './/..').click
    find('li', text: field, match: :prefer_exact).click
  end
end
