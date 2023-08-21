import { PackageManager } from '../helpers/get-pkg-manager'

export type TemplateType = 'app-tw'
export type TemplateMode = 'ts'

export interface InstallTemplateArgs {
  appName: string
  root: string
  packageManager: PackageManager
  template: TemplateType
  mode: TemplateMode
}
