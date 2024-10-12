import useCurrentUser from '../hooks/useCurrentUser'

const NewProjectInstructions = () => {
  const user = useCurrentUser()

  return (
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
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Verify that everything is working as expected:
      </p>
      <div className="prose dark:prose-invert max-w-none mb-3">
        <pre className="mt-3">cherry run</pre>
      </div>

      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">If it looks good, then commit changes:</p>
      <div className="prose dark:prose-invert max-w-none mb-3">
        <pre className="mt-3">{`git add . && git commit -m 'setup cherry'`}</pre>
      </div>
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">And backfill your project with data:</p>
      <div className="prose dark:prose-invert max-w-none mb-3">
        <pre className="mt-3">cherry backfill --api-key={user?.api_key ?? '<YOUR_API_KEY>'}</pre>
      </div>
    </>
  )
}

export default NewProjectInstructions
