# remark-headline-ranges

[remark][remark] plugin which which generates additional metadata within the `mdast` at each `heading` type containing the start- and end-line of each headline section within the source markdown file respecting the headline hierarchy.

Primary usecase for this plugin is to generate **Wikipedia**-like **edit** links besides each section headline (see example below).

> [!CAUTION]
> This plugin is still in development and does not work properly

## Use

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
import remarkHeadlineRanges from 'remark-headline-ranges'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { read } from 'to-vfile'

const file = await remark()
    .use(remarkHeadlineRanges, {
        depth: 2, 
        tag: 'a', 
        attribute: 'href', 
        pattern: 'edit_lines_{start}-{end}', 
        text: 'edit'
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await read('example.md'))

console.log(file.value)
```

then running `node example.js` yields:

```html
<h1>Level 1 Headline 1<a href="edit_lines_1-16">edit</a></h1>
<p>some text</p>
<h2>Level 2 Headline 1<a href="edit_lines_5-12">edit</a></h2>
<p>some text</p>
<h3>Level 3 Headline 1</h3>
<p>some text</p>
<h2>Level 2 Headline 2<a href="edit_lines_13-16">edit</a></h2>
<p>some text</p>
<h1>Level 1 Headline 2<a href="edit_lines_17-19">edit</a></h1>
<p>some text</p>
```

[remark]: https://github.com/remarkjs/remark

