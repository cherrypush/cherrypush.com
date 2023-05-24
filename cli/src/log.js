let verbose = false

export const setVerboseMode = () => (verbose = true)

export const debug = (...args) => verbose && console.debug('[DEBUG]', ...args)
