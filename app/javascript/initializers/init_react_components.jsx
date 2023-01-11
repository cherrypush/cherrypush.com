import React, { lazy, Suspense } from 'react'
import * as ReactDOM from 'react-dom/client'

document.addEventListener('turbo:load', () => {
  const nodes = document.querySelectorAll('[data-component]')
  Array.from(nodes).forEach((node) => {
    const Component = lazy(() => import(`../components/${node.getAttribute('data-component')}`))
    const props = JSON.parse(node.getAttribute('data-props'))
    ReactDOM.createRoot(node).render(<Component {...props} />)
  })
})
