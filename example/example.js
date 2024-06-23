import { remark } from 'remark'
import remarkHeadlineEdit from '../index.js'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { read } from 'to-vfile'

const file = await remark()
    .use(remarkHeadlineEdit, {
        position: 'after',
        maxDepth: 2,
        urlPattern: 'edit?line={start}-{end}',
        linkText: 'edit'
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(await read('example.md'))

console.log(file.value)

