import { Card, Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react'

import { Grid } from '@mui/material'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useDocsShow } from '../queries/user/docs'

type Heading = {
  level: number
  text: string
  anchor: string
}

const markdownComponentsMapping = {
  // @ts-expect-error - TODO
  h1: (props) => {
    if (!(typeof props.children === 'string')) return null
    const firstElement = props.node?.position?.start.line === 1
    const id = props.children.toLowerCase().replace(/\s+/g, '-')
    return (
      <>
        {firstElement ? null : <hr />}
        <h1 id={id} className={firstElement ? '' : 'mt-12'}>
          {props.children}
        </h1>
      </>
    )
  },
  // @ts-expect-error - TODO
  h2: ({ children }) => {
    if (!(typeof children === 'string')) return null
    const id = children.toLowerCase().replace(/\s+/g, '-')
    return (
      <h2 id={id} className="mt-8">
        {children}
      </h2>
    )
  },
}

const DocsPage = () => {
  const { data: docsContent } = useDocsShow()

  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    if (!docsContent) return

    const extractHeadings = (markdown: string) => {
      const headings = []
      const codeBlockRegex = /```[\s\S]*?```/g // Regex to match code blocks
      const headingRegex = /^(#{1,6})\s+(.*)$/gm // Regex to match headings

      // Remove code blocks from markdown before processing headings
      const markdownWithoutCode = markdown.replace(codeBlockRegex, '')

      let match
      while ((match = headingRegex.exec(markdownWithoutCode)) !== null) {
        const level = match[1].length // Number of '#' defines the level
        const text = match[2]
        const anchor = text.toLowerCase().replace(/\s+/g, '-')

        headings.push({ level, text, anchor })
      }

      // Only add headings with level 1 and 2
      setHeadings(headings.filter((heading) => heading.level <= 2))
    }

    if (docsContent) {
      extractHeadings(docsContent)
    }
  }, [docsContent])

  return (
    <div className="container">
      <h1 className="mb-6">Docs</h1>
      <Card>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <div className="border rounded mb-6 md:border-none md:h-screen md:sticky md:top-0">
              <Sidebar className="w-full">
                <Sidebar.ItemGroup>
                  {headings.map(({ anchor, level, text }, index) => (
                    <Sidebar.Item
                      href={`#${anchor}`}
                      key={index}
                      style={{
                        marginLeft: (level - 1) * 20,
                        fontWeight: level === 1 ? 'bold' : 'normal',
                      }}
                    >
                      {text}
                    </Sidebar.Item>
                  ))}
                </Sidebar.ItemGroup>
              </Sidebar>
            </div>
          </Grid>

          <Grid item xs={12} md={8}>
            <div className="prose dark:prose-invert w-full max-w-full py-4 pr-3">
              {docsContent && (
                // @ts-expect-error - TODO
                <Markdown remarkPlugins={[remarkGfm]} components={markdownComponentsMapping}>
                  {docsContent}
                </Markdown>
              )}
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  )
}

export default DocsPage
