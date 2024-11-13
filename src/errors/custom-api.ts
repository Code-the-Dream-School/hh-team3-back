class CustomAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name; 
    Object.setPrototypeOf(this, CustomAPIError.prototype); 
  }
}

export default CustomAPIError;
