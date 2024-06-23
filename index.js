import { visit } from 'unist-util-visit'
import { findAfter } from 'unist-util-find-after'

const remarkHeadlineEdit = (opts) => {
    const defaultOptions = {
        position: 'append',
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
                const url = options.urlPattern.replace('{start}', node.hierarchy.start.line).replace('{end}', node.hierarchy.end.line)
                const type = 'link'
                const link = { type, url, children: [{ type: 'text', value: options.linkText }] }
                if (options.position == 'append') {
                    node.children.splice(node.children.length, 0, link)
                }
                if (options.position == 'prepend') {
                    node.children.splice(0, 0, link)
                }
                if (options.position == 'after') {
                    const wrapper = { type: 'div', data: { hName: 'div', hProperties: { className: 'h' + depth } }, children: [node, link] }
                    parent.children.splice(index, 1, wrapper)
                }
                if (options.position == 'before') {
                    const wrapper = { type: 'div', data: { hName: 'div', hProperties: { className: 'h' + depth } }, children: [link, node] }
                    parent.children.splice(index, 1, wrapper)
                }
            }
        })
    }
}
export default remarkHeadlineEdit

