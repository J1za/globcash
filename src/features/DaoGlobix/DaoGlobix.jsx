import React from 'react';
import './DaoGlobix.scss';

const DaoGlobix = () => {
  const cardList = [
    {title: 'Internet', desc: 'Blockchain based internet become'},
    {title: 'IDO', desc: 'The crowdsale through a decentralized exchange'},
    {title: 'NFT', desc: 'Uniqueness and indivisible'},
    {title: 'МЕТА', desc: 'Virtual spaces are already around you'}
  ];

  return (
    <main className='dao-globix'>
      <h1 className='dao-globix__title'>
        Become a member of the most progressive projects with the <span>DAO Globix</span>
      </h1>
      <p className='dao-globix__subtitle'>Start in May-June 2022</p>
      <div className='dao-globix__inner'>
        {cardList.map(({title, desc}, index) => (
          <div key={index} className='dao-globix-card'>
            <h2 className='dao-globix-card__title'>{title}</h2>
            <p className='dao-globix-card__desc'>{desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default DaoGlobix;
