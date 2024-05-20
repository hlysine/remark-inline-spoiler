# `micromark-extension-inline-spoiler`

> Thanks to [benrbray/remark-cite](https://github.com/benrbray/remark-cite) for a `remark` plugin boilerplate.

[![](https://img.shields.io/npm/v/micromark-extension-inline-spoiler?style=flat-square)](https://www.npmjs.com/package/micromark-extension-inline-spoiler)
![license](https://img.shields.io/github/license/hlysine/remark-inline-spoiler?style=flat-square)

A **[`micromark`](https://github.com/micromark/micromark)** syntax extension for Discord-style spoilers, providing the low-level modules for integrating with the micromark tokenizer and the micromark HTML compiler.

You probably shouldn’t use this package directly, but instead use [`mdast-util-inline-spoiler`](https://github.com/hlysine/remark-inline-spoiler/tree/master/mdast-util-inline-spoiler) with [mdast](https://github.com/syntax-tree/mdast) or [`remark-inline-spoiler`](https://github.com/hlysine/remark-inline-spoiler/tree/master/remark-inline-spoiler) with [remark](https://github.com/remarkjs/remark).

## Install

Install [`micromark-extension-inline-spoiler`]() on `npm`, `yarn` or `bun`.

```bash
npm install micromark-extension-inline-spoiler
yarn add micromark-extension-inline-spoiler
bun install micromark-extension-inline-spoiler
```

## Usage

```javascript
import micromark from "micromark";
import { spoilerSyntax, spoilerHtml } from "micromark-extension-inline-spoiler";

let serialized = micromark('||Don\'t spoil this||', {
    extensions: [spoilerSyntax()],
    htmlExtensions: [spoilerHtml()]
});
```

The serialized result will be the following.  To get an abstract syntax tree, use `mdast-util-inline-spoiler` instead.

```html
<p><span class="spoiler">Don't spoil this</span></p>
```
