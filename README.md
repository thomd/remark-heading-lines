# remark-headline-ranges

[remark][remark] plugin which which generates ...

Primary usecase for this plugin is to generate Wikipedia-like edit links besides each section headline.

## Use

Say we have the following file `example.md`:

```markdown
# Level 1 Headline 1

some text

## Level 2 Headline 1

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
  .use(remarkHeadlineRanges, {tag: 'a', attribute: 'href', pattern: 'edit_lines_{start}-{end}', text: 'edit'})
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(await read('example.md'))

console.log(file.value)
```

then running `node example.js` yields:

```html
<h1>Level 1 Headline 1<a href="edit_lines_1-12">edit</a></h1>
<p>some text</p>
<h2>Level 2 Headline 1<a href="edit_lines_5-8">edit</a></h2>
<p>some text</p>
<h2>Level 2 Headline 2<a href="edit_lines_9-12">edit</a></h2>
<p>some text</p>
<h1>Level 1 Headline 2<a href="edit_lines_13-15">edit</a></h1>
<p>some text</p>
```

[remark]: https://github.com/remarkjs/remark

