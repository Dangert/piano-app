import React from 'react';
import './RecordsTable.css';
import sort from './sort.png'


const OrderBy = {
  highestScore: 'highest_score',
  avgPerGame: 'avg_per_game'
}

class RecordsTable extends React.Component {
  constructor() {
    super();
    this.state = {
      orderBy: OrderBy.highestScore
    }
  }

  componentDidMount() {
    this.props.updateRecords();
  }

  setOrderBy = (newOrderBy) => {
    const { orderBy } = this.state;
    if (orderBy !== newOrderBy){
      this.setState({
        orderBy: newOrderBy
      })
    }
  }

  renderTable = (displayRecords) => {
    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Total Score
                <img className='sort-icon pointer' alt='sort' src={sort}
                onClick={() => this.setOrderBy(OrderBy.highestScore)}/>
              </th>
              <th>Average per Game
                <img className='sort-icon pointer' alt='sort' src={sort}
                onClick={() => this.setOrderBy(OrderBy.avgPerGame)}/>
              </th>
            </tr>
          </thead>
          <tbody>
            {displayRecords.map((item, i) => {
              return (
                <tr key={i}>
                  <td className="rank">{i+1}</td>
                  <td className="username">{item.username}</td>
                  <td className="score">{item.total_score}</td>
                  <td className="avg">{item.avg}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    const { records } = this.props;
    const { orderBy } = this.state;
    const displayRecords = orderBy === OrderBy.highestScore ? records.highestScoreRecords : records.avgPerGameRecords;
    return this.renderTable(displayRecords);
  }
}

export default RecordsTable;
