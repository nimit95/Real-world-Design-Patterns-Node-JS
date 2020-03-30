/**
 * Custom error class.
 * We shouldnt create new class everytime we encounter
 * any error
 */

class CustomError extends Error {
  constructor(code, errorMsg) {
    super(errorMsg);
    this.code = code;
    this.message = errorMsg;
  }
}

/**
 * Returns the error associated with the code
 * Reduces the number of objects in the system
 */
class CustomErrorFactor {

  constructor() {
    this.errorClasses = {};
  }

  static getInstance() {
    if( typeof CustomErrorFactor.instace === 'object') {
      return CustomErrorFactor.instace;
    }
    CustomErrorFactor.instace = new CustomErrorFactor();
    return CustomErrorFactor.instace;
  }

  getErrorClass(code, msg) {
    if(typeof this.errorClasses[code] === 'object') {
      return this.errorClasses[code];
    }
    this.errorClasses[code] = new CustomError(code, msg);
    return this.errorClasses[code];
  }
}

console.log(CustomErrorFactor.getInstance().getErrorClass(1, "error1").message);
console.log(CustomErrorFactor.getInstance().getErrorClass(2, "error2").message);