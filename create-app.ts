import { green, cyan } from 'picocolors'
import path from 'path'
import { makeDir } from './helpers/make-dir'
import { tryGitInit } from './helpers/git'
import { isFolderEmpty } from './helpers/is-folder-empty'
import { isWriteable } from './helpers/is-writeable'
import type { PackageManager } from './helpers/get-pkg-manager'

import { installTemplate, TemplateMode, TemplateType } from './templates'

interface CreateApp {
  appPath: string
  packageManager: PackageManager
}

export async function createApp({ appPath, packageManager }: CreateApp): Promise<void> {
  const template: TemplateType = 'app-tw'
  const mode: TemplateMode = 'ts'
  const root = path.resolve(appPath)

  if (!(await isWriteable(path.dirname(root)))) {
    console.error('The application path is not writable, please check folder permissions and try again.')
    console.error('It is likely you do not have write permissions for this folder.')
    process.exit(1)
  }

  const appName = path.basename(root)

  await makeDir(root)
  if (!isFolderEmpty(root, appName)) {
    process.exit(1)
  }

  console.log()
  console.log(`Creating a new Next.js app in ${green(root)}.`)
  console.log()

  process.chdir(root)

  /**
   * If an example repository is not provided for cloning, proceed
   * by installing from a template.
   */
  await installTemplate({
    appName,
    root,
    packageManager,
    template,
    mode
  })

  if (tryGitInit(root)) {
    console.log('Initialized a git repository.')
    console.log()
  }

  let cdpath: string
  const originalDirectory = process.cwd()

  if (path.join(originalDirectory, appName) === appPath) {
    cdpath = appName
  } else {
    cdpath = appPath
  }

  console.log(`${green('Success!')} Created ${appName} at ${appPath}`)
  console.log('Inside that directory, you can run several commands:')
  console.log()
  console.log(cyan(`  ${packageManager} run dev`))
  console.log('    Starts the development server.')
  console.log()
  console.log(cyan(`  ${packageManager} run build`))
  console.log('    Builds the app for production.')
  console.log()
  console.log(cyan(`  ${packageManager} start`))
  console.log('    Runs the built app in production mode.')
  console.log()
  console.log('We suggest that you begin by typing:')
  console.log()
  console.log(cyan('  cd'), cdpath)
  console.log(`  ${cyan(`${packageManager} run dev`)}`)
  console.log()
}
