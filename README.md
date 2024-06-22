# remark-headline-edit

![Build][build-badge]

`remark-headline-edit` is a [remark][remark] plugin which generates links after each `heading` type containing the start- and end-line of each headline section respecting its hierarchy. The lines are related to the source markdown file, not the the target markdown file.

This plugin is primarily intended to be used together with `remark-rehype` as markdown does not allow sophisticated positioning of the edit-link.

An exemplary usecase for this plugin is to generate **wikipedia**-like **edit** links besides each headline (see example below).

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
import remarkHeadlineEdit from 'remark-headline-edit'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { read } from 'to-vfile'

const file = await remark()
    .use(remarkHeadlineEdit, {
        position: 'append',
        maxDepth: 2, 
        urlPattern: 'edit?lines={start}-{end}', 
        linkText: '[ edit ]'
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await read('example.md'))

console.log(file.value)
```

then running `node example.js` yields:

```html
<h1>Level 1<a href="edit?lines=1-16">[ edit ]</a></h1>
<p>paragraph</p>
<h2>Level 2<a href="edit?lines=5-12">[ edit ]</a></h2>
<p>paragraph</p>
<h3>Level 3</h3>
<p>paragraph</p>
<h2>Level 2<a href="edit?lines=13-16">[ edit ]</a></h2>
<p>paragraph</p>
<h1>Level 1<a href="edit?lines=17-19">[ edit ]</a></h1>
<p>paragraph</p>
```

## Use with remark-CLI

```bash
npm install remark-cli
remark example.md --use remark-headline-edit
remark example.md --use remark-headline-edit --use remark-html
```

## API

The default export is `remarkHeadlineEdit`.

```js
unified().use(remarkHeadlineEdit[, options])
```

### Options

* `position` (`string`, optional) - position of the link in the DOM. Possible values are `append` (put link inside `h`-tag at last index), `prepend` (put link inside `h`-tag at first index), `after` (put link after the `h`-tag) and `before` (put link before the `h`-tag). The `after` and `before` positions are wrapped in a `div` tag and require `remark-rehype`. Default is `append`.

* `maxDepth` (`integer`, optional) — maximum depth of headline hierarchy. Default value is `6`

* `urlPattern` (`string`, optional) - pattern to generate the link. Placeholders are `{start}` and `{end}`. Default pattern is `edit/{start}/{end}`

* `linkText` (`string`, optional) - text used for the link. Default is `Edit`

* `wrap` (`boolean`, optional) - wrap headline and link within a `div` tag. Default is `false`.

[remark]: https://github.com/remarkjs/remark
[build-badge]: https://github.com/thomd/remark-headline-edit/workflows/plugin-test/badge.svg
