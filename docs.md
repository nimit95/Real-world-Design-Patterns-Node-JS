# Real World Design Patterns using NodeJs APIs

**[ Creational](#creational)**
* [Abstract Factory](#abstract-factory)
* [Builder](#builder)
* [Factory Method](#factory-method)
* [Prototype](#prototype)
* [Singleton](#singleton)

**[ Structural](#structural)**
* [Adapter](#adapter)
* [Bridge](#bridge)
* [Composite](#composite)
* [Decorator](#decorator)



## Creational
### Abstract Factory
##### abstractFactory.js
```Javascript
const net = require('net');
const http = require('http');

// Abstract Product Class
class ApiRequest {
  makeGetRequest(url) {
    return Error(`Implement make Get Request for ${url}`);
  }
}

// Product A
class tcpApiRequest extends ApiRequest {
  makeGetRequest(url) {
    // Handling simple get request without query params
    return new Promise((resolve, reject) => {
      const socket = net.createConnection({
        host: "www.example.com",
        port: "80"
      });

      socket.on('data', (data) => resolve(data.toString()));

      socket.on('error', err => reject(err));
  
      socket.end(`GET / HTTP/1.1\r\nHost: ${url}\r\n\r\n`);
    });
    
  }
}

// Product B
class httpApiRequest extends ApiRequest {
  makeGetRequest(url) {
    // Handling simple get request without query params
    return new Promise((resolve, reject) => {
      http.request(`http://${url}`, (res) => {
        res.on('data', data => resolve(data.toString()));
        res.on('error', err => reject(err));
      }).end();
    });
  }
}

/**
 * This is an abstract factory interface. Uses a static function to 
 * generate family of products.
 */
class ApiRequestFactory {
  static createApiRequest(kind) {
    // This can easily be extended to include HTTPS, HTTP2, HTTP3
    switch(kind) {
      case "tcp":
        return new tcpApiRequest();
      case "http":
        return new httpApiRequest();
    }
  }
}

/**
 * Use this in another class making the product class
 * and client class isolated
 */
const availableOptions = ["tcp", "http"];
const apiRequest = ApiRequestFactory.createApiRequest(availableOptions[Math.floor(Math.random() * 2)]);
apiRequest.makeGetRequest("example.com")
  .then(response => console.log(response))
  .catch(err => console.log(err));
```

### Builder
##### builder.js
```Javascript
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
```

### Factory Method
##### factoryMethod.js
```Javascript
const net = require('net');
const http = require('http');

// Abstract Product Class
class ApiRequest {
  makeGetRequest(url) {
    return Error(`Implement make Get Request for ${url}`);
  }
}

// Product A
class tcpApiRequest extends ApiRequest {
  makeGetRequest(url) {
    // Handling simple get request without query params
    return new Promise((resolve, reject) => {
      console.log("using tcp Request");
      const socket = net.createConnection({
        host: "www.example.com",
        port: "80"
      });

      socket.on('data', (data) => resolve(data.toString()));

      socket.on('error', err => reject(err));
  
      socket.end(`GET / HTTP/1.1\r\nHost: ${url}\r\n\r\n`);
    });
    
  }
}

// Product B
class httpApiRequest extends ApiRequest {
  makeGetRequest(url) {
    // Handling simple get request without query params
    return new Promise((resolve, reject) => {
      console.log("using http Request");
      http.request(`http://${url}`, (res) => {
        res.on('data', data => resolve(data.toString()));
        res.on('error', err => reject(err));
      }).end();
    });
  }
}

// This is the class that would be using the Product
class ClientTcp {
  main() {
    /**
     * Client/Director class is not directly making an object
     * It uses a class function for doing it
     */
    const apiRequest = this.makeGetRequest();
    apiRequest.makeGetRequest("example.com")
      .then(respone => console.log(respone))
      .catch(err => console.log(err));
  }
  // Factory method
  makeGetRequest() {
    return new tcpApiRequest();
  }
}

class ClientHTTP extends ClientTcp {
  // Overriding factory method to use different object
  makeGetRequest() {
    return new httpApiRequest();
  }
}

let c = new ClientHTTP();
c.main();
```

### Prototype
##### prototype.js
```Javascript
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
```

### Singleton
##### singleton.js
```Javascript
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
```


## Structural
### Adapter
##### adapter.js
```Javascript
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

```

### Bridge
##### bridge.js
```Javascript
/**
 * ApiRequestFactory gives underlying implementation of 
 * api get request that we make
 */
const ApiRequestFactory = require("./lib");
class UpstreamFile {
  getFileUpstream() { }
}
/**
 * This is abstraction class that doesnt care about
 * the implementation of api request. 
 */
class Config extends UpstreamFile {
  constructor(url, apiRequest) {
    super();
    this.url = url;
    this.apiRequest = apiRequest;
  }
  getFileUpstream() {
    this.apiRequest
      .makeGetRequest(this.url)
      .then(response => console.log(response))
      .catch(err => console.log(err));
  }
}

class Post extends UpstreamFile {
  constructor(url, apiRequest) {
    super();
    this.url = url;
    this.apiRequest = apiRequest;
  }
  getFileUpstream() {
    this.apiRequest
      .makeGetRequest(this.url)
      .then(response => console.log(response))
      .catch(err => console.log(err));
  }
}
/**
 * AbstractFactory is used to generate related implementation for these 
 * classes
 */
new Config("https://jsonplaceholder.typicode.com/todos/1", ApiRequestFactory.createApiRequest("tcp")).getFileUpstream();
new Post("jsonplaceholder.typicode.com/posts/1", ApiRequestFactory.createApiRequest("http")).getFileUpstream();
```

### Composite
##### composite.js
```Javascript

class ContentBuffer {
  getSize() {
    return this.buf.length || 0;
  }
}

// Composite Class has children as filebuffer
class DirBuffer extends ContentBuffer {
  constructor() {
    super();
    this.bufferList = [];
  }
  getSize() {
    return this.bufferList.map(buf => buf.getSize()).reduce((a, b) => a + b);
  }
  addBuffer(buf) {
    this.bufferList.push(buf);
  }
}
// Leaf class
class FileBuffer extends ContentBuffer {
  setBuffer(buf) {
    this.buf = buf;
    return this;
  }
}

const file1 = new FileBuffer().setBuffer(Buffer.from("hello"));
const file2 = new FileBuffer().setBuffer(Buffer.from("hello2"));

const compositeObj = new DirBuffer();
compositeObj.addBuffer(file1);
compositeObj.addBuffer(file2);
console.log(compositeObj.getSize());

```

### Decorator
##### decorator.js
```Javascript
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
```



