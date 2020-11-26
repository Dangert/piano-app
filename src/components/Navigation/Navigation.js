const Routes = require('../../modules/routes.js');

const Navigation = ({onRouteChange, isSignedIn}) => {
  if (isSignedIn) {
    return (
      <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
        <p className='f6 link dim black pa3 pointer ba' onClick={() => onRouteChange(Routes.TOP_RECORDS)}>Top 10</p>
        <p className='f6 link dim black pa3 pointer' onClick={() => onRouteChange(Routes.SIGN_IN)}>Sign Out</p>
      </nav>
    )
  }
  else {
    return (
      <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
          <p className='f6 link dim black pa3 pointer' onClick={() => onRouteChange(Routes.SIGN_IN)}>Sign In</p>
          <p className='f6 link dim black pa3 pointer' onClick={() => onRouteChange(Routes.SIGN_UP)}>Sign Up</p>
      </nav>
    )
  }
}

export default Navigation;
