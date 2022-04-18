class TokenReader {
  constructor(str, splitToken = " ") {
    this.str = str;
    this.strReader = str.split(splitToken);
    this.pointer = 0;
    this.MAX_POINTER = this.strReader.length - 1;
  }

  nextToken() {
    if (this.pointer <= this.MAX_POINTER) {
      return this.strReader[this.pointer++];
    }
    return null;
  }
}

export default TokenReader;
