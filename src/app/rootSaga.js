import {put, takeEvery, all} from 'redux-saga/effects';
import {handleProfileSnacks, handleAuthLoaders} from '../features/Auth/authSaga';

export default function* rootSaga() {
  yield all([handleAuthLoaders(), handleSnack(), handleProfileSnacks()]);
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export function* openErrorSnack(e) {
  yield put({
    type: 'ERROR_SNACK_OPEN',
    payload:
      e && e.error && e.error.response.data === null
        ? e.error.response.statusText
        : e && e.error && e.error.response && e.error.response.data
        ? e.error.response.data.detail
        : 'Something went wrong',
  });
}

export function* openSuccessSnack(e) {
  yield put({type: 'SUCCESS_SNACK_OPEN', payload: e});
}

export function* resetErrorSnack() {
  yield delay(100);
  yield put({type: 'ERROR_SNACK_CLOSE'});
}

export function* resetSuccessSnack() {
  yield delay(100);
  yield put({type: 'SUCCESS_SNACK_CLOSE'});
}

export function* handleSnack() {
  yield takeEvery('ERROR_SNACK_OPEN', resetErrorSnack);
  yield takeEvery('SUCCESS_SNACK_OPEN', resetSuccessSnack);
}

export function* enableLoader() {
  yield put({type: 'LOADING', payload: true});
}

export function* disableLoader() {
  yield put({type: 'LOADING', payload: false});
}

export function* enableButtonLoader() {
  yield put({type: 'BUTTON_LOADING', payload: true});
}

export function* disableButtonLoader() {
  yield put({type: 'BUTTON_LOADING', payload: false});
}
