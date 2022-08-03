export const rootAuthPath = '/auth';
export const rootMainPath = '/main';

export const authPath = {
  signIn: `${rootAuthPath}/sign-in`,
  signUp: `${rootAuthPath}/sign-up`,
  forgotPassword: `${rootAuthPath}/forgot-password`,
  resetPassword: `${rootAuthPath}/reset-password`,
  confirmation: `${rootAuthPath}/confirmation`
};

export const mainPath = {
  dashboard: `${rootMainPath}/dashboard`,
  wallets: `${rootMainPath}/wallets`,
  staking: `${rootMainPath}/staking`,
  stakingInner: `${rootMainPath}/staking/:type`,
  reports: `${rootMainPath}/staking/reports`,
  reportsInner: `${rootMainPath}/staking/reports/:id`,
  longInvestment: `${rootMainPath}/long-investment`,
  longInvestmentForecasts: `${rootMainPath}/long-investment/forecasts`,
  longInvestmentInner: `${rootMainPath}/long-investment/inner/:id`,
  longInvestmentCoin: `${rootMainPath}/long-investment/coin/:id`,
  availableCoin: `${rootMainPath}/long-investment/available-coin/:id`,
  tickets: `${rootMainPath}/tickets`,
  notifications: `${rootMainPath}/notifications`,
  settings: `${rootMainPath}/settings`,
  daoGlobix: `${rootMainPath}/dao-globix`,
  advertising: `${rootMainPath}/dashboard/news/:id`,
  serverDown: `${rootMainPath}/server-down`,
  checks: `${rootMainPath}/checks`,
  news: `${rootMainPath}/dashboard/news`,
  risk: `${rootMainPath}/checks/risk`,
  navLink: `${rootMainPath}/nav-link`,
  navLink2: `${rootMainPath}/nav-link-2`,
  navLink3: `${rootMainPath}/nav-link-3`
};