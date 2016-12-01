import React, { PropTypes, Component } from 'react';

export default class SearchBar extends Component {
  static defaultProps = {
    title: "Search"
  };

  static propTypes = {
    title: PropTypes.string,
    filterValues: PropTypes.object.isRequired,
    onFilter: PropTypes.func.isRequired,
  };

  render() {
    const {title, filterValues, onFilter} = this.props;
    return (
      <div className={`${this.props.className} form-horizontal`}>
        <div className="form-group">
          <div className="col-xs-3">
            <label style={{lineHeight: "34px"}} htmlFor="search-field">{title}:</label>
          </div>
          <div className="col-xs-9">
            <input
              id="search-field"
              className="form-control"
              type="search"
              value={filterValues.globalSearch}
              onChange={onFilter.bind(null, 'globalSearch')}
            />
          </div>
        </div>
      </div>
    )
  }
}