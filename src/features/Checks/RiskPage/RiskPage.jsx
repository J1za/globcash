import React from 'react';
import {ReactComponent as RiskSources} from '../../../assets/images/risk_sources.svg';

import './RiskPage.scss';
import {Link} from 'react-router-dom';
import back_arrow from '../../../assets/images/back_arrow.svg';

const RiskPage = () => {
  return (
    <div className='risk_page'>
      <Link to={`/main/checks`} aria-label='Back'>
        <img src={back_arrow} alt='back_arrow' />
        Back
      </Link>
      <div className="risk_content">
        <div className="title">How to read the risk analysis metrics</div>
        <div className="info">
          <p>Risk Score is a metric that helps to estimate the chance that an address is related to illegal activity.</p>
          <p>The valuecan range from 0% to 100%, where 0% means that the address is safe, and 100% means that the address is involved in illegal activity. If the address belongs to an entity, its risk score is the same as the entity’s risk score.</p>
          <p>This report should be read in full because any separate analysis of each of its parts can lead to erroneous conclusions.</p>
          <span>The Risk Score is not applicable in several cases:</span>
          <ul>
            <li>Risk Score has not been calculated yet. It happens in cases when the address is new (it has transactions only in the mempool or in a recently mined block).In such cases, Risk Score will be calculated soon.</li>
            <li>The address is too far from known entities. If the chain of transactions to any known entity is longer than 150, the entity will not influence the Risk Score. So if there are no known entities closer than 150 transactions away, the Risk Score will be n/a.c. </li>
          </ul>
          <p>Tincidunt dui ut ornare lectus sit amet est. Morbi enim nunc faucibus a pellentesque sit. Aliquet bibendum enim facilisis gravida neque convallis a cras semper. Morbi enim nunc faucibus a pellentesque sit amet porttitor.</p>
          <p>Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. Semper feugiat nibh sed pulvinar. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan tortor. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla.</p>
        </div>
        <div className="descriptions">We help identifies 21 Money Laundering (ML) Risk Sources</div>
        <div className="name">
          <span style={{background: '#C22A25'}}/>
          <p>ML risk 100%:</p>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span>Darknet Service</span>– an organization that operates via darknets and offers illegal services for cryptocurrency. The subtypes are Child Abuse, Terrorist Financing, Drug Dealer.</div>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span> Darknet Marketplace</span>– an online marketplace which operates via darknets and is used for trading illegal products for cryptocurrency.</div>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span>Illegal Service</span>– a resource offering illegal services or engaged in illegal activities.</div>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span>Stolen Coins</span>– the entities which have taken possession of someone else’s cryptocurrency by hacking.</div>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span>Ransom</span>– extortioners demanding payment in the form of cryptocurrency. The subtypes are Blackmail, Malware.</div>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span>Scam</span>– entities that have scammed their customers and taken possession of their cry ptocurrency.</div>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span>Mixing Service</span>– a service for mixing funds from different sources to make tracing them back harder or almost impossible. It is mostly used for money laundering.</div>
        </div>

        <div className="name">
          <span style={{background: '#D2281B'}}/>
          <p>ML risk 75%:</p>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span>Gambling</span>– an online resource offering gambling services using cryptocurrency.</div>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span>Fraudulent Exchange</span>– an exchange that was involved in illegal activity.</div>
        </div>

        <div className="name">
          <span style={{background: '#F36D00'}}/>
          <p>ML risk 50%:</p>
        </div>

        <div className="risk_sources">
          <RiskSources/>
          <div><span>Exchange With Very High ML Risk</span>– exchanges that don’t use verification procedures, or have requirements for certain countries only.</div>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span>ATM</span>– cryptocurrency ATM operator.</div>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span>Exchange With Very High ML Risk</span>– exchanges that don’t use verification procedures, or have requirements for certain countries only.</div>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span>Exchange With High ML Risk</span>– exchanges that allow the withdrawal of more than $2000 in crypto daily without KYC/AML. (They still require KYC/AML for fiat withdrawal).</div>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span> P2P Exchange With High ML Risk</span>– P2P exchanges that allow the withdrawal of more than $1000 in crypto daily without KYC/ AML.</div>
        </div>

        <div className="name">
          <span style={{background: '#FF8E00'}}/>
          <p>ML risk 25%:</p>
        </div>

        <div className="risk_sources">
          <RiskSources/>
          <div><span>Exchange With Moderate ML Risk</span>– exchanges that allow the withdrawal of up to $2000 in crypto daily without KYC/AML. (They still require KYC/AML for fiat withdrawal).</div>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span>P2P Exchange With Low ML Risk</span>– P2P exchanges that require KYC/ AML identification for all deposits and withdrawals.</div>
        </div>
        <div className="risk_sources">
          <RiskSources/>
          <div><span>Online Wallet</span>– a service for storage and making payments with cryptocurrency.</div>
        </div>

        <div className="name">
          <span style={{background: '#4A9727'}}/>
          <p>ML risk 25%:</p>
        </div>

        <div className="risk_sources">
          <RiskSources/>
          <div><span>Exchange With Low ML Risk</span>– exchanges that require KYC/AML identification for any deposit or withdrawal.</div>
        </div>

        <div className="risk_sources">
          <RiskSources/>
          <div><span>Payment Processor</span>– a service which acts as an intermediary between customers and the company which provides services for making a payment.</div>
        </div>

        <div className="risk_sources">
          <RiskSources/>
          <div><span>Online Marketplace</span>– an entity offering legal trading services for cryptocurrency.</div>
        </div>

        <div className="risk_sources">
          <RiskSources/>
          <div><span>Miner</span>– an organization which utilizes its computing power for mining cryptocurrency blocks.</div>
        </div>

        <div className="name">
          <span style={{background: '#E1E1E1'}}/>
          <p>No ML risk:</p>
        </div>

        <div className="risk_sources">
          <RiskSources/>
          <div><span>Other</span>– none of the specified types. The subtypes might be Faucet, ICO, etc.</div>
        </div>
      </div>
    </div>
  );
};

export default RiskPage;
