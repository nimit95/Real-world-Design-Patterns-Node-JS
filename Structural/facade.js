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