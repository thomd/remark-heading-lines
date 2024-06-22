import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { remark } from 'remark'
import remarkHeadlineEdit from '../index.js'

test('remark-headline-edit', async function (t) {
  await t.test('should expose the public api', async function () {
      assert.deepEqual(Object.keys(await import('../index.js')).sort(), [
      'default'
    ])
  })
})

test('fixtures', async function (t) {
  const root = new URL('fixtures/', import.meta.url)
  const fixtures = await fs.readdir(root)
  let index = -1

  while (++index < fixtures.length) {
    const folder = fixtures[index]

    if (folder.startsWith('.')) continue

    await t.test(folder, async function () {
      const folderUrl = new URL(folder + '/', root)
      const inputUrl = new URL('input.md', folderUrl)
      const outputUrl = new URL('output.md', folderUrl)
      const configUrl = new URL('config.json', folderUrl)

      let config
      let output

      try {
        config = JSON.parse(String(await fs.readFile(configUrl)))
      } catch {}

      try {
        output = String(await fs.readFile(outputUrl))
      } catch {
        output = ''
      }

      try {
        const file = await remark()
          .use(remarkHeadlineEdit, config)
          .process({
            cwd: fileURLToPath(folderUrl),
            path: config && config.withoutFilePath ? undefined : 'readme.md',
            value: await fs.readFile(inputUrl)
          })

        assert.equal(String(file), output)
      } catch (error) {
        if (folder.indexOf('fail-') !== 0) {
          throw error
        }

        const message = folder.slice(5).replace(/-/g, ' ')
        assert.match(String(error).replace(/`/g, ''), new RegExp(message, 'i'))
      }
    })
  }
})
