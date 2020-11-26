import React from 'react';
import './GameLevel.css';
import { Levels } from '../../modules/levels.js';

class GameLevel extends React.Component {

  capitalize = (str) => {
    if (str.length > 2){
      return str[0].toUpperCase() + str.substring(1);
    }
    return str;
  }

  renderLevelBtn = (id, level, checked) => {
    const { handleLevelChange } = this.props;
    const idStr = "radio" + id;
    return (
      <div key={idStr} className='level-wrapper'>
        <input type="radio" id={idStr} name="level" value={level}
        checked={checked} readOnly onClick={() => handleLevelChange(level)}/>
          <label htmlFor={idStr}>{this.capitalize(level)}</label>
      </div>
    )
  }

  render() {
    const { currLevel } = this.props;
    const levels = Object.values(Levels);
    const currLevelIdx = levels.indexOf(currLevel);
    return (
      <div className='tc'>
        {levels.map((level, i) => {
          return this.renderLevelBtn(i+1, level, i===currLevelIdx);
        })
        }
      </div>
    )
  }
}

export default GameLevel;
