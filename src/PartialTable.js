import React, {Component} from 'react';
import Table from './Table';
import Pagination from './components/Pagination';
import PageSizeChanger from './components/PageSizeChanger';
import SearchBar from './components/SearchBar';

export default class PartialTable extends Component {

  constructor(props) {
    super(props);
    this.renderPageSizeChanger = this.renderPageSizeChanger.bind(this);
    this.renderSearchBar = this.renderSearchBar.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.renderLayout = this.renderLayout.bind(this);
  }

  renderPageSizeChanger(title, className) {
    const {onPageSizeChange, pageLengthOptions} = this.props;
    const {pageSize} = this.props.data;
    return (<PageSizeChanger
      title = {title}
      className = {className}
      pageSize = {pageSize}
      onPageSizeChange = {onPageSizeChange}
      pageLengthOptions = {pageLengthOptions}
    />)
  }

  renderSearchBar(title, className) {
    const {onFilter} = this.props;
    const {filterValues} = this.props.data;
    return (<SearchBar
      title = {title}
      className = {className}
      filterValues = {filterValues}
      onFilter = {onFilter}
    />)
  }

  renderPagination(className) {
    const {onPageNumberChange} = this.props;
    const {pageNumber, totalPages} = this.props.data;
    return (<Pagination
      className={`pagination pull-right ${className}`}
      currentPage={pageNumber}
      totalPages={totalPages}
      onChangePage={onPageNumberChange}
    />)
  }

  renderLayout(layout) {
    const {
      renderPageSizeChanger,
      renderSearchBar,
      renderPagination,
    } = this;
    return (
    <div className="row">
      {layout.map(item => {
        let classes = [];
        if (item.xs > 0) classes.push("col-xs-"+item.xs);
        if (item.xsOffset > 0) classes.push("col-xs-offset-"+item.xsOffset);
        if (item.md > 0) classes.push("col-mg-"+item.mg);
        if (item.mdOffset > 0) classes.push("col-mg-offset-"+item.mgOffset);
        if (item.lg > 0) classes.push("col-lg-"+item.xs);
        if (item.lgOffset > 0) classes.push("col-lg-offset-"+item.lgOffset);
        let className = classes.join(" ");
        let component = item.component;
        if (item.buildIn) {
          switch (component) {
            case "PageSizeChanger": 
              component = renderPageSizeChanger(item.title, item.className);
              break;
            case "SearchBar":
              component = renderSearchBar(item.title, item.className);
              break;
            case "Pagination":
              component = renderPagination(item.className);
              break;
            default:
              break;
          }
        }
        return (
          <div className={className} key={Math.random(10)}>
            {component}
          </div>
        )
      }
      )}
    </div>
    )
  }

  render() {
    const {
      renderLayout
    } = this;

    const {
      onFilter, onPageSizeChange, onPageNumberChange, onSort,
      pageLengthOptions, columns, keys, buildRowOptions,
      headerLayout, bottomLayout
    } = this.props;

    const {
      page, pageSize, pageNumber,
      totalPages, sortBy, filterValues,
    } = this.props.data;

    return (
      <div className="container">
        {renderLayout(headerLayout)}
        <Table
          className="table table-bordered"
          dataArray={page}
          columns={columns}
          keys={keys}
          buildRowOptions={buildRowOptions}
          sortBy={sortBy}
          onSort={onSort}
        />
        {renderLayout(bottomLayout)}
      </div>
    );
  }

}
