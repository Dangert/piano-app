import React, { Component } from 'react';
import UserInfo from './components/UserInfo/UserInfo';
import GameControl from './components/GameControl/GameControl';
import Signin from './components/Signin/Signin';
import Signup from './components/Signup/Signup';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import RecordsTable from './components/RecordsTable/RecordsTable';
import ResponsivePiano from './components/ResponsivePiano/ResponsivePiano';
import { playSingleNote } from './components/SoundfontProvider/SoundfontProvider';
import Particles from 'react-particles-js';
import ParticlesParams from './modules/particles/particles';
import './App.css';
import { Levels, LevelConf } from './modules/levels.js'
const Routes = require('./modules/routes.js');

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const initialState = {
  route: Routes.SIGN_IN,
  currGame: {
    isRunning: false,
    level: Levels.EASY,
    note: -1,
    score: LevelConf[Levels.EASY].initScore,
    hint: {
      notes: [],
      isUsed: 'false'
    }
  },
  isSignedIn: false,
  isStateClean: true,
  user: {
    id: '',
    username: '',
    gameStats: {
      totalScore: 0,
      totalGames: 0
    },
    joined: '',
  },
  winningChord: {
    notes: [60, 64, 67],
    activeNotes: null
  },
  records: {
    isUpdated: false,
    highestScoreRecords: [],
    avgPerGameRecords: [],
    topNumber: 10
  }
}

class App extends Component {
  constructor() {
    super();
    this.scheduledEvents = [];
    this.areRecordsUpdated = false;
    this.state = initialState;
  }

  onRouteChange = (route) => {
    const { isStateClean } = this.state;
    const isSignedIn = (route === Routes.SIGN_UP || route === Routes.SIGN_IN) ? false : true;
    this.setState({route: route, isSignedIn: isSignedIn});

    if (!isSignedIn && !isStateClean) { // When signing out, clean home
      this.setState(initialState);
    }
  }

  loadUser = (data) => {
    this.setState(
    {isStateClean: false,
      user: {
        id: data.id,
        username: data.username,
        gameStats: {
          totalScore: data.total_score,
          totalGames: data.total_games
        },
        joined: data.joined
      }
    })
  }

  getHintLimits = (level, note) => {
    var limitRemainder = 0; // In case note is close to the limit by less than rangeHintNotes/2
    const rangeHintNotes = LevelConf[level].rangeHintNotes;
    const pianoFirst = LevelConf[level].noteRanges.first;
    const pianoLast = LevelConf[level].noteRanges.last;
    var hintFirst;
    var hintLast;
    if (note - pianoFirst < rangeHintNotes/2) {
      limitRemainder = rangeHintNotes/2 - (note - pianoFirst);
      hintFirst = pianoFirst;
      hintLast = note + rangeHintNotes/2 + limitRemainder;
    }
    else if (pianoLast - note < rangeHintNotes/2){
      limitRemainder = rangeHintNotes/2 - (pianoLast - note);
      hintFirst = note - rangeHintNotes/2 - limitRemainder;
      hintLast = pianoLast;
    }
    else {
      hintFirst = note - rangeHintNotes/2;
      hintLast = note + rangeHintNotes/2;
    }
    const hintLimits = Array(hintLast - hintFirst + 1).fill().map((_, idx) => hintFirst + idx);
    return hintLimits;
  }

  getHintNotes = (level, note) => {
    const numHintNotes = LevelConf[level].numHintNotes;
    var hintLimits = this.getHintLimits(level, note);
    // Randomly get hint notes out of hint limits
    var hintNotes = [note];
    hintLimits.splice(hintLimits.indexOf(note), 1); // pop note from hintLimits
    for (let i=0; i < numHintNotes - 1; i++){
      var idx = Math.floor(Math.random() * hintLimits.length);
      var hintNote = hintLimits.splice(idx, 1)[0];
      hintNotes.push(hintNote);
    }
    return hintNotes;
  }

