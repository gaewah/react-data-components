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
      <div className={this.props.className}>
        <label htmlFor="search-field">{title}:</label>
        <input
          id="search-field"
          type="search"
          value={filterValues.globalSearch}
          onChange={onFilter.bind(null, 'globalSearch')}
        />
      </div>
    )
  }
}