# `remark-spoiler`

> Thanks to [benrbray/remark-cite](https://github.com/benrbray/remark-cite) for a `remark` plugin boilerplate.

Following [convention](https://github.com/micromark/micromark/discussions/56), this repository contains **three separate `npm` packages** related to support for Discord-style spoiler syntax for the `remark` Markdown parser.

* [`micromark-extension-spoiler`](https://www.npmjs.com/package/micromark-extension-spoiler) defines a new [syntax extension](https://github.com/micromark/micromark#syntaxextension) for `micromark`, which is responsible for converting markdown syntax to a token stream
* [`mdast-util-spoiler`](https://www.npmjs.com/package/mdast-util-spoiler) describes how to convert tokens output by `micromark-extension-spoiler` into either an HTML string or `mdast` syntax tree.
* [`remark-spoiler`](https://www.npmjs.com/package/remark-spoiler) encapsulates the above functionality into a `remark` plugin.

For more information, see the individual folders for each package.

## Contributing

Pull requests for bugfixes or new features / options are welcome.  Be aware that changes to the syntax extension `micromark-extension-spoiler` may also have an impact on the other two packages, and you will need to test all three.z