import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import { findAfter } from 'unist-util-find-after'

const remarkHeadlineRanges = () => {
    return (tree) => {
        const findHeadingSectionEnd = (node, index, parent, depth) => {
            let nextHeading = findAfter(parent, index, { type: 'heading', depth: depth })
            if (nextHeading != undefined) {
                node.hierarchy.end.line = nextHeading.position.end.line - 1
            } else {
                depth = depth - 1
                if (depth == 0) {
                    nextHeading = parent.children.at(-1)
                    node.hierarchy.end.line = nextHeading.position.end.line
                } else {
                    findHeadingSectionEnd(node, index, parent, depth)
                }
            }
        }
        visit(tree, 'heading', (node, index, parent) => {
            node.hierarchy = { start: {}, end: {} }
            let { depth } = node
            node.hierarchy.start.line = node.position.start.line
            let nextHeading = findAfter(parent, index, {type:'heading', depth:depth})
            if (nextHeading != undefined) {
                node.hierarchy.end.line = nextHeading.position.end.line - 1
            } else {
                nextHeading = findAfter(parent, index, {type:'heading', depth:depth - 1})
                if (nextHeading != undefined) {
                    node.hierarchy.end.line = nextHeading.position.end.line - 1
                } else {
                    nextHeading = parent.children.at(-1)
                    node.hierarchy.end.line = nextHeading.position.end.line
                }
            }
        })
        visit(tree, 'heading', (node, index, parent) => {
            console.log(toString(node), node.hierarchy.start.line, node.hierarchy.end.line)
        })
    }
}
export default remarkHeadlineRanges


