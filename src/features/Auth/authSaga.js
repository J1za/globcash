import {takeEvery} from 'redux-saga/effects';
import {disableButtonLoader, disableLoader, enableButtonLoader, enableLoader, openErrorSnack} from '../../app/rootSaga';

export function* handleProfileSnacks() {
  yield takeEvery('USER_INFO_FAIL', openErrorSnack);
  yield takeEvery('SIGN_IN_FAIL', () => openErrorSnack());
}

export function* handleAuthLoaders() {
  yield takeEvery('SIGN_IN', enableButtonLoader);
  yield takeEvery('SIGN_IN_SUCCESS', disableButtonLoader);
  yield takeEvery('SIGN_IN_FAIL', disableButtonLoader);

  yield takeEvery('Verification', enableLoader);
  yield takeEvery('Verification_SUCCESS', disableLoader);
  yield takeEvery('Verification_FAIL', disableLoader);

}
