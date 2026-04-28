# `mdast-util-inline-spoiler`

> Thanks to [benrbray/remark-cite](https://github.com/benrbray/remark-cite) for a `remark` plugin boilerplate.

[![](https://img.shields.io/npm/v/mdast-util-inline-spoiler?style=flat-square)](https://www.npmjs.com/package/mdast-util-inline-spoiler)
![license](https://img.shields.io/github/license/hlysine/remark-inline-spoiler?style=flat-square)

Extension for [`mdast-util-from-markdown`](https://github.com/syntax-tree/mdast-util-from-markdown) and
[`mdast-util-to-markdown`](https://github.com/syntax-tree/mdast-util-to-markdown) to support Discord-style spoilers.  Converts the token stream produced by [`micromark-extension-inline-spoiler`](https://github.com/hlysine/remark-inline-spoiler/tree/master/micromark-extension-inline-spoiler) into an abstract syntax tree.  

Using [`remark`](https://github.com/remarkjs/remark)?  You probably shouldn’t use this package directly, but instead use [`remark-inline-spoiler`](https://github.com/hlysine/remark-inline-spoiler/tree/master/remark-inline-spoiler).  See [`micromark-extension-inline-spoiler`](https://github.com/hlysine/remark-inline-spoiler/tree/master/micromark-extension-inline-spoiler) for a full description of the supported syntax.

## Install

Install [`mdast-util-inline-spoiler`]() on `npm`, `yarn` or `bun`.

```bash
npm install mdast-util-inline-spoiler
yarn add mdast-util-inline-spoiler
bun install mdast-util-inline-spoiler
```

## Usage

### Markdown to AST

```javascript
import fromMarkdown from 'mdast-util-from-markdown'
import { spoilerSyntax } from 'micromark-extension-inline-spoiler'
import { spoilerFromMarkdown } from 'mdast-util-inline-spoiler'

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
import { spoilerToMarkdown } from 'mdast-util-inline-spoiler'

let markdownString = toMarkdown(ast, {
	extensions: [spoilerToMarkdown({})]
}).trim();
```

The result will be:

```
||Don't spoil this||
```
