import React from 'react'

const Header = props => (
  <header style={{marginBottom: 10}}>
    <div style={{textAlign:'center'}} >
      <span className="header"> {props.title} </span>
    </div>

    <div style={{textAlign:'right'}} className="subheader-body">      
      <span className="subheader"> By <a className="link" href="https://github.com/alfredomarqueza">@alfredomarqueza</a></span>
    </div>
  </header>
)

export default Header
