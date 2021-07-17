import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { generate } from './utils/words';
import useKeyPress from './hooks/useKeyPress';
import { currentTime } from './utils/time';

// https://betterprogramming.pub/create-a-typing-game-with-react-hooks-usekeypress-and-faker-28bbc7919820

const initialWords = generate();
console.log(initialWords);

function App() {

  const [leftPadding, setLeftPadding] = useState(
    new Array(20).fill(' ').join(''),
  );
  const [outgoingChars, setOutgoingChars] = useState('');
  const [currentChar, setCurrentChar] = useState(initialWords.charAt(0));
  const [incomingChars, setIncomingChars] = useState(initialWords.substr(1));

  const [startTime, setStartTime] = useState();
  const [wordCount, setWordCount] = useState(0);
  const [wpm, setWpm] = useState(0);

  const [accuracy, setAccuracy] = useState(0);
  const [typedChars, setTypedChars] = useState('');

  useKeyPress(key => {
    if (!startTime) {
      setStartTime(currentTime());
    }
    //1
    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;
    
    const updatedTypedChars = typedChars + key;
    setTypedChars(updatedTypedChars);

    setAccuracy(
      ((updatedOutgoingChars.length * 100) / updatedTypedChars.length).toFixed(
        2,
      ),
    );

    //2
    if (key === currentChar) {
      //3
      if (incomingChars.charAt(0) === ' ') {
        //4
        setWordCount(wordCount + 1);
        //5
        const durationInMinutes = (currentTime() - startTime) / 60000.0;
        //6
        setWpm(((wordCount + 1) / durationInMinutes).toFixed(2));
      }


      if (leftPadding.length > 0) {
        setLeftPadding(leftPadding.substring(1));
      }
      //4
      updatedOutgoingChars += currentChar;
      setOutgoingChars(updatedOutgoingChars);
      
      //5      
      setCurrentChar(incomingChars.charAt(0));
      
      //6
      updatedIncomingChars = incomingChars.substring(1);
      if (updatedIncomingChars.split(' ').length < 10) {
        updatedIncomingChars +=' ' + generate();
      }
      setIncomingChars(updatedIncomingChars);
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="Character">
          <span className="Character-out">
            {(leftPadding + outgoingChars).slice(-20)}
          </span>
          <span className="Character-current">{currentChar}</span>
          <span>{incomingChars.substr(0, 20)}</span>
        </p>
        <h3>
          WPM: {wpm} | ACC: {accuracy}%
        </h3>
      </header>
    </div>
  );
}

export default App;
