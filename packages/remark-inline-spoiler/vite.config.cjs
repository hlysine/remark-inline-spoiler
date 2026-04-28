const { defineConfig } = require('vite');
const { resolve } = require('node:path');
const dts = require('vite-plugin-dts').default;

const pkg = require('./package.json');

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
];

const globals = {
  unified: 'unified',
  'remark-parse': 'remarkParse',
  'remark-stringify': 'remarkStringify',
  'mdast-util-inline-spoiler': 'MdastUtilInlineSpoiler',
  'micromark-extension-inline-spoiler': 'MicromarkExtensionInlineSpoiler',
};

module.exports = defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RemarkInlineSpoiler',
      formats: ['es', 'cjs', 'umd'],
      fileName: format => {
        if (format === 'es') return 'index.esm.js';
        if (format === 'cjs') return 'index.cjs.js';
        return 'index.umd.js';
      },
    },
    sourcemap: true,
    rollupOptions: {
      external,
      output: {
        globals,
      },
    },
  },
  plugins: [dts()],
});
