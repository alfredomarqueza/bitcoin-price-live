import React from 'react'

const Header = props => (
  <header style={{marginBottom: 10}}>
    <div>
      <span className="header"> {props.title} </span>
    </div>

    <div className="subheader-body">
      <span className="subheader"> Written by <a className="link" href="https://markonsoftware.com">@MarkFChavez</a>. </span>
      <span className="subheader"> Upgraded by <a className="link" href="https://twitter.com/alfredomarqueza">@alfredomarqueza</a> . </span>
    </div>
  </header>
)

export default Header
