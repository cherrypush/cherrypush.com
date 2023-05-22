import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { lazy } from 'react'
import * as ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

document.addEventListener('turbo:load', () => {
  const nodes = document.querySelectorAll('[data-component]')
  Array.from(nodes).forEach((node) => {
    const Component = lazy(() => import(`../components/${node.getAttribute('data-component')}.tsx`))
    const props = JSON.parse(node.getAttribute('data-props'))
    ReactDOM.createRoot(node).render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Component {...props} />
        </QueryClientProvider>
      </BrowserRouter>
    )
  })
})
