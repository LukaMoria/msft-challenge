module.exports = {
    root: true,
    env: {
      node: true
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      sourceType: 'module'
    },
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:vue/recommended'
    ],
    rules: {
      'vue/multi-word-component-names': 0,
      '@typescript-eslint/quotes': [
        'error',
        'single',
        {
          'allowTemplateLiterals': true
        }
      ]
    }
};