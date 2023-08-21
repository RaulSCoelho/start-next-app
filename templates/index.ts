import { install } from '../helpers/install'
import { copy } from '../helpers/copy'

import os from 'os'
import fs from 'fs'
import path from 'path'
import { cyan, bold } from 'picocolors'

import { InstallTemplateArgs } from './types'

/**
 * Install a Next.js internal template to a given `root` directory.
 */
export const installTemplate = async ({ appName, root, packageManager, template, mode }: InstallTemplateArgs) => {
  console.log(bold(`Using ${packageManager}.`))
  console.log('\nInitializing project with template:', template)

  const templatePath = path.join(__dirname, template, mode)

  // Copy the template files to the target directory.
  await copy(['**'], root, {
    parents: true,
    cwd: templatePath,
    rename(name) {
      switch (name) {
        case 'env':
        case 'gitignore':
        case 'editorconfig':
        case 'eslintrc.json': {
          return `.${name}`
        }
        // README.md is ignored by webpack-asset-relocator-loader used by ncc:
        // https://github.com/vercel/webpack-asset-relocator-loader/blob/e9308683d47ff507253e37c9bcbb99474603192b/src/asset-relocator.js#L227
        case 'README-template.md': {
          return 'README.md'
        }
        default: {
          return name
        }
      }
    }
  })

  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
      test: 'jest --watch',
      'test:ci': 'jest --ci',
      'test:coverage': 'jest --coverage'
    },
    prisma: {
      schema: 'src/server/prisma/schema.prisma'
    }
  }
  await fs.promises.writeFile(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2) + os.EOL)

  const dependencies = [
    '@hookform/resolvers',
    '@prisma/client',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'accounting',
    'axios',
    'bcryptjs',
    'css-mediaquery',
    'jose',
    'next',
    'nookies',
    'react',
    'react-confetti',
    'react-dom',
    'react-hook-form',
    'react-icons',
    'tailwind-scrollbar',
    'tailwind-variants',
    'uuid',
    'zod',
    'zustand'
  ]

  const devDependencies = [
    '@testing-library/jest-dom',
    '@testing-library/react',
    '@testing-library/user-event',
    '@types/accounting',
    '@types/bcryptjs',
    '@types/cookie',
    '@types/css-mediaquery',
    '@types/jest',
    '@types/node',
    '@types/react',
    '@types/react-dom',
    '@types/testing-library__jest-dom',
    '@types/uuid',
    'autoprefixer',
    'eslint',
    'eslint-config-next',
    'eslint-plugin-import-helpers',
    'jest',
    'jest-environment-jsdom',
    'postcss',
    'prettier',
    'prettier-plugin-tailwindcss',
    'prisma',
    'tailwindcss',
    'typescript'
  ]

  /**
   * Install package.json dependencies if they exist.
   */
  if (dependencies.length) {
    console.log()
    console.log('Installing dependencies:')
    for (const dependency of dependencies) {
      console.log(`- ${cyan(dependency)}`)
    }

    await install(dependencies, { packageManager })

    console.log()
    console.log('Installing dev dependencies:')
    for (const dependency of devDependencies) {
      console.log(`- ${cyan(dependency)}`)
    }
    console.log()

    await install(devDependencies, {
      packageManager,
      devDependencies: true
    })
  }
}

export * from './types'
