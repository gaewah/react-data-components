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
      <div className={`${this.props.className} form-horizontal`}>
        <div className="form-group">
          <div className="col-xs-3">
          <label style={{lineHeight: "34px"}} htmlFor="page-menu">{title}:</label>
          </div>
          <div className="col-xs-9">
          <select
            id="page-menu"
            className="form-control"
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
        </div>
      </div>
    )
	}
}