import { UseCaseError } from 'src/core/errors/use-case-error'

export class TitleAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Title already exists.`)
  }
}
