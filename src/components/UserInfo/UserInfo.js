import './UserInfo.css';

function roundTwoDecimalPlaces(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

const UserInfo = ({ user }) => {
  const avgPerGame = user.gameStats.totalGames > 0
  ? roundTwoDecimalPlaces(user.gameStats.totalScore/user.gameStats.totalGames)
  : 0;
  return (
    <div className="user-info tc shadow-3">
      <h2>Welcome {user.username}!</h2>
      <h3>Your score is</h3>
      <h1>{user.gameStats.totalScore}</h1>
      <p>Average per Game: {avgPerGame}</p>
    </div>
  )
}

export default UserInfo;
