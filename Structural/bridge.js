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