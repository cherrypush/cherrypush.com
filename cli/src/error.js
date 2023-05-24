export const panic = (message) => {
  console.error(`❌ ${message}`)
  process.exit(1)
}
