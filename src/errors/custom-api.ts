class CustomAPIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, CustomAPIError.prototype);
  }
}

export default CustomAPIError;
