/**
 * ApiRequestFactory gives underlying startegies for Ali request
 */
const ApiRequestFactory = require("./lib");
class UpstreamFile {
  getFileUpstream() { }
}
/**
 * Here by default Stategy for API request is http
 */
class Config extends UpstreamFile {
  constructor(url, apiRequest) {
    super();
    this.url = url;
    this.apiRequest = apiRequest || ApiRequestFactory.createApiRequest("http");
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
const config = new Config("jsonplaceholder.typicode.com/posts/1");
// Using default config http
config.getFileUpstream();

const config2 = new Config("https://jsonplaceholder.typicode.com/todos/1",
  ApiRequestFactory.createApiRequest("tcp"));
// Get tcp strategy
config2.getFileUpstream();
