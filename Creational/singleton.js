class Server {
  constructor(port) {
    this._port = port;
  }
  static init(port) {
    if (typeof Server.instance === 'object') {
      return Server.instance;
    }
    Server.instance = new Server(port);
    return Server.instance;
  }
  static getInstance() {
    if (typeof Server.instance === 'object') {
      return Server.instance;
    }
    Server.instance = new Server(8080);
    return Server.instance;
  }
  status() {
    console.log("Server listening on port " + this._port);
  }
}

/**
 * Client calls init, and getInstance would give that instance
 * always. Singleton is used for heavy single use objects like DB
 */
Server.init(1234);
Server.getInstance().status();