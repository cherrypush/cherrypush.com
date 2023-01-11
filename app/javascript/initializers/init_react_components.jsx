import React, { lazy, Suspense } from 'react'
import * as ReactDOM from 'react-dom/client'

const nodes = document.querySelectorAll('[data-component]')

Array.from(nodes).forEach((node) => {
  const props = JSON.parse(node.getAttribute('data-props'))
  const MyComponent = lazy(() => import(`../components/${node.getAttribute('data-component')}`))
  const root = ReactDOM.createRoot(node)
  root.render(<MyComponent {...props} />)
})
