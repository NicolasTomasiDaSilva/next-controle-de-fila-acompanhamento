export class UnauthenticatedError extends Error {
  constructor() {
    super("UnauthenticatedE.");
    this.name = "UnauthenticatedError";
  }
}
