import React from 'react'
import { Card } from 'flowbite-react'
import NewProjectInstructions from './NewProjectInstructions'

const NewProjectPage = () => (
  <Card>
    <h1>Create a new project</h1>
    <NewProjectInstructions />
  </Card>
)

export default NewProjectPage
