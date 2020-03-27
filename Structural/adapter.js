// fs is the adaptee class
const fs = require('fs');

// delegator class
class fsDelegator {
  read() {
    return new Error("Please implement read method!");
  }
}
/**
 * Adapter class implements the delegate
 * Converts fs callbacks to fs promisified
 */
class fsAdapter extends fsDelegator {
  read(path) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line node/prefer-promises/fs
      fs.readFile(__dirname + "/" + path, (err, buf) => {
        if(err) {
          return reject(err);
        }
        resolve(buf.toString());
      });
    });
  }
}

class Client {
  constructor() {
    this.setDelegate();
  }
  async reader() {
    return this._fsDelegate.read("adapter.js");
  }
  setDelegate() {
    this._fsDelegate = new fsAdapter();
  }
}

const client = new Client();
client.reader().then(res => console.log("Reading " + res));
