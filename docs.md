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
* [Facade](#facade)
* [Flyweight](#flyweight)
* [Proxy](#proxy)

**[ Behavioral](#behavioral)**
* [Chain Of Responsibility](#chain-of-responsibility)
* [Command](#command)
* [Iterator](#iterator)
* [Mediator](#mediator)



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
  getSize() { }
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
  getSize() {
    return this.buf.length || 0;
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

### Facade
##### facade.js
```Javascript
const ApiRequestFactory = require("./lib");

class ConfigFormatConvert {
  static convert(config) {
    return JSON.parse(config);
  }
}

class ConfigCheck {
  static configCheck(config) {
    if(!config.body){
      return new Error("biy doesnt exist");
    }
    return config;
  }
}

/**
 * Config facade handles all config subsystem
 * Fetching converting then sanitizing
 */
class ConfigFacade {
  static async getConfig() {
    let config = await ApiRequestFactory
      .createApiRequest("http")
      .makeGetRequest('jsonplaceholder.typicode.com/posts/1');
    
    config = ConfigFormatConvert.convert(config);
    config = ConfigCheck.configCheck(config);
    console.log(config);
  }
}

ConfigFacade.getConfig();
```

### Flyweight
##### flyweight.js
```Javascript
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
```

### Proxy
##### proxy.js
```Javascript
class DatabaseBase {
  query() {
  }
}

class Database extends DatabaseBase {
  query(query) {
    return "response" + query;
  }
}

// Cached DB obje
class CachedDatabase extends DatabaseBase {
  constructor() {
    super();
    this.cacheQuery = {};
  }
  query(query) {
    if(this.cacheQuery[query]) {
      return this.cacheQuery[query];
    }
    this.cacheQuery[query] = this.getDatabase().query("quer1");
    return this.cacheQuery[query];
  }
  // Lazy initiallization of heavy obejct
  getDatabase() {
    if(typeof this._database === 'object')
      return this._database;
    this._database = new Database();
    return this._database;
  }
}

/**
 * CachedDatabase is proxy object for original db
 * Lazy initialization 
 * Access control
 */
const db = new CachedDatabase();
console.log(db.query("query1"));
```


## Behavioral
### Chain Of Responsibility
##### chainOfResponsibility.js
```Javascript
class ConfigCheck {
  check() {
    return true;
  }

  setNext(next) {
    // Returning a handler from here will let us link handlers in a convenient
    this._next = next;
    return next;
  }
}

// Chanin of commands for checking config
class AuthCheck extends ConfigCheck {
  check(config) {
    if (!config.key) return new Error("No key");
    if (!config.password) return new Error("No password");
    if (this._next)
      return this._next.check(config);
    else {
      return super.check();
    }
  }
}

class URLCheck extends ConfigCheck {
  check(config) {
    if (!config.url) return new Error("No valid URL");
    if (this._next)
      return this._next.check(config);
    else {
      return super.check();
    }
  }
}

const urlChecker = new URLCheck();
const authChecker = new AuthCheck();

urlChecker.setNext(authChecker);

console.log(urlChecker.check({}));
const config = {
  key: "abc",
  password: "secret",
  url: "valid url"
};
console.log(urlChecker.check(config));
```

### Command
##### command.js
```Javascript
class Command {
  execute() {
    return new Error("Implement execute method!");
  }
}

/**
 * Simple Stream workflow
 */

class Stream {
  constructor() {
    this._handlers = {};
  }
  on(key, command) {
    this._handlers[key] = command;
  }
  connect() {
    // On sftream connect
    if(this._handlers['connect']) {
      this._handlers['connect'].execute();
    }
    // Do some other work 
    // disconnect the connection and call callback
    if(this._handlers['disconnect']) {
      this._handlers['disconnect'].execute();
    }
  }
}
// A command implementation
class ConnectCallback extends Command {
  execute() {
    console.log("executing connect callback");
  }
}
class DisconnectCallback extends Command {
  execute() {
    console.log("executing disconnect callback");
  }
}

const exampleStream = new Stream();
exampleStream.on('connect', new ConnectCallback());
exampleStream.on('disconnect', new DisconnectCallback());

exampleStream.connect();
```

### Iterator
##### iterator.js
```Javascript
const fs = require('fs');

class Iterator {
  getNext() {}
  hasNext() {}
}

// Internally maintains list of files in the folder
class FileBufferIterator extends Iterator {
  constructor(folderPath) {
    super();
    this.folderPath = folderPath;
    this.currentPosition = 0;
    this.init();
  }
  init() {
    const folderPath = this.folderPath;
    let fileList = fs.readdirSync(folderPath);
    console.log(fileList);
    fileList = fileList.map(fileName => folderPath + "/" + fileName);
    this.fileBuffer = fileList.map(filePath => fs.readFileSync(filePath));
  }
  getNext() {
    if(this.hasNext()) {
      return this.fileBuffer[this.currentPosition++];
    }
  }
  hasNext() {
    return this.fileBuffer.length > this.currentPosition;
  }
}

function totalSize(iterator) {
  let size = 0;
  while(iterator.hasNext()) {
    size += iterator.getNext().length;
  }
  return size;
}

console.log(totalSize(new FileBufferIterator(__dirname)));
```

### Mediator
##### mediator.js
```Javascript
const cluster = require('cluster');
if (cluster.isMaster) {
  // Mediate between master class and forks
  class MasterProcessMediator {
    constructor() {
      this.forks = [];
    }
    init() {
      const worker = cluster.fork();
      this.forks.push(worker);
      // 
      worker.on('message', 
        (() => (message) => this.handleMessageFromWorker(worker.id, message))()
      );
    }
  
    // handler for various workers
    handleMessageFromWorker(workerId, message) {
      console.log("Worker " + workerId + " says hi with msg " + message);
    }
  
    notifyAllWorker() {
      this.forks.map(fork => fork.send("received Msg"));
    }
  }

  const mediator = new MasterProcessMediator();
  mediator.init();

  mediator.notifyAllWorker();
} else {
  process.on('message', (message) => {
    console.log(cluster.worker.id + " " + message);
  });
  process.send("working");
  setTimeout(() => process.kill(process.pid), 0);
}


```



