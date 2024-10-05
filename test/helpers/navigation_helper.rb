# frozen_string_literal: true

module NavigationHelper
  def mui_select(field, from:)
    find_field(from, visible: false).first(:xpath, './/..').click
    find('li', text: field, match: :prefer_exact).click
  end

  def mui_check(text)
    find('label', text: text).find('input', visible: false).set(true)
  end

  def mui_uncheck(text)
    find('label', text: text).find('input', visible: false).set(false)
  end
end
