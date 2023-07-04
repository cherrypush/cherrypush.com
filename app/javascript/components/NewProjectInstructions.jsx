import React from 'react'

const NewProjectInstructions = () => (
  <>
    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Install the cherry CLI:</p>
    <div className="prose dark:prose-invert max-w-none mb-3">
      <pre className="mt-3">npm install -g cherrypush</pre>
    </div>
    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
      Set up a configuration file for your project with:
    </p>
    <div className="prose dark:prose-invert max-w-none mb-3">
      <pre className="mt-3">cherry init</pre>
    </div>
    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Verify that everything is working properly:</p>
    <div className="prose dark:prose-invert max-w-none mb-3">
      <pre className="mt-3">cherry run</pre>
    </div>
    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">You can now upload your metrics:</p>
    <div className="prose dark:prose-invert max-w-none mb-3">
      <pre className="mt-3">cherry push --api-key={current_user.api_key}</pre>
    </div>
  </>
)

export default NewProjectInstructions
