// const { exec } = require('child_process')
import { exec } from 'child_process'

describe('cherry', () => {
  test('should list all available commands', (done) => {
    exec('node bin/cherry.js', (error, stdout, stderr) => {
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
