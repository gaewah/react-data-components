/**
 * @flow
 */

import {sort, filter} from './utils';
import {ActionTypes} from './actions';
import type {State, Action, SortBy} from './types';

const initialState: State = {
  initialData: [],
  data: [],
  page: [],
  filterValues: { globalSearch: '' },
  totalPages: 10,
  sortBy: null,
  pageNumber: 0,
  pageSize: 5,
  invalidate: true,
  fetching: false,
  api: "",
  initialApiParam: {}
};

function calculatePage(data, pageSize, pageNumber) {
  if (pageSize === 0) {
    return { page: data, totalPages: 0 };
  }

  const start = pageSize * pageNumber;
  //totalPages: Math.ceil(data.length / pageSize),

  return {
    page: data.slice(start, start + pageSize),
    totalPages: 10
  };
}

function ajaxCalculatePage(totalRecords, pageSize) {
  const totalPages = Math.ceil(totalRecords / pageSize);
  return {
    totalPages
  }
}

function pageNumberChange(state, {value: pageNumber}) {
  return {
    ...state,
    ...calculatePage(state.data, state.pageSize, pageNumber),
    pageNumber,
  };
}

function pageSizeChange(state, action) {
  const newPageSize = Number(action.value);
  const {pageNumber, pageSize} = state;
  const newPageNumber = newPageSize ?
    Math.floor((pageNumber * pageSize) / newPageSize) : 0;

  return {
    ...state,
    ...calculatePage(state.data, newPageSize, newPageNumber),
    pageSize: newPageSize,
    pageNumber: newPageNumber,
  };
}

function dataSort(state, {value: sortBy}) {
  const data = sort(sortBy, state.data);

  return {
    ...state,
    ...calculatePage(data, state.pageSize, state.pageNumber),
    sortBy,
    data,
  };
}

function dataFilter(state, {value: {key, value, filters}}) {
  const newFilterValues = { ...state.filterValues, [key]: value };
  let data = filter(filters, newFilterValues, state.initialData);

  if (state.sortBy) {
    data = sort(state.sortBy, data);
  }

  return {
    ...state,
    ...calculatePage(data, state.pageSize, 0),
    data,
    filterValues: newFilterValues,
    pageNumber: 0,
  };
}

function dataFetching(state) {
  return {
    ...state,
    invalidate: false,
    fetching: true,
  }
}

function dataLoaded(state, {value: data}) {
  // Filled missing properties.
  const filledState = { ...initialState, ...state };
  const {pageSize, pageNumber} = filledState;

  if (state.sortBy) {
    data = sort(state.sortBy, data);
  }

  return {
    ...filledState,
    data,
    initialData: data,
    ...calculatePage(data, pageSize, pageNumber),
  };
}

function dataReloaded(state, {value:{totalRecords, page}}) {
  const filledState = { ...initialState, ...state };
  const {pageSize} = filledState;
  return {
    ...filledState,
    page: page,
    data: page,
    initialData: page,
    ...ajaxCalculatePage(totalRecords, pageSize),
    invalidate: false,
    fetching: false,
  };
}

export default function dataReducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ActionTypes.DATA_FETCHING:
      return dataFetching(state);

    case ActionTypes.DATA_LOADED:
      return dataLoaded(state, action);

    case ActionTypes.DATA_RELOADED:
      return dataReloaded(state, action);

    case ActionTypes.PAGE_NUMBER_CHANGE:
      return pageNumberChange(state, action);

    case ActionTypes.PAGE_SIZE_CHANGE:
      return pageSizeChange(state, action);

    case ActionTypes.DATA_FILTER:
      return dataFilter(state, action);

    case ActionTypes.DATA_SORT:
      return dataSort(state, action);
  }

  return state;
}
