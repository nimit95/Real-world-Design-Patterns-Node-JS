const net = require('net');
// Socket Object
// Internal State depends on underlying tcp connection
// Can be readt connect error, close
class Socket {
  constructor() {
    this.state = new ReadyState(this);
  }
  connect(url) {
    this.state.connect(url);
  }
  setState(state) {
    this.state = state;
  }
  printState() { console.log("State is ", this.state); }
}

class State {
  connect() { }
}
class ReadyState extends State {
  constructor(socket) {
    super();
    this.socket = socket;
  }
  connect(url) {
    const connection = net.createConnection({
      host: url,
      port: "80"
    });
    connection.on('error', () => this.socket.setState(new ErrorState(this.socket)) );
    connection.on('connect', () => this.socket.setState(new ConnectState(this.socket)));
    connection.on('close', () => this.socket.setState(new CloseState(this.socket)));
  }
}

class ErrorState extends State {
  constructor(socket) {
    super();
    this.socket = socket;
  }
  connect() {
    console.log("cannot connect in error state");
  }
}

class ConnectState extends State {
  constructor(socket) {
    super();
    this.socket = socket;
  }
}

class CloseState extends State {
  constructor(socket) {
    super();
    this.socket = socket;
  }
}

const socket = new Socket();
const url = "www.example.com";
socket.connect(url);
socket.printState();
// After some time state changes to conenct
setTimeout(() => socket.printState(), 1000);