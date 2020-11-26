import music_logo from './music_logo.png'

const Logo = ({onClick}) => {
  return (
    <div className='ml5' style={{ height: 75, width: 75 }}>
      <img className='pointer' alt='logo' src={music_logo} onClick={onClick}/>
    </div>
  )
}

export default Logo;
