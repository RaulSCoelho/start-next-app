import spawn from 'cross-spawn'
import type { PackageManager } from './get-pkg-manager'

interface InstallArgs {
  /**
   * Indicate whether to install packages using npm, pnpm or Yarn.
   */
  packageManager: PackageManager
  /**
   * Indicate whether the given dependencies are devDependencies.
   */
  devDependencies?: boolean
}

/**
 * Spawn a package manager installation with either Yarn or NPM.
 *
 * @returns A Promise that resolves once the installation is finished.
 */
export function install(
  dependencies: string[] | null,
  { packageManager, devDependencies }: InstallArgs
): Promise<void> {
  return new Promise((resolve, reject) => {
    let args: string[]
    let command = packageManager

    if (dependencies && dependencies.length) {
      args = ['install', '--save-exact']
      args.push(devDependencies ? '--save-dev' : '--save')
      args.push(...dependencies)
    } else {
      args = ['install']
    }

    /**
     * Spawn the installation process.
     */
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        ADBLOCK: '1',
        // we set NODE_ENV to development as pnpm skips dev
        // dependencies when production
        NODE_ENV: 'development',
        DISABLE_OPENCOLLECTIVE: '1'
      }
    })
    child.on('close', code => {
      if (code !== 0) {
        reject({ command: `${command} ${args.join(' ')}` })
        return
      }
      resolve()
    })
  })
}
