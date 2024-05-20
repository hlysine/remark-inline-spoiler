# `remark-spoiler`

> Thanks to [benrbray/remark-cite](https://github.com/benrbray/remark-cite) for a `remark` plugin boilerplate.

[![](https://img.shields.io/npm/v/remark-spoiler?style=flat-square)](https://www.npmjs.com/package/remark-spoiler)
![license](https://img.shields.io/github/license/hlysine/remark-spoiler?style=flat-square)

Plugin for [`remark`](https://github.com/remarkjs/remark) to support Discord-style spoilers.  Relies on [`micromark-extension-spoiler`](https://github.com/hlysine/remark-spoiler/tree/master/micromark-extension-spoiler) for tokenization and [`mdast-util-spoiler`](https://github.com/hlysine/remark-spoiler/tree/master/mdast-util-spoiler) for converting markdown to/from abstract syntax trees.

## Install

Install [`remark-spoiler`]() on `npm`, `yarn` or `bun`.

```bash
npm install remark-spoiler
yarn add remark-spoiler
bun install remark-spoiler
```

## Usage

```javascript
const unified = require('unified')
const markdown = require('remark-parse')
const { spoilerPlugin } = require('remark-spoiler');

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