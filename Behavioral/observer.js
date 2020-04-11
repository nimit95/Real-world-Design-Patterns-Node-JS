const fs = require('fs');
// Manages a Subject interactions with observer
class SubjectManager {
  constructor() {
    this._observers = {};
  }
  addObserver(eventType, observer) {
    if(!this._observers[eventType]) {
      this._observers[eventType] = [];
    }
    this._observers[eventType].push(observer);
  }
  removeObserver(eventType, observer) {
    const idx = this._observers[eventType].indexOf(observer);
    if(idx > -1){
      this._observers[eventType].splice(idx);
    }
  }
  notify(eventType, data) {
    this._observers[eventType].forEach(observer => observer.update(data));
  }
}

class FileManager {
  constructor() {
    this.subjectManager = new SubjectManager();
  }
  monitorFile(path) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    fs.watch(path, (data) => this.subjectManager.notify("change", {path, data}));
  }
  addObserver(eventType, observer) {
    this.subjectManager.addObserver(eventType, observer);
  }
  removeObserver(eventType, observer) {
    this.subjectManager.removeObserver(eventType, observer);
  }
}
class LoggingObserver {
  update({ data }) {
    console.log(data);
  }
}
class SizeChangeObserver {
  constructor() {
    this.size = 0;
  }
  update({ path }) {
    const newSize = fs.statSync(path).size;
    if(newSize > this.size) {
      console.log("size increase to "  + newSize);
      this.size = newSize;
    }
  }
}

// Subject class
const fileManager = new FileManager();
// Adding observers
fileManager.addObserver("change", new LoggingObserver());
fileManager.addObserver("change", new SizeChangeObserver());
fileManager.monitorFile(process.argv[1]);