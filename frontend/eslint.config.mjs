import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: { indent: 2, quotes: 'single', overrides: { 'antfu/top-level-function': 'off' } },
  typescript: true,
  react: true,
})
