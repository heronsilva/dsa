import js from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
    {
        languageOptions: {
            globals: globals.node,
            parser: ts.parser,
            parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
        },
    },
    js.configs.recommended,
    ...ts.configs.recommended,
    // importPlugin.flatConfigs.recommended,
    {
        plugins: { prettier, perfectionist },
        rules: {
            'arrow-body-style': 'off',
            'class-methods-use-this': 'warn',
            'grouped-accessor-pairs': ['warn', 'getBeforeSet'],
            'guard-for-in': 'error',
            'no-else-return': 'error',
            'no-empty-function': 'warn',
            'no-eq-null': 'error',
            'no-inline-comments': 'warn',
            'no-lonely-if': 'warn',
            'no-negated-condition': 'warn',
            'no-nested-ternary': 'error',
            'no-unneeded-ternary': 'warn',
            'no-unused-expressions': 'warn',
            'no-useless-return': 'warn',
            'perfectionist/sort-imports': ['warn', { type: 'alphabetical' }],
            'prefer-arrow-callback': 'off',
            'prefer-const': 'warn',
            'prettier/prettier': 'warn',
            eqeqeq: ['warn', 'always'],
            // 'no-magic-numbers': 'warn',
            'no-unused-labels': 'off',
        },
    },
]);
