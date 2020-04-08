
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
