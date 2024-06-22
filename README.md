# remark-headline-edit

![Build][build-badge]

[remark][remark] plugin which which generates additional links at each `heading` type containing the start- and end-line of each headline section respecting the headline hierarchy.

My primary usecase for this plugin is to generate **Wikipedia**-like **edit** links besides each section headline (see example below).

## Usage

Say we have the following file `example.md`:

```markdown
# Level 1 Headline 1

some text

## Level 2 Headline 1

some text

### Level 3 Headline 1

some text

## Level 2 Headline 2

some text

# Level 1 Headline 2

some text
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
        maxDepth: 2, 
        urlPattern: 'edit?range={start}-{end}', 
        linkText: '[ edit ]'
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await read('example.md'))

console.log(file.value)
```

then running `node example.js` yields:

```html
<h1>Level 1 Headline 1<a href="edit?range=1-16">[ edit ]</a></h1>
<p>some text</p>
<h2>Level 2 Headline 1<a href="edit?range=5-12">[ edit ]</a></h2>
<p>some text</p>
<h3>Level 3 Headline 1</h3>
<p>some text</p>
<h2>Level 2 Headline 2<a href="edit?range=13-16">[ edit ]</a></h2>
<p>some text</p>
<h1>Level 1 Headline 2<a href="edit?range=17-19">[ edit ]</a></h1>
<p>some text</p>
```

## Usage with remark-CLI

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

* `maxDepth` (`integer`, optional) — maximum depth of headline hierarchy. Default value is `6`

* `urlPattern` (`strign`, optional) - pattern to generate the link. Placeholders are `{start}` and `{end}`. Default pattern is `edit/{start}/{end}`

* `linkText` (`string`, optional) - text used for the link. Default is `Edit`


[remark]: https://github.com/remarkjs/remark
[build-badge]: https://github.com/thomd/remark-headline-edit/workflows/main/badge.svg
