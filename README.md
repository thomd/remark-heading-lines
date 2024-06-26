# remark-heading-lines

![Build][build-badge]

`remark-heading-lines` is a [remark][remark] plugin which adds a link at a headline containing the start- and end-line of a headline section respecting its hierarchy. The lines refer to the source markdown file, not to the target markdown file or html file.

This plugin is primarily intended to be used together with `remark-rehype`.

An exemplary usecase for this plugin is to generate **wikipedia**-like **edit** links beside headlines (see the example below).

## Usage

Say we have the following file `example.md`:

```markdown
# Level 1

paragraph

## Level 2

paragraph

### Level 3

paragraph

## Level 2

paragraph

# Level 1

paragraph
```

and a module `example.js`:

```js
import { remark } from 'remark'
import remarkHeadingLines from 'remark-heading-lines'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { read } from 'to-vfile'

const file = await remark()
    .use(remarkHeadingLines, {
        position: 'after',
        maxDepth: 2,
        urlPattern: 'edit?line={start}-{end}',
        linkText: 'edit',
        className: 'h{depth}'
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await read('example.md'))

console.log(file.value)
```

then running `node example.js` yields:

```html
<div class="h1"><h1>Level 1</h1><a href="edit?line=1-16">edit</a></div>
<p>paragraph</p>
<div class="h2"><h2>Level 2</h2><a href="edit?line=5-12">edit</a></div>
<p>paragraph</p>
<h3>Level 3</h3>
<p>paragraph</p>
<div class="h2"><h2>Level 2</h2><a href="edit?line=13-16">edit</a></div>
<p>paragraph</p>
<div class="h1"><h1>Level 1</h1><a href="edit?line=17-19">edit</a></div>
<p>paragraph</p>
```

## Use with remark-CLI

```bash
npm install remark-cli
remark example.md --use remark-heading-lines
remark example.md --use remark-heading-lines --use remark-rehype -use rehype-stringify
```

## API

The default export is `remarkHeadingLines`.

```js
unified().use(remarkHeadingLines[, options])
```

### Options

* `position` (`string`, optional) — position of the link relative to the headline. Possible values are `append` (put link inside `h`-tag at last index), `prepend` (put link inside `h`-tag at first index), `after` (put link after the `h`-tag) and `before` (put link before the `h`-tag). The `after` and `before` positions are wrapped in a `div` tag and require `remark-rehype`. Default is `append`.

* `maxDepth` (`integer`, optional) — maximum depth of headline hierarchy to render links. Default value is `6`.

* `urlPattern` (`string`, optional) — pattern to generate the link. Placeholders are `{start}` and `{end}`. Default pattern is `edit/{start}/{end}`.

* `linkText` (`string`, optional) — text used for the link. Default text is `Edit`.

* `className` (`string`, optional) — style class to be added to the `div` wrapper when using position `after` or `before`. Placeholder is `{depth}`. Default is no style class.

[remark]: https://github.com/remarkjs/remark
[build-badge]: https://github.com/thomd/remark-heading-line/workflows/plugin-test/badge.svg
