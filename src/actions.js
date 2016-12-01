/**
 * @flow
 */

import type {Action, SortBy, Value, Filters} from './types';

export const ActionTypes = {
  DATA_LOADED: 'DATA_LOADED',
  PAGE_NUMBER_CHANGE: 'PAGE_NUMBER_CHANGE',
  PAGE_SIZE_CHANGE: 'PAGE_SIZE_CHANGE',
  DATA_FILTER: 'DATA_FILTER',
  DATA_SORT: 'DATA_SORT',
  DATA_RELOADED: 'DATA_RELOADED',
  DATA_FETCHING: 'DATA_FETCHING',
  DATA_INVALIDATE: 'DATA_INVALIDATE'
};

export function pageNumberChange(value: number): Action {
  return { value, type: ActionTypes.PAGE_NUMBER_CHANGE };
}

export function pageSizeChange(value: number): Action {
  return { value, type: ActionTypes.PAGE_SIZE_CHANGE };
}

export function dataSort(value: SortBy): Action {
  return { value, type: ActionTypes.DATA_SORT };
}

export function dataLoaded(value: Array<any>): Action {
  return { value, type: ActionTypes.DATA_LOADED };
}

export function dataReLoaded(totalRecords, value: Array<any>): Action {
  return { value: {totalRecords, page: value}, type: ActionTypes.DATA_RELOADED };
}

function dataRequest() {
  return { type: ActionTypes.DATA_FETCHING };
}

export function dataFetchIfNeed(dispatcher, url) {
  const {dataReducer, state, setState} = dispatcher;
  if (!state.fetching && state.invalidate) {
    setState((state) => dataReducer(state, dataRequest()));
    fetch(url, {credentials: 'include'})
    .then(response => response.json())
    .then(value => setState((state) => dataReducer(state, dataReLoaded(value.data.totalRecords, value.data.page))));
  }
}

// Probably a bad idea to send down `filters` here.
export function dataFilter(
  key: string,
  value: Value,
  filters: Filters
): Action {
  return { value: {key, value, filters}, type: ActionTypes.DATA_FILTER };
}
