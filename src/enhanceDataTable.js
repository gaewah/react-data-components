import React, {Component} from 'react';
import dataReducer from './dataReducer';
import {
  dataLoaded, dataSort, dataFilter,
  pageNumberChange, pageSizeChange, dataFetchIfNeed
} from './actions';
import {containsIgnoreCase, extractStateUrl} from './utils';
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
  api: string;
  initialApiParam: object;
  initialPageNumber: number;
};

const mapPropsToState = (props) => ({
  api: props.api,
  initialApiParam: props.initialApiParam,
  pageNumber: props.initialPageNumber,
  pageSize: props.initialPageLength,
  sortBy: props.initialSortBy,
});

export default function enhanceDataTable(ComposedComponent) {
  return class DataTableEnhancer extends Component {
    static defaultProps = {
      initialApiParam: {},
      initialPageNumber: 0,
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

      this.dispatcher = {
        dataReducer,
        state:this.state,
        setState:this.setState.bind(this)
      };
    }

    componentWillMount() {
      if (this.state.api != null) {
        const url = extractStateUrl(this.state);
        this.onFetching(url);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.api == null) {
        this.setState((state) =>
          dataReducer(state, dataLoaded(nextProps.initialData))
        );
      } else {
        const newState = {...this.state, ...mapPropsToState(nextProps)}
        this.setState(newState);
        this.onFetching(extractStateUrl(newState));
      }
    }

    componentWillUpdate(nextProps, nextState) {
      if (nextState.pageNumber !== this.state.pageNumber ||
          nextState.pageSize !== this.state.pageSize ||
          (nextState.invalidate && !this.state.invalidate)) {
        this.onFetching(extractStateUrl(nextState));
      }
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

    onFetching = (url) => {
      dataFetchIfNeed(this.dispatcher, url);
    }

    render() {
      return (
        <ComposedComponent
          onPageNumberChange={this.onPageNumberChange}
          onPageSizeChange={this.onPageSizeChange}
          onSort={this.onSort}
          onFilter={this.onFilter}
          onFetching={this.onFetching}
          data={this.state}
          {...this.props}
        />
      );
    }

  };
}
