# `mdast-util-spoiler`

> Thanks to [benrbray/remark-cite](https://github.com/benrbray/remark-cite) for a `remark` plugin boilerplate.

[![](https://img.shields.io/npm/v/mdast-util-spoiler?style=flat-square)](https://www.npmjs.com/package/mdast-util-spoiler)
![license](https://img.shields.io/github/license/hlysine/remark-spoiler?style=flat-square)

Extension for [`mdast-util-from-markdown`](https://github.com/syntax-tree/mdast-util-from-markdown) and
[`mdast-util-to-markdown`](https://github.com/syntax-tree/mdast-util-to-markdown) to support Discord-style spoilers.  Converts the token stream produced by [`micromark-extension-spoiler`](https://github.com/hlysine/remark-spoiler/tree/master/micromark-extension-spoiler) into an abstract syntax tree.  

Using [`remark`](https://github.com/remarkjs/remark)?  You probably shouldn’t use this package directly, but instead use [`remark-spoiler`](https://github.com/hlysine/remark-spoiler/tree/master/remark-spoiler).  See [`micromark-extension-spoiler`](https://github.com/hlysine/remark-spoiler/tree/master/micromark-extension-spoiler) for a full description of the supported syntax.

## Install

Install [`mdast-util-spoiler`]() on `npm`, `yarn` or `bun`.

```bash
npm install mdast-util-spoiler
yarn add mdast-util-spoiler
bun install mdast-util-spoiler
```

## Usage

### Markdown to AST

```javascript
import fromMarkdown from 'mdast-util-from-markdown'
import { spoilerSyntax } from 'micromark-extension-spoiler'
import { spoilerFromMarkdown } from 'mdast-util-spoiler'

let ast = fromMarkdown('||Don\'t spoil this||', {
  extensions: [spoilerSyntax()],
  mdastExtensions: [spoilerFromMarkdown]
})
```

The corresponding node in the abstract syntax tree has the form below, where `value` contains the hidden content:

```json
{
	"type": "spoiler",
	"value": "Don't spoil this"
}
```

### AST to Markdown

Taking the `ast` from the previous example,

```javascript
import fromMarkdown from 'mdast-util-from-markdown'
import { spoilerToMarkdown } from 'mdast-util-spoiler'

let markdownString = toMarkdown(ast, {
	extensions: [spoilerToMarkdown({})]
}).trim();
```

The result will be:

```
||Don't spoil this||
```
