import {type Config, defineConfig} from 'tsdown'

const config: Config = defineConfig({
    entry: ['./src/index.ts', './src/utils.ts'],
    format: 'esm',
    target: 'node18.12',
    clean: true,
    dts: {transformer: 'oxc', autoAddExts: true},
    platform: 'neutral',
})

export default config
