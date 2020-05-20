import React, { Component } from 'react'
import moment from 'moment';

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      culture: "en-US"
    };

    moment.locale(this.state.culture);

  }

  onSelectCulture = (e) => {
    this.setCulture(e.target.value)
  }

  setCulture(culture) {
    moment.locale(culture);
    this.setState({ culture }); //, () => { this.getCurrentPrice(); });
  }

  render() {
    return (
      <header style={{ marginBottom: 10 }}>
        <div style={{ textAlign: 'center' }} >
          <span className="header"> BITCOIN PRICE PREDICTOR</span>
        </div>

        <div style={{ textAlign: 'right' }} className="subheader-body">
          <span className="subheader"> By <a className="link" href="https://github.com/alfredomarqueza">@alfredomarqueza</a></span>
          <select className="input-element" value={this.state.culture} onChange={this.onSelectCulture}>
            <option value="en-US"> United States </option>
            <option value="ja"> Japan </option>
            <option value="ru"> Russia </option>
            <option value="es"> Spain </option>
          </select>
        </div>
      </header>
    )

  }

}

export default Header
