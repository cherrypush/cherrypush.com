// const { exec } = require('child_process')
import { exec } from 'child_process'

describe('cherry', () => {
  test('explains the usage', (done) => {
    exec('node bin/cherry.js', (error, _stdout, stderr) => {
      expect(error).not.toBeNull()
      expect(stderr).toContain('Usage: cherry [options] [command]')
      expect(stderr).toContain('init')
      expect(stderr).toContain('run')
      expect(stderr).toContain('push')
      expect(stderr).toContain('diff')
      expect(stderr).toContain('backfill')
      expect(stderr).toContain('diff')
      expect(stderr).toContain('help')
      done()
    })
  })
})

describe('cherry run', () => {
  test('alerts about missing config file', (done) => {
    exec('node bin/cherry.js run', (_error, stdout) => {
      expect(stdout).toContain('No .cherry.js file found, using default configuration')
      done()
    })
  })

  test('falls back to loc plugin', (done) => {
    exec('node bin/cherry.js run', (_error, stdout) => {
      expect(stdout).toContain('[loc] JSON')
      expect(stdout).toContain('[loc] JavaScript')
      expect(stdout).not.toContain('[loc] Ruby')
      done()
    })
  })
})
