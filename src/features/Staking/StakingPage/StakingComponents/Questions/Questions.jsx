import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AccordionMUI from '../../../../../shared/AccordionMUI';
import { ReactComponent as ArrowDropDownIcon } from '../../../../../assets/images/plus_icon.svg';

import './Questions.scss';

import { getFAQ } from '../../StakingPageActions';
import { getWalletFAQ } from '../../../../Dashboard/DashboardComponents/Wallet/walletActions';




const Questions = ({ isInnerStakingPage, isWalletsPage }) => {
  const dispatch = useDispatch();
  const { stakingPage: { FAQ }, wallets: { faq, activeWallet } } = useSelector(({ stakingPage, wallets }) => ({ stakingPage, wallets }));


  useEffect(() => {
    if (isWalletsPage) {
      activeWallet && dispatch(getWalletFAQ(activeWallet))
    } else {
      dispatch(getFAQ(isInnerStakingPage));
    }
  }, [activeWallet])

  return (
    <section className='card-wrap questions_block'>
      <div className="questions_block__title">Have a questions?</div>
      <div className="questions_block__descriptions">If you can't find the answer to your question in our FAQ, you can always contact us. We will reply to you as soon as possible!</div>
      <AccordionMUI accordionData={FAQ} accordingDataWalltet={isWalletsPage && faq} color='none' expandIcon={<ArrowDropDownIcon />} />
    </section>
  );
};

export default Questions;
