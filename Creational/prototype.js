class Server {

  constructor(port) {
    this._port = port;
  }
  listen() {
    console.log("Listening on port");
  }
  clone() {
    return new Server(this._port);
  }
}

const server = new Server();
const newServer = server.clone();
newServer.listen();