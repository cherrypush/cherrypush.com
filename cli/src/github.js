export const buildRepoURL = (projectName) => `https://github.com/${projectName}`

export const buildPermalink = (projectName, path, lineNumber) =>
  `${buildRepoURL(projectName)}/blob/HEAD/${path}${lineNumber ? `#L${lineNumber}` : ''}`
