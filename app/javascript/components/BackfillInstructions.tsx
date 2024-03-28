import useCurrentUser from '../hooks/useCurrentUser'

const BackfillInstructions = () => {
  const user = useCurrentUser()

  return (
    <div className="card mb-3">
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Fill up your project with historic data by running the following command:
      </p>
      <div className="prose dark:prose-invert max-w-none mb-3">
        <pre className="mt-3">cherry backfill --api-key={user.api_key}</pre>
      </div>
    </div>
  )
}
export default BackfillInstructions
