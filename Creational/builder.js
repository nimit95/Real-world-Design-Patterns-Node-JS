const net = require('net');

/**
 * This is general Outline on a basic Server
 */
class Server {
  setHostname() { }
  setPortNumer() { }
  setOnConnection() { }
  listen() { }
}

/**
 * Server Builder is implementing the server
 * using the net. New builder can easily be made to 
 * use server like exrpess etc
 */
class ServerBuilder extends Server {
  constructor() {
    super();
    this._server = null;
    this._hostname = "localhost";
    this._port = 8080;
    this._isHalfOpenedSockedAllowed = false;
    this._isPauseOnConnect = false;
    this._onConnectionCb = () => {};
  }

  setHostname(hostname) {
    this._hostname = hostname;
    return this;
  }

  setPortNumer(port) {
    this._port = port;
    return this;
  }

  setOnConnection(callback) {
    this._onConnectionCb = callback;
    return this;
  }

  setHalfOpenSocketAllowed() {
    this._isHalfOpenedSockedAllowed = true;
    return this;
  }

  setPauseOnConnect() {
    this._isPauseOnConnect = true;
    return this;
  }

  listen(callback) {
    this._server = net.createServer({
      allowHalfOpen: this._isHalfOpenedSockedAllowed,
      pauseOnConnect: this._isPauseOnConnect
    });
    this._server.on('connection', this._onConnectionCb);
    this._server.listen(this._port, this._hostname, callback);
    return this;
  }
}

// Director class will receive this builder class
let serverBuilder = new ServerBuilder();

// Director class can build server like with builder object
serverBuilder.setHostname("localhost")
  .setPortNumer(8080)
  .listen(() => console.log("server Started"));