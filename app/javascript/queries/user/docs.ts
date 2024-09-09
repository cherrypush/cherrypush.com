import { useQuery } from '@tanstack/react-query'

export const useDocsShow = () =>
  useQuery(
    ['docs'],
    async () => {
      const response = await fetch('https://raw.githubusercontent.com/cherrypush/cherry-cli/main/README.md')
      return await response.text()
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )
