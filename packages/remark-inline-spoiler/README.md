# `remark-inline-spoiler`

> Thanks to [benrbray/remark-cite](https://github.com/benrbray/remark-cite) for a `remark` plugin boilerplate.

[![](https://img.shields.io/npm/v/remark-inline-spoiler?style=flat-square)](https://www.npmjs.com/package/remark-inline-spoiler)
![license](https://img.shields.io/github/license/hlysine/remark-inline-spoiler?style=flat-square)

Plugin for [`remark`](https://github.com/remarkjs/remark) to support Discord-style spoilers.  Relies on [`micromark-extension-inline-spoiler`](https://github.com/hlysine/remark-inline-spoiler/tree/master/micromark-extension-inline-spoiler) for tokenization and [`mdast-util-inline-spoiler`](https://github.com/hlysine/remark-inline-spoiler/tree/master/mdast-util-inline-spoiler) for converting markdown to/from abstract syntax trees.

## Install

Install [`remark-inline-spoiler`]() on `npm`, `yarn` or `bun`.

```bash
npm install remark-inline-spoiler
yarn add remark-inline-spoiler
bun install remark-inline-spoiler
```

## Usage

```javascript
const unified = require('unified')
const markdown = require('remark-parse')
const { spoilerPlugin } = require('remark-inline-spoiler');

let processor = unified()
    .use(markdown)
    .use(spoilerPlugin, {})
```

Running the processor on the following markdown:

```
||Don't spoil this||
```

Will produce the following `spoiler` node:

```json
{
	"type": "spoiler",
	"value": "Don't spoil this"
}
```