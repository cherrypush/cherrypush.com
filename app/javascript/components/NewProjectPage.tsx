import { Card } from 'flowbite-react'
import NewProjectInstructions from './NewProjectInstructions'

const NewProjectPage = () => (
  <div className="container">
    <Card>
      <h1>Create a new project</h1>
      <NewProjectInstructions />
    </Card>
  </div>
)

export default NewProjectPage
