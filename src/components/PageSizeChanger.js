import React, { PropTypes, Component } from 'react';

export default class PageSizeChanger extends Component {
  static defaultProps = {
    title: "Page size"
  };

  static propTypes = {
    title: PropTypes.string,
    pageSize: PropTypes.number.isRequired,
    onPageSizeChange: PropTypes.func.isRequired,
    pageLengthOptions: PropTypes.arrayOf(PropTypes.number.isRequired)
  };

	render() {
    const {title, pageSize, onPageSizeChange, pageLengthOptions} = this.props;
    return (
      <div className={this.props.className}>
        <label htmlFor="page-menu">{title}:</label>
        <select
          id="page-menu"
          value={pageSize}
          onChange={onPageSizeChange}
        >
          {pageLengthOptions.map(opt =>
            <option key={opt} value={opt}>
              {opt === 0 ? 'All' : opt}
            </option>
          )}
        </select>
      </div>
    )
	}
}