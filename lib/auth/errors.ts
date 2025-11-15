export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function throwAuth(message: string, status = 400): never {
  throw new AuthError(message, status);
}
