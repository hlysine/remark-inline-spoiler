# `micromark-extension-spoiler`

> Thanks to [benrbray/remark-cite](https://github.com/benrbray/remark-cite) for a `remark` plugin boilerplate.

[![](https://img.shields.io/npm/v/micromark-extension-spoiler?style=flat-square)](https://www.npmjs.com/package/micromark-extension-spoiler)
![license](https://img.shields.io/github/license/hlysine/remark-spoiler?style=flat-square)

A **[`micromark`](https://github.com/micromark/micromark)** syntax extension for Discord-style spoilers, providing the low-level modules for integrating with the micromark tokenizer and the micromark HTML compiler.

You probably shouldn’t use this package directly, but instead use [`mdast-util-spoiler`](https://github.com/hlysine/remark-spoiler/tree/master/mdast-util-spoiler) with [mdast](https://github.com/syntax-tree/mdast) or [`remark-spoiler`](https://github.com/hlysine/remark-spoiler/tree/master/remark-spoiler) with [remark](https://github.com/remarkjs/remark).

## Install

Install [`micromark-extension-spoiler`]() on `npm`, `yarn` or `bun`.

```bash
npm install micromark-extension-spoiler
yarn add micromark-extension-spoiler
bun install micromark-extension-spoiler
```

## Usage

```javascript
import micromark from "micromark";
import { spoilerSyntax, spoilerHtml } from "micromark-extension-spoiler";

let serialized = micromark('||Don\'t spoil this||', {
    extensions: [spoilerSyntax()],
    htmlExtensions: [spoilerHtml()]
});
```

The serialized result will be the following.  To get an abstract syntax tree, use `mdast-util-spoiler` instead.

```html
<p><span class="spoiler">Don't spoil this</span></p>
```
