import React, { lazy } from 'react'
import * as ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { toast } from 'react-hot-toast'

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
    const Component = lazy(() => import(`../components/${node.getAttribute('data-component')}.jsx`))
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
