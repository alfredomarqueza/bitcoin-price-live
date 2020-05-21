import React, { Component } from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import {changeCulture} from '../redux/regionActions';

class Header extends Component {

  onSelectCulture = (e) => {
    this.setCulture(e.target.value)
  }

  setCulture(culture) {
    
    moment.locale(culture);
    this.props.changeCulture(culture);
  }

  render() {
    return (
      <header style={{ marginBottom: 10 }}>
        <div style={{ textAlign: 'center' }} >
          <span className="header"> BITCOIN PRICE LIVE</span>
        </div>

        <div style={{ textAlign: 'right' }} className="subheader-body">
          <span className="subheader"> By <a className="link" href="https://github.com/alfredomarqueza">@alfredomarqueza</a></span>
          <select className="input-element" value={this.props.culture} onChange={this.onSelectCulture}>
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

const mapStateToProps = state => {  
  return {
    culture : state.culture
  }
}

const mapDispatchToProps = dispatch => {

  return { changeCulture: (culture) => dispatch(changeCulture(culture)) }
}

export default connect(mapStateToProps,mapDispatchToProps) (Header);
