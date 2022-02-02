import "./App.css";
import GameBoard from "./components/GameBoard";
import Header from "./components/Header";
import Keyboard from "./components/Keyboard";
import { alphabet, alphabet_lower } from "./components/Helpers";
import React from "react";
import Modal from "./components/Modal";

const og_state = {
  keys: new Array(6).fill("").map(() => new Array(5).fill("")),
  guesses: new Array(6).fill(0).map(() => new Array(5).fill(0)),
  guessedChars: alphabet_lower.reduce((map, char) => {
    map[char] = 0;
    return map;
  }, {}),
  right_word: "",
  won: false,
  shakeRow: -1,
  cursor: {
    x: 0,
    y: 0,
  },
  modal: {
    text: "",
    open: false,
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = og_state;
    this.checkWord = this.checkWord.bind(this);
  }

  componentDidMount() {
    const state = JSON.parse(localStorage.getItem("state"));
    this.setState({ ...state });
    fetch("/exp.txt")
      .then((response) => response.text())
      .then((text) => {
        const wordlist = text.split("\n");
        this.setState({ wordlist });
        this.getTodaysWord();
      });

    document.addEventListener("keydown", this.onKeyPressed);
  }

  componentDidUpdate() {
    localStorage.setItem("state", JSON.stringify(this.state));
  }

  getTodaysWord = () => {
    const date =
      new Date().setHours(0, 0, 0, 0) -
      new Date(2021, 11, 1).setHours(0, 0, 0, 0);
    const lent = this.state.wordlist.length;
    const i = parseInt((date / lent) % lent);
    if (this.state.wordlist[i] !== this.state.right_word)
      this.setState({ ...og_state });
    this.setState({ right_word: this.state.wordlist[i] });
  };

  increaseCursor = (cursor) => {
    return cursor.x + 1 > 5
      ? { x: 5, y: cursor.y }
      : { x: cursor.x + 1, y: cursor.y };
  };

  decreaseCursor = (cursor) => {
    return cursor.x - 1 < 0
      ? { x: 0, y: cursor.y }
      : { x: cursor.x - 1, y: cursor.y };
  };

  checkWord = (word) => {
    let { won, cursor, right_word, guesses, guessedChars } = this.state;

    for (var i = 0; i < word.length; i++) {
      const char = word[i];
      let correct = 0;
      if (!right_word.includes(char)) correct = 1;
      else correct = 2;
      if (right_word[i] === char) correct = 3;
      guessedChars[char] =
        correct > guessedChars[char] ? correct : guessedChars[char];

      guesses[cursor.y][i] = correct;
    }

    if (guesses[cursor.y].every((v) => v === 3)) won = true;

    if (won) this.openModal("Grattis!");

    cursor = {
      x: 0,
      y: cursor.y + 1,
    };
    this.setState({ cursor, guessedChars, guesses, won });
  };

  openModal = (text) => {
    this.setState({ modal: { text: text, open: true } });
    setTimeout(() => {
      this.setState({ modal: { open: false, text: this.state.modal.text } });
    }, 1500);
  };

  shakeRow = (row) => {
    this.setState({ shakeRow: row });
    setTimeout(() => {
      this.setState({ shakeRow: -1 });
    }, 1000);
  };

  typeChar = (e) => {
    e.key = e.target.dataset.key;
    this.onKeyPressed(e);
  };

  onKeyPressed = (e) => {
    if (this.state.won) return;
    if (alphabet.includes(e.key) && !e.metaKey) {
      let { cursor, keys } = this.state;
      if (cursor.x === 5) return;

      const key = e.key.toLowerCase();
      keys[cursor.y][cursor.x] = key;
      cursor = this.increaseCursor(cursor);

      this.setState({ keys, cursor });
    } else if (e.key === "Backspace") {
      let { cursor, keys } = this.state;
      cursor = this.decreaseCursor(cursor);
      keys[cursor.y][cursor.x] = "";

      this.setState({ keys, cursor });
    } else if (e.key === "Enter") {
      let { cursor, keys } = this.state;

      if (cursor.x !== 5) {
        this.openModal("För få bokstäver");
        this.shakeRow(cursor.y);
        return;
      }

      let word = keys[cursor.y].join("");
      if (!this.state.wordlist.includes(word)) {
        this.openModal("Ordet finns inte i listan");
        this.shakeRow(cursor.y);
        return;
      }
      this.checkWord(word);
    }
  };

  render() {
    return (
      <div className="App">
        <Header />
        <Modal text={this.state.modal.text} open={this.state.modal.open} />
        <GameBoard gameState={this.state} />
        <Keyboard typeChar={this.typeChar} gameState={this.state} />
      </div>
    );
  }
}

export default App;
