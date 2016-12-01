import React, {Component} from 'react';
import dataReducer from './dataReducer';
import {
  dataLoaded, dataSort, dataFilter,
  pageNumberChange, pageSizeChange,
} from './actions';
import {containsIgnoreCase} from './utils';
import type {State} from './types';

type Props = {
  pageLengthOptions: Array<number>;
  initialData: Array<any>;
  initialPageLength: number;
  columns: Array<any>;
  keys: Array<string>;
  buildRowOptions: any;
  filters: any;
  headerLayout: Array<object>;
  bottomLayout: Array<object>;
};

const mapPropsToState = (props) => ({
  pageSize: props.initialPageLength,
  sortBy: props.initialSortBy,
});

export default function enhanceDataTable(ComposedComponent) {
  return class DataTableEnhancer extends Component {
    static defaultProps = {
      initialPageLength: 10,
      pageLengthOptions: [ 5, 10, 20 ],
      filters: {
        globalSearch: { filter: containsIgnoreCase },
      },
      headerLayout: [
        {xs: 4, buildIn: true, component: "PageSizeChanger", title: "单页条数"},
        {xs: 4, xsOffset: 4, buildIn: true, component: "SearchBar", title: "搜索"}
      ],
      bottomLayout: [
        {xs: 8, xsOffset: 4, buildIn: true, component: "Pagination"}
      ]
    };

    constructor(props: Props) {
      super(props);
      this.state = dataReducer(
        mapPropsToState(props),
        dataLoaded(props.initialData)
      );
    }

    componentWillReceiveProps(nextProps) {
      this.setState((state) =>
        dataReducer(state, dataLoaded(nextProps.initialData))
      );
    }

    onPageNumberChange = (value) => {
      this.setState((state) => dataReducer(state, pageNumberChange(value)));
    };

    onPageSizeChange = ({target: {value}}) => {
      this.setState((state) => dataReducer(state, pageSizeChange(value)));
    };

    onSort = (value) => {
      this.setState((state) => dataReducer(state, dataSort(value)));
    };

    onFilter = (key, {target: {value}}) => {
      this.setState((state) =>
        dataReducer(state, dataFilter(key, value, this.props.filters))
      );
    };

    render() {
      return (
        <ComposedComponent
          onPageNumberChange={this.onPageNumberChange}
          onPageSizeChange={this.onPageSizeChange}
          onSort={this.onSort}
          onFilter={this.onFilter}
          data={this.state}
          {...this.props}
        />
      );
    }

  };
}
