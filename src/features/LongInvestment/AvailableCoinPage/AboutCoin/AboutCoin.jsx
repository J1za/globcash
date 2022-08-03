import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import useWindowDimensions from '../../../../helpers/useWindowDimensions';

import './AboutCoin.scss';
import {ReactComponent as CloseIcon} from '../../../../assets/images/arrow_text_close.svg';
import {ReactComponent as OpenIcon} from '../../../../assets/images/arrow_text_open.svg';
import {ReactComponent as FilesIcon} from '../../../../assets/images/files_text.svg';
import {ReactComponent as ChartIcon} from '../../../../assets/images/chart_text.svg';

const AboutCoin = ({headInfo}) => {
  const {width} = useWindowDimensions();

  const [openText, setOpenText] = useState(false);

  const OpenText = () => {
    setOpenText(true);
  };
  const CloseText = () => {
    setOpenText(false);
  };

  return headInfo && headInfo.info && headInfo.info.description ? (
    <div className='about_coin_block'>
      <h2>About {headInfo.name}</h2>
      <div
        className={headInfo.info.description.length < 900 || openText ? 'text open' : 'text'}
        dangerouslySetInnerHTML={{__html: headInfo && headInfo.info && headInfo.info.description}}
      />
      {/* <div className="descriptions mb-20">About Ethereum</div>
        <p className='mb-16'>Ethereum is a decentralized computing platform that uses ETH (also called Ether) to pay transaction fees (or “gas”). Developers can use Ethereum to run decentralized applications (dApps) and issue new crypto assets, known as Ethereum tokens.</p>
        <div className='add'>
          <a href=""><FilesIcon className='mr-6'/> Whitepaper</a>
          <a href=""><FilesIcon className='mr-6'/>Roadmap</a>
          <a href="">Chat <ChartIcon className='ml-6'/></a>
        </div>
        <div className="descriptions mb-20">What Is Ethereum (ETH)?</div>
        <p className='mb-32'>Ethereum is the second-biggest cryptocurrency by market cap after Bitcoin. It is also a decentralized computing platform that can run a wide variety of applications — including a universe of decentralized finance (or DeFi) apps and services. Everything from financial tools and games to complex databases are already running on the Ethereum blockchain. And its future potential is only limited by developers’ imaginations. As the nonprofit Ethereum Foundation puts it: “Ethereum is for more than payments. It's a marketplace of financial services, games and apps that can't steal your data or censor you.”</p>
        <div className="descriptions mb-20">Who Are the Founders of Ethereum?</div>
        <p className='mb-16'>Ethereum has a total of eight co-founders — an unusually large number for a crypto project. They first met on June 7, 2014, in Zug, Switzerland.</p>
        <ul>
          <li className='mb-8'><span className='medium'>Russian-Canadian</span> <a href="">Vitalik Buterin</a> is perhaps the best known of the bunch. He authored the original white paper that first described Ethereum in 2013 and still works on improving the platform to this day. Prior to ETH, Buterin co-founded and wrote for the Bitcoin Magazine news website.</li>
          <li className='mb-16'><span className="medium">British programmer</span> Gavin Wood is arguably the second most important co-founder of ETH, as he coded the first technical implementation of Ethereum in the C++ programming language, proposed Ethereum’s native programming language Solidity and was the first chief technology officer of the Ethereum Foundation. Before Ethereum, Wood was a research scientist at Microsoft. Afterward, he moved on to establish the Web3 Foundation.
          </li>
        </ul>
        <p className='mb-24'>Among the other co-founders of Ethereum are: - Anthony Di Iorio, who underwrote the project during its early stage of development. - Charles Hoskinson, who played the principal role in establishing the Swiss-based Ethereum Foundation and its legal framework. - Mihai Alisie, who provided assistance in establishing the Ethereum Foundation. - Joseph Lubin, a Canadian entrepreneur, who, like Di Iorio, has helped fund Ethereum during its early days, and later founded an incubator for startups based on ETH called ConsenSys. - Amir Chetrit, who helped co-found Ethereum but stepped away from it early into the development.</p>
        <div className="descriptions mb-20">Who Are the Founders of Ethereum?</div>
        <p className='mb-16'>Ethereum has pioneered the concept of a blockchain smart contract platform. Smart contracts are computer programs that automatically execute the actions necessary to fulfill an agreement between several parties on the internet. They were designed to reduce the need for trusted intermediates between contractors, thus reducing transaction costs while also increasing transaction reliability.</p>
        <p className='mb-16'>Ethereum’s principal innovation was designing a platform that allowed it to execute smart contracts using the blockchain, which further reinforces the already existing benefits of smart contract technology. Ethereum’s blockchain was designed, according to co-founder Gavin Wood, as a sort of “one computer for the entire planet,” theoretically able to make any program more robust, censorship-resistant and less prone to fraud by running it on a globally distributed network of public nodes.</p>
        <p className='mb-32'>
          In addition to smart contracts, Ethereum’s blockchain is able
          to host other cryptocurrencies, called “tokens,” through the use of its
          ERC-20 compatibility standard. In fact, this has been the most common use for the
          ETH platform so far: to date, more than 280,000 ERC-20-compliant tokens
          have been launched. Over 40 of these make the top-100 cryptocurrencies by
          market capitalization, for example, <a href="">USDT</a>, <a href="">LINK</a> and <a href="">BNB</a>. Since the emergence of <a
          href="">Play2Earn</a> games, there has been a substantial increase in interest in the <a
          href="">ETH to PHP price</a>.
        </p>
        <div className="descriptions mb-20">Ethereum London Hard Fork</div>
        <p className='mb-12'>The Ethereum network has been plagued with high transaction fees, often buckling at seasons of high demand. In May 2021, the average transaction fee of the network peaked at $71.72.</p>
        <p className='mb-12'>In addition to the high cost of transactions, the leading altcoin also suffers from scalability issues.</p>
        <p className='mb-12'>As already mentioned, there are plans to transition to a proof-of-stake algorithm in order to boost the platform’s scalability and add a number of new features. The development team has already begun the transition process to ETH 2.0, implementing some upgrades along the way, including the London hard fork.</p>
        <p className='mb-12'>The London upgrade went live in August 2021. It included five Ethereum Improvement Proposals (EIPs), namely EIP-3529, EIP-3198, EIP-3541, and most notably EIP-1559 and EIP-3554.</p>
        <p>EIP-1559 is arguably the most popular upgrade out of all the EIPs.</p>
      </div> */}
      {headInfo.info.description.length > 899 ? (
        !openText ? (
          <button onClick={OpenText}>
            Read more <OpenIcon />
          </button>
        ) : (
          <button className='mt-16' onClick={CloseText}>
            Read less <CloseIcon />
          </button>
        )
      ) : null}
    </div>
  ) : width > 1399 ? (
    <div className='about_coin_block'></div>
  ) : null;
};

export default AboutCoin;
