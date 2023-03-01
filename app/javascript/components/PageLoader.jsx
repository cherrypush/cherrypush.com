import { Card, Spinner } from 'flowbite-react'
import React from 'react'

const PageLoader = ({ ...rest }) => (
  <Card className="text-center">
    <Spinner />
  </Card>
)

export default PageLoader
