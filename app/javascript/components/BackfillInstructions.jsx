import React, { useState, Fragment } from 'react'

const BackfillInstructions = ({ currentUser }) => (
  <div class="card mb-3">
    <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
      Fill up your project with historic data by running the following command:
    </p>
    <div class="prose dark:prose-invert max-w-none mb-3">
      <pre class="mt-3">cherry backfill --api-key={currentUser.api_key}</pre>
    </div>
  </div>
)

export default BackfillInstructions
