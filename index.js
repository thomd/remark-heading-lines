import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import { findAfter } from 'unist-util-find-after'

const remarkHeadlineRanges = () => {
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
            node.hierarchy = { start: {}, end: {} }
            let { depth } = node
            node.hierarchy.start.line = node.position.start.line
            setHeadingSectionEnd(node, index, parent, depth)
        })
        visit(tree, 'heading', (node, index, parent) => {
            console.log(toString(node), node.hierarchy.start.line, node.hierarchy.end.line)
        })
    }
}
export default remarkHeadlineRanges

