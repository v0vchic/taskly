import { defineConfig } from 'eslint/config'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'

export default defineConfig([
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tsParser,
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            import: importPlugin,
            'unused-imports': unusedImports,
        },
        rules: {
            'linebreak-style': 'off',
            quotes: ['error', 'single'],
            semi: ['error', 'never'],
            'object-curly-spacing': ['error', 'always'],

            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal'],
                },
            ],

            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': 'warn',
        },
    },
])
