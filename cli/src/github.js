export const buildPermalink = (projectName, path, lineNumber) =>
  `https://github.com/${projectName}/blob/HEAD/${path}${lineNumber ? `#L${lineNumber}` : ''}`
