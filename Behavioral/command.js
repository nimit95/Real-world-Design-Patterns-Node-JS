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