import typescript from 'rollup-plugin-typescript2';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [typescript({ objectHashIgnoreUnknownHack: true })],
  external: ['react', 'react-dom'],
};
