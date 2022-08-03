let BASE_URL, SECOND_URL, BINANCE_URL, KRAKEN_URL, BOT_NAME, BUILD_TYPE, WS_URL;

BASE_URL = process.env.REACT_APP_API_URL;
SECOND_URL = process.env.REACT_APP_API_SECOND_URL;
WS_URL = process.env.REACT_APP_OWLAB_WS;
BINANCE_URL = process.env.REACT_APP_API_BINANCE_URL;
KRAKEN_URL = process.env.REACT_APP_API_KRAKEN_URL;
BOT_NAME = process.env.REACT_APP_BOT_NAME;
BUILD_TYPE = process.env.REACT_APP_BUILD_TYPE;

export const TG_BOT_NAME = BOT_NAME;
export const API_BASE_URL = BASE_URL;
export const API_SECOND_URL = SECOND_URL;
export const API_WS_URL = WS_URL;
export const API_BINANCE_URL = BINANCE_URL;
export const API_KRAKEN_URL = KRAKEN_URL;
export const API_BUILD_TYPE = BUILD_TYPE;