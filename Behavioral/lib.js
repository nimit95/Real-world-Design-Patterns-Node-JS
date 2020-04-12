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

module.exports = ApiRequestFactory;