import React from 'react';
import './GameControl.css';
import GameLevel from './GameLevel'
import play from './play.png'

class GameControl extends React.Component {

  onClickHint = () => {
    const { markHintNotes } = this.props;
    document.querySelector(".hint-btn").disabled = true;
    markHintNotes();
  }

  enableHint = () => {
    const hintBtn = document.querySelector(".hint-btn");
    if (hintBtn) {
      hintBtn.disabled = false;
    }
  }

  render() {
    const { displayGame, startNewGame, playGameNote, handleLevelChange, score, isRunning, onClickAnswer, level } = this.props;
    return (
      <div className='image-div ma4 br3 center tc'>
        <GameLevel handleLevelChange={(level) => {this.enableHint(); handleLevelChange(level);}} currLevel={level}/>
        <div>
          <button className='mv3 pa2 ph4'
          onClick={e => {this.enableHint(); startNewGame();}}>New Game</button>
        </div>
        {displayGame &&
        <div className="game-div shadow-4">
          {(!isRunning)
            ? ((score > 0)
              ? <div>
                  <h3>You got it! Your points were added to your total score! </h3>
                  <h2>{score}</h2>
                </div>
              : <h3>Well, you can't always win!
                  <div><button className='pa1 mt3 answer-btn' onClick={onClickAnswer}>Answer</button></div>
                </h3>
              )
            : <div>
                <h3>Current game score is:</h3>
                <h2>{score}</h2>
              </div>
          }
          <img className='pointer grow ma3' alt='logo' src={play} onClick={playGameNote}/>
          <p>Too hard? Lose 1 point and try this</p>
          <button className='pa1 hint-btn' onClick={this.onClickHint}>Hint</button>
        </div>}
      </div>
    )
  }
}

export default GameControl;
