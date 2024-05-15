import { visit } from 'unist-util-visit'

export default options =>  {

  const transformer = async (tree, _file) => {
    let transformations = []
    visit(tree, 'code', node => {
      const transform = typeof options.transform === 'function' ? options.transform(node) : options.transform
      transformations.push(
        Promise.resolve(transform).then(async transform => {
          if (transform) {
            const codeChildren = node.data && node.data.hChildren || [{ type: 'text', value: node.value }];
            const codeProperties = node.data && node.data.hProperties || (node.lang ? { className: ['language-' + node.lang] } : {})
            const n = node
            n.type = 'code-extra'
            if (!n.data) n.data = {}
            const before = transform.before ? await Promise.resolve(transform.before) : []
            const after = transform.after ? await Promise.resolve(transform.after) : []
            const children = [
              ...before,
              {
                type: 'element',
                tagName: 'pre',
                children: [
                  {
                    type: 'element',
                    tagName: 'code',
                    properties: codeProperties,
                    children: codeChildren
                  }
                ]
              },
              ...after
            ]
            n.data.hName = 'div'
            n.data.hProperties = {className: ['code-extra']}
            n.data.hChildren = children
            if (transform.transform)
              return transform.transform(n)
          }
        })
      )
    })
    await Promise.all(transformations);
    return tree
  }

  return transformer
}

