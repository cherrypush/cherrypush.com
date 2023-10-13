import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { lazy } from 'react'
import { createRoot } from 'react-dom/client'
import toast from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnMount: false,
    },
    mutations: {
      onError: (error) => toast.error(error.response.data?.error),
    },
  },
})

document.addEventListener('DOMContentLoaded', () => {
  const nodes = document.querySelectorAll('[data-component]')
  Array.from(nodes).forEach((node) => {
    const Component = lazy(() => import(`../components/${node.getAttribute('data-component')}.tsx`))
    const dataProps = node.getAttribute('data-props')
    const props = dataProps ? JSON.parse(dataProps) : {}
    createRoot(node).render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Component {...props} />
        </QueryClientProvider>
      </BrowserRouter>
    )
  })
})
