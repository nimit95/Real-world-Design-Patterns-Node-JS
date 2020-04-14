
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
  accept(visitor) {
    this.bufferList.map(buf => buf.accept(visitor));
    return visitor.visitDirBuffer(this);
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
  accept(visitor) {
    visitor.visitFileBuffer(this);
  }
}

// Implement all the alogorithm in visitor
class ByteCodeVisitor {
  constructor() {
    this.accumlate = 0;
  }
  visitDirBuffer() {
    return this.accumlate;
  }
  visitFileBuffer(fileBuffer) {
    this.accumlate += fileBuffer.buf.byteLength;
  }
}

const file1 = new FileBuffer().setBuffer(Buffer.from("hello"));
const file2 = new FileBuffer().setBuffer(Buffer.from("hello2"));

const compositeObj = new DirBuffer();
compositeObj.addBuffer(file1);
compositeObj.addBuffer(file2);
console.log(compositeObj.getSize());

const visitor = new ByteCodeVisitor();
console.log(compositeObj.accept(visitor));