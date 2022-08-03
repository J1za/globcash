import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { currencies } from './currencyNaming';
import { GlobixFixed } from './functions';

export const ConvertBalance = ({ selectedConvert }) => {
    const { wallets, prices, binance_prices, glbx_coin } = useSelector(({ wallets, header }) => ({ wallets: wallets.wallets, prices: header.prices, binance_prices: header.binance_prices, glbx_coin: header.glbx_coin }))
    const allToUsdt = Object.keys(wallets).reduce((tempSum, el) => (tempSum + (wallets[el].short_name === 'USDT'
        ? Number(wallets[el].balance)
        : Number(Convert({ name: wallets[el].short_name, sum: Number(wallets[el].balance), to: 'USDT' }).replace(/\s/g, '')))
    ), 0);
    let usdtToSelected = null;

    if (selectedConvert === 'USDT') return GlobixFixed(allToUsdt, currencies[Object.keys(currencies).find(el => currencies[el].shortName === selectedConvert)].fixed)
    if (selectedConvert === 'GLBX') {
        usdtToSelected = allToUsdt * Number(glbx_coin.price);
        return GlobixFixed(usdtToSelected, currencies[Object.keys(currencies).find(el => currencies[el].shortName === selectedConvert)].fixed)
    }

    if (binance_prices.some(el => el.symbol === `${selectedConvert}USDT`)) {
        usdtToSelected = allToUsdt / Number(binance_prices.find(el => el.symbol === `${selectedConvert}USDT`).price);
    } else if (binance_prices.some(el => el.symbol === `USDT${selectedConvert}`)) {
        usdtToSelected = allToUsdt * Number(binance_prices.find(el => el.symbol === `USDT${selectedConvert}`).price);
    }
    return GlobixFixed(usdtToSelected, currencies[Object.keys(currencies).find(el => currencies[el].shortName === selectedConvert)].fixed)
};

const Convert = ({ name, sum, to }) => {
    const { prices, binance_prices } = useSelector(({ header }) => (header));
    if (prices.length < 1) return null;
    const isPlus = typeof sum === 'string' && sum.includes('+') ? '+' : ''
    const targetPrice = prices.some(el => el.symbol === name) ? prices.find(el => el.symbol === name).price : binance_prices.find(el => el.symbol.includes(name)).price;
    const sumToUstd = sum * targetPrice;

    if (to === 'USDT' || name === 'USDT') return GlobixFixed((isPlus + sumToUstd), 2)

    const sumToUsd = sumToUstd * prices.find(el => el.symbol === 'USDT').price;

    if (to === 'USD') return GlobixFixed((isPlus + sumToUsd), 2)

    return null
};

export default Convert;
