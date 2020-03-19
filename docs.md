# Real World Design Patterns using NodeJs APIs

**[ Creational](#creational)**
* [Abstract Factory](#abstract-factory)
* [Builder](#builder)
* [Factory Method](#factory-method)



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
  .then(respone => console.log(respone))
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

let c = new ClientHTTP;
c.main();
```



