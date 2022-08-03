import { ReactComponent as StakingBlockIcon } from '../../../../../assets/images/st_big.svg';
import { ReactComponent as TradeBlockIcon } from '../../../../../assets/images/trade_big.svg';
import { ReactComponent as UniswapIcon } from '../../../../../assets/images/uniswap.svg';
import { ReactComponent as PumpIcon } from '../../../../../assets/images/Pump.svg';

export const getStakeIco = type => {
    switch (type) {
        case 'stake':
            return <StakingBlockIcon />
        case 'trade':
            return <TradeBlockIcon />
        case 'swap':
            return <UniswapIcon />
        case 'pump':
            return <PumpIcon />
    }
}