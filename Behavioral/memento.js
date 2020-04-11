// Save board position
class Memento {
  constructor(state) {
    this.state = state;
  }
  getState() {
    return this.state;
  }
}

class TicTacToeBoard {
  constructor(state=['', '', '', '', '', '', '', '', '']) {
    this.state = state;
  }
  printFormattedBoard() {
    let formattedString = '';
      this.state.forEach((cell, index) => {
        formattedString += cell ? ` ${cell} |` : '   |';
        if((index + 1) % 3 == 0)  {
          formattedString = formattedString.slice(0,-1);
          if(index < 8) formattedString += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
        }
    });
    console.log(formattedString);
  }
  insert(symbol, position) {
    if(position > 8 || this.state[position]) return false; //Cell is either occupied or does not exist
    this.state[position] = symbol;
    return true;
  }
  createMemento() {
    return new Memento(this.state.slice());
  }
  setMemento(memnto) {
    this.state = memnto.getState();
  }
}

const board = new TicTacToeBoard(['x','o','','x','o','','o','','x']);
board.printFormattedBoard();
const checkpoints = [];
checkpoints.push(board.createMemento());
board.insert('o', 2);
board.printFormattedBoard();


// Undo previous move
board.setMemento(checkpoints.pop());
board.printFormattedBoard();
