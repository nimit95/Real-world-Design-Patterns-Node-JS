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