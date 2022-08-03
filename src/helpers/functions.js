import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';

export const joinQueries = (arr) => `${arr.length && arr.length !== 0 ? '?' : ''}${arr.join('&')}`;

export function getOption(label) {
  return (
    <div className={`status ${label}`}>
      <div>
        {label !== 'All networks' && <span />}
        {label}
      </div>
    </div>
  );
}

export const validateImage = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
  return validTypes.indexOf(file.type) !== -1;
};

export function splitByCommas(data) {
  return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Scroll Restoration
export function ScrollToTop() {
  const {pathname} = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Convert string to slug
export function stringToSlug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  let from = 'åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;';
  let to = 'aaaaaaeeeeiiiioooouuuunc------';

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-+/, '') // trim - from start of text
    .replace(/-+$/, ''); // trim - from end of text

  return str;
}

export function toColor(number, alphaChannel) {
  if (number.toLowerCase() === 'usdt') {
    return `#fa8a1a`;
  } else if (number.toLowerCase() === 'btc') {
    return `#6673ff`;
  } else if (number.toLowerCase() === 'binance') {
    return `rgba(1, 102, 255, 0.8)`;
  } else if (number.toLowerCase() === 'poloenix') {
    return `rgba(255, 148, 114, 0.8)`;
  } else if (number.toLowerCase() === 'bitfinex') {
    return `rgba(172, 87, 81, 0.8)`;
  } else if (number.toLowerCase() === 'kraken') {
    return `rgba(255, 77, 152, 0.8)`;
  } else if (number.toLowerCase() === 'bitstamp') {
    return `rgba(177, 98, 205, 0.8)`;
  } else if (number.toLowerCase() === 'coinbase') {
    return `rgba(97, 113, 136, 0.8)`;
  } else {
    var hash = '';
    for (var i = 0; i < number.length; i++) {
      hash += number.charCodeAt(i).toString();
    }
    let num = (Number(hash.split('').splice(0, 7).join('')) + Number(hash.split('').splice(7, 100).join('')))
      .toString()
      .split('')
      .splice(0, 7)
      .join('');
    num >>>= 0;
    var b = num & 0xff,
      g = (num & 0xff00) >>> 8,
      r = (num & 0xff0000) >>> 16,
      a = ((num & 0xff000000) >>> 24) / 255;

    return `rgb${alphaChannel ? 'a' : ''}(${alphaChannel ? [r, g, b, a].join(',') : [r, g, b].join(',')})`;
  }
}

export const GlobixFixed = (num, fix = 2) => {
  let origin = Number(num),
    finalNum = origin.toString();
  if (origin === 0) {
    finalNum = '0.00';
  } else if (origin > -1 && origin < 1) {
    finalNum = origin.toFixed(
      finalNum.split('.')[1] ? (finalNum.split('.')[1].length > 8 ? 8 : finalNum.split('.')[1].length) : 2
    );
  } else {
    let tempArr = origin.toFixed(fix).split('.');
    tempArr[0] = Number(tempArr[0]).toLocaleString('ru');
    if (tempArr[1]) {
      tempArr[1] = tempArr[1].slice(0, fix);
    } else {
      delete tempArr[1];
    }

    finalNum = tempArr.join('.');
  }
  return finalNum;
};

export const replaceComas = (value) =>
  value
    .replace(',', '.')
    .replace(/[^\d\.]/g, '')
    .replace(/\./, 'x')
    .replace(/\./g, '')
    .replace(/x/, '.');

export function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const chartRangeHelper = (array, isArrayReturned, isIntervalReturned) => {
  if (array.length > 0) {
    const startArray = [...array];
    let point = Array.isArray(startArray[0]) ? '4' : 'y',
      sortedArray = startArray.sort(function (a, b) {
        return Number(a[point]) - Number(b[point]);
      }),
      minPoint = Number(sortedArray[0][point]),
      maxPoint = Number(sortedArray[sortedArray.length - 1][point]),
      halfRange = (maxPoint - minPoint) / 5,
      returnedObject = {
        min: !isIntervalReturned ? minPoint : minPoint >= 0 && minPoint <= 100 ? 0 : minPoint - halfRange,
        max: !isIntervalReturned ? maxPoint : maxPoint + halfRange
      };

    if (isIntervalReturned) returnedObject.tickInterval = Number(halfRange.toFixed(halfRange > 10 ? 0 : 2));
    if (isArrayReturned) returnedObject.sortedArray = sortedArray;

    return returnedObject;
  } else {
    return {};
  }
};

export const ToListStart = ({counter, element, breakpoint = 768, position = 'start'}) => {
  const [isFirst, setIsFirst] = useState(true);
  useEffect(() => {
    if (isFirst) {
      setIsFirst(false);
    } else {
      if (breakpoint === null || window.innerWidth <= breakpoint) {
        document.querySelector(element).scrollIntoView({block: position, behavior: 'smooth'});
      }
    }
  }, [counter]);
  return null;
};
