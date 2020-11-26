const SignUser = ({ title, onSubmit, onUsernameChange, onPasswordChange, error, hasSignupBtn, onSignup }) => {
  return (
    <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw5 shadow-5 center">
      <main className="pa4 black-80">
        <div className="measure center">
          <fieldset id={title.toLowerCase().replace(' ', '-')} className="ba b--transparent ph0 mh0">
            <legend className="f4 fw6 ph0 mh0">{title}</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="name">Username</label>
              <input
              className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
              type="text"
              name="name"
              id="name"
              onChange={onUsernameChange}
              onKeyDown={(e) => {if (e.key === 'Enter') {onSubmit()}}}/>
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
              <input
              className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
              type="password"
              name="password"
              id="password"
              onChange={onPasswordChange}
              onKeyDown={(e) => {if (e.key === 'Enter') {onSubmit()}}}/>
            </div>
          </fieldset>
          {error ?
            <p className='f6 tl dark-red ma0 mb3'>*{error}</p>
            : null
          }
          <div className="">
            <input
            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
            type="submit"
            value={title}
            onClick={onSubmit}/>
          </div>
          {hasSignupBtn ?
            <div className="lh-copy mt3">
              <p className="f6 link dim black db pointer" onClick={onSignup}>Sign up</p>
            </div>
            : null}
        </div>
      </main>
    </article>
  )
}

export default SignUser;