  getRandomNoteNumber = (level) => {
    const min = LevelConf[level].noteRanges.first;
    const max = LevelConf[level].noteRanges.last;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  playGameNote = () => {
    const { currGame } = this.state;
    playSingleNote(audioContext, currGame.note);
  }

  removePrevHintNotes = (hintNotes, level) => {
    const docPianoKeys = document.querySelector(".ReactPiano__Keyboard").children;
    const pianoFirst = LevelConf[level].noteRanges.first;
    for (let i=0; i < hintNotes.length; i++) {
      docPianoKeys[hintNotes[i] - pianoFirst].classList.remove("hint_key");
    }
  }

  startNewGame = (newLevel) => {
    const { currGame } = this.state;
    const level = newLevel || currGame.level;
    if (currGame.hint.isUsed){
      this.removePrevHintNotes(currGame.hint.notes, currGame.level);
    }
    if (currGame.note !== -1) {
      this.removePrevAnswerNote(currGame.note, currGame.level);
    }
    const note = this.getRandomNoteNumber(level);
    const hintNotes = this.getHintNotes(level, note);
    this.setState({
      currGame: {...currGame,
        level: level,
        isRunning: true,
        score: LevelConf[level].initScore,
        note: note,
        hint: {
          notes: hintNotes,
          isUsed: false
        }
    }});
  }

  handleGuess = (guessNote) => {
    const { user, currGame } = this.state;
    if (currGame.isRunning) {
      if (guessNote === currGame.note){
        // Win
        this.setState({
          currGame: {...currGame,
            isRunning: false}
        });
        this.finishGame(user, currGame);
        this.playWinningChord();
      }
      else {
        const newScore = currGame.score - 1;
        if (newScore === 0){
          this.setState({
            currGame: {...currGame,
              isRunning: false,
              score: newScore}
          })
          this.finishGame(user, { ...currGame, score: newScore });
        }
        else {
          this.setState({
            currGame: {...currGame,
              score: newScore}
          })
        }
      }
    }
    // if game isn't active - ignore
  }

  handleLevelChange = (newLevel) => {
    // change css of piano-div
    const { currGame } = this.state;
    const oldLevel = currGame.level;
    var piano_div = document.querySelector('.piano-div');
    piano_div.classList.remove(oldLevel);
    piano_div.classList.add(newLevel);
    // start a new game with the new level
    this.startNewGame(newLevel);
  }

  markHintNotes = () => {
    const { currGame } = this.state;
    const hintNotes = currGame.hint.notes;
    const docPianoKeys = document.querySelector(".ReactPiano__Keyboard").children;
    const pianoFirst = LevelConf[currGame.level].noteRanges.first;
    for (let i=0; i < hintNotes.length; i++) {
      docPianoKeys[hintNotes[i] - pianoFirst].classList.add("hint_key");
    }
    const newScore = currGame.score - 1;
    this.setState(prevState => ({
      ...prevState,
      currGame: {
          ...prevState.currGame,
          score: newScore > 0 ? newScore : 0,
          hint: {
              ...prevState.currGame.hint,
              isUsed: true
          }
      }
    }))
  }

  removePrevAnswerNote = (answerNote, level) => {
    const docPianoKeys = document.querySelector(".ReactPiano__Keyboard").children;
    const pianoFirst = LevelConf[level].noteRanges.first;
    docPianoKeys[answerNote - pianoFirst].classList.remove("answer_key");
  }

  onClickAnswer = () => {
    const { currGame } = this.state;
    const docPianoKeys = document.querySelector(".ReactPiano__Keyboard").children;
    const pianoFirst = LevelConf[currGame.level].noteRanges.first;
    docPianoKeys[currGame.note - pianoFirst].classList.add("answer_key");
  }

  playWinningChord = () => {
    const { winningChord } = this.state;
    const noteDuration = 0.1;
    for (let i = 1; i <= winningChord.notes.length; i++) {
      const activeNotes = winningChord.notes.slice(0, i);
      setTimeout(() => {
        this.setState({
          winningChord: {...winningChord,
            activeNotes: activeNotes
          }
        });
      }, i * noteDuration * 1000);
    };
    setTimeout(() => {
      this.setState({
        winningChord: {...winningChord,
          activeNotes: null
        }
      });
    }, (winningChord.notes.length + 1) * noteDuration * 1000);
  };

  reloadUserGameStats = async () => {
    const { user } = this.state;
    const updatedGameStats = await fetch('https://guess-the-note-api.herokuapp.com/users/games/' + user.id, {
      method: 'GET'})
      .then(response => response.json())
      .catch(console.log);

    this.setState(prevState => ({
      ...prevState,
      user: {
          ...prevState.user,
          gameStats: {
            ...prevState.user.gameStats,
            totalScore: updatedGameStats.total_score,
            totalGames: updatedGameStats.total_games
          }
        }
      })
    );
  }

  finishGame = async (user, currGame) => {
    const { records } = this.state;
    await fetch('https://guess-the-note-api.herokuapp.com/users/games/add', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: user.id,
        score: currGame.score
      })
    }).catch(console.log);
    this.setState({
      records: {...records,
        isUpdated: false
      }
    })
    this.reloadUserGameStats();
  }

  updateRecords = () => {
    const { records } = this.state;
    if (!records.isUpdated) {
      // Update state.records if needed
      fetch('https://guess-the-note-api.herokuapp.com/users/top/' + 10, {
        method: 'GET'})
        .then(response => response.json())
        .then(updRecords => {
          this.setState({
            records: {...records,
              isUpdated: true,
              highestScoreRecords: updRecords.by_score,
              avgPerGameRecords: updRecords.by_avg
            }
          });
        })
        .catch(console.log);

  }
}

  renderRouteSwitch = () => {
    const { route, currGame, winningChord, user, records } = this.state;
    switch(route) {
      case Routes.SIGN_IN:
        return <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>;
      case Routes.SIGN_UP:
        return <Signup onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>;
      case Routes.TOP_RECORDS:
        return <RecordsTable records={records} updateRecords={this.updateRecords}/>;
      default: //Routes.HOME
        return <div>
                <UserInfo user={user}/>
                <div className={"piano-div " + currGame.level}>
                  <ResponsivePiano className='responsive-piano' noteRange={LevelConf[currGame.level].noteRanges}
                  handleGuess={this.handleGuess} activeNotes={winningChord.activeNotes} audioContext={audioContext}/>
                </div>
                <GameControl displayGame={currGame.note === -1 ? false : true}
                startNewGame={this.startNewGame} playGameNote={this.playGameNote}
                handleLevelChange={this.handleLevelChange} score={currGame.score}
                markHintNotes={this.markHintNotes} isRunning={currGame.isRunning}
                onClickAnswer={this.onClickAnswer} level={currGame.level}/>
              </div>;
    }
  }

  render() {
    const { isSignedIn } = this.state;
    return (
      <div className='App'>
        <Particles className="particles" params={ParticlesParams}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        <Logo onClick={() => {if (isSignedIn) {this.onRouteChange(Routes.HOME);}}}/>
        {this.renderRouteSwitch()}
      </div>
    );
  }
}

export default App;
