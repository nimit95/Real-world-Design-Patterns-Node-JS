/**
 * Abtract component
 */
class Logger {
  log() {
  }
}

class BasicLogger extends Logger {
  log(msg) {
    console.log(msg);
  }
}
// Decorator class 1
class DateDecorator extends Logger {
  constructor(logger) {
    super();
    this._logger = logger;
  }
  log(msg) {
    msg = "[" + new Date() + "] " + msg;
    this._logger.log(msg);
  }
}
// Decorator class 2
class ColorDecorator extends Logger {
  constructor(logger) {
    super();
    this._logger = logger;
    this.color = "\x1b[40m";

  }
  log(msg) {
    msg = "\x1b[36m"+ msg + "\x1b[0m";
    this._logger.log(msg);
  }
}

/**
 * Enhancing logger via decoratoe
 */
const basicLogger = new BasicLogger();
const colorDecorator = new ColorDecorator(basicLogger);
const dateDectorator = new DateDecorator(colorDecorator);
dateDectorator.log("Hello World");