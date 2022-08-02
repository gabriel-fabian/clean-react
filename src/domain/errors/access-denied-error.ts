export class AccessDeniedError extends Error {
  constructor () {
    super('Accesso negado.')
    this.name = 'AccessDeniedError'
  }
}
