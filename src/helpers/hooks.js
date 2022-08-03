import {useCallback, useState} from 'react';
import {useLocation} from 'react-router-dom';

export const useQueryParams = () => new URLSearchParams(useLocation().search);

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((state) => !state), []);
  return [state, toggle];
};
