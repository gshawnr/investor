export default class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;

    // Set the prototype explicitly to maintain instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
