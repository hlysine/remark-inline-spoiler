# `remark-inline-spoiler`

> Thanks to [benrbray/remark-cite](https://github.com/benrbray/remark-cite) for a `remark` plugin boilerplate.

Following [convention](https://github.com/micromark/micromark/discussions/56), this repository contains **three separate `npm` packages** related to support for Discord-style spoiler syntax for the `remark` Markdown parser.

* [`micromark-extension-inline-spoiler`](https://www.npmjs.com/package/micromark-extension-inline-spoiler) defines a new [syntax extension](https://github.com/micromark/micromark#syntaxextension) for `micromark`, which is responsible for converting markdown syntax to a token stream
* [`mdast-util-inline-spoiler`](https://www.npmjs.com/package/mdast-util-inline-spoiler) describes how to convert tokens output by `micromark-extension-inline-spoiler` into either an HTML string or `mdast` syntax tree.
* [`remark-inline-spoiler`](https://www.npmjs.com/package/remark-inline-spoiler) encapsulates the above functionality into a `remark` plugin.

For more information, see the individual folders for each package.

## Contributing

Pull requests for bugfixes or new features / options are welcome.  Be aware that changes to the syntax extension `micromark-extension-inline-spoiler` may also have an impact on the other two packages, and you will need to test all three.z