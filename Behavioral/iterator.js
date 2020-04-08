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