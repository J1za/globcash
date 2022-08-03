import {APP} from './appActionTypes';

export function closeErrorSnack() {
  return {
    type: APP.ERROR_SNACK_CLOSE,
  };
}
