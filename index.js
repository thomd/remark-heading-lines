import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import { findAfter } from 'unist-util-find-after'

const remarkHeadlineEdit = (opts) => {
    const defaultOptions = {
        maxDepth: 6,
        urlPattern: 'edit/{start}/{end}',
        linkText: 'Edit'
    }
    const options = { ...defaultOptions, ...opts }
    return (tree) => {
        const setHeadingSectionEnd = (node, index, parent, depth) => {
            let nextHeading = findAfter(parent, index, node => node.type == 'heading' && node.depth <= depth)
            if (nextHeading != undefined) {
                node.hierarchy.end.line = nextHeading.position.end.line - 1
            } else {
                depth = depth - 1
                if (depth == 0) {
                    nextHeading = parent.children.at(-1)
                    node.hierarchy.end.line = nextHeading.position.end.line
                } else {
                    setHeadingSectionEnd(node, index, parent, depth)
                }
            }
        }
        visit(tree, 'heading', (node, index, parent) => {
            let { depth } = node
            if (depth <= options.maxDepth) {
                node.hierarchy = { start: {}, end: {} }
                node.hierarchy.start.line = node.position.start.line
                setHeadingSectionEnd(node, index, parent, depth)
            }
        })
        visit(tree, 'heading', (node, index, parent) => {
            let { depth } = node
            if (depth <= options.maxDepth) {
                const link = {
                    type: 'link',
                    url: options.urlPattern.replace('{start}', node.hierarchy.start.line).replace('{end}', node.hierarchy.end.line),
                    children: [
                        {
                            type: 'text',
                            value: options.linkText
                        }
                    ]
                }
                node.children.splice(index + 1, 0, link)
            }
        })
    }
}
export default remarkHeadlineEdit

