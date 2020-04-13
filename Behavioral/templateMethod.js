// Base template class which computes from buffer
class DataBuffer {
  constructor(data) {
    this.data = data;
  }
  sanitize(data) {
    return data;
  }
  checkForErrors() {
    return false;
  }
  compute() {
    // Hook to check for errors
    const isError = this.checkForErrors(this.data);
    if(isError) {
      return -1;
    }
    // Hook to sanitize buffer
    const santizeBuffer = this.sanitize(this.data);

    return santizeBuffer.byteLength;
  }
}

class WordBuffer extends DataBuffer {
  constructor(data) {
    super(data);
  }
  // Gets only first word
  sanitize(data) {
    return Buffer.from(data.toString().split(" ")[0]);
  }
}

const generalBuffer = new DataBuffer(Buffer.from('abc def'));
console.log(generalBuffer.compute());

// Uses Sanitize hook to remove all other words
const wordBuffer = new WordBuffer(Buffer.from('abc def'));
console.log(wordBuffer.compute());

