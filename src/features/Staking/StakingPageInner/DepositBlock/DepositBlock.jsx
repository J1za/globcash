import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';

import {GlobixFixed} from '../../../../helpers/functions';
import Convert from '../../../../helpers/Convert';
import ButtonMUI from '../../../../shared/ButtonMUI';
import DialogMUI from '../../../../shared/DialogMUI';
import SelectComponent from '../../../../shared/SelectComponent';
import StakingInvestDialog from '../../StakingPage/StakingComponents/StakingInvestDialog/StakingInvestDialog';
import {useToggle} from '../../../../helpers/hooks';
import {
  getDescriptions,
  getAllDescriptions,
  getStakingInfo,
  depositStakingInfo,
  getTransfer,
  depositStaking
} from '../../StakingPage/StakingPageActions';
import {getDashboardStaking} from '../../../Dashboard/DashboardComponents/Staking/stakingActions';
import {getUserStakes} from '../../StakingPage/StakingPageActions';
import {getWallets} from '../../../Dashboard/DashboardComponents/Wallet/walletActions';
import {endDateRender} from '../../StakingPage/StakingComponents/StakingBlock/StakingBlock';
import InputMUI from '../../../../shared/InputMUI';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {ReactComponent as ArrowRedIcon} from '../../../../assets/images/arrow_down_red.svg';
import {ReactComponent as ArrowGreenIcon} from '../../../../assets/images/arrow_top_green.svg';
import {ReactComponent as MoveIcon} from '../../../../assets/images/move.svg';
import {ReactComponent as VectorIcon} from '../../../../assets/images/chevron-down-new.svg';
import {ReactComponent as СongratulationsIcon} from '../../../../assets/images/move_cong.svg';
import {ReactComponent as WithdrawalArro} from '../../../../assets/images/withdrawal-arrow.svg';
import {toast} from 'react-toastify';
import './DepositBlock.scss';
import WithdrwalPopup from './WithdrwalPopup';

const DepositBlock = ({type}) => {
  const dispatch = useDispatch();
  const isStake = type === 'stake' || type === 'invglbx';
  const isInv = type.includes('inv');
  const currency = isInv ? type.split('inv')[1].toUpperCase() : 'USDT';

  const {
    stakingPage: {
      staking_desc,
      staking_desc_all,
      deposit_staking_info,
      transfer,
      stakeHistory,
      transLoad,
      stakingPercents,
      staking_info,
      userStakings
    },
    staking: {dashboardStaking}
  } = useSelector(({stakingPage, staking}) => ({stakingPage, staking}));

  const [buttonLoad, setLoad] = useState(false);
  const [btnLoad, toggleBtnLoad] = useToggle(false);
  const [dialogInvest, toggleDialogInvest] = useToggle();
  const [dialogWithdrawal, toggleDialogWithdrawal] = useState({
    status: false
  });
  const [selectedStaking, setSelectedStaking] = useState();
  const [selectedWallet, setSelectedWallet] = useState();

  const [selectedStakingInfo, setSelectedStakingInfo] = useState();
  const [amountField, setAmountField] = useState(null);
  const [clickedBTN, setClickedBTN] = useState(null);
  const [parameters, setParameters] = useState({
    code: null,
    name: null
  });

  const canShow = () => stakeHistory.hasOwnProperty(type);

  const investInit = async (popup, trigeredBtn) => {
    setClickedBTN(trigeredBtn);
    await toggleBtnLoad();

    await dispatch(getWallets()).then((getWalletResponse) => {
      if (getWalletResponse.payload && getWalletResponse.payload.status && getWalletResponse.payload.status === 200) {
        dispatch(getDescriptions(type)).then((getDescriptionsResponse) => {
          if (
            getDescriptionsResponse.payload &&
            getDescriptionsResponse.payload.status &&
            getDescriptionsResponse.payload.status === 200
          ) {
            setSelectedStaking(staking_info[type]);
            setSelectedStakingInfo(getDescriptionsResponse.payload.data);
            setSelectedWallet(getWalletResponse.payload.data[isInv ? currency.toLowerCase() : 'usdterc']);
            popup();
          }
          toggleBtnLoad();
        });
      }
    });
  };

  useEffect(() => {
    dispatch(getAllDescriptions());
    dispatch(getUserStakes());
  }, []);

  const [dialogDeposit, toggleDeposit] = useState({
    status: false,
    info: {
      name: null,
      image: null,
      daily: null
    }
  });

  const [dialogCongratulations, toggleDialogCongratulations] = useState({
    status: false
  });

  const [transferData, setTransferData] = useState(null);

  const schema = yup.object({
    amount: yup
      .number()
      .typeError('you must specify a number')
      .min(0, 'Should be a positive value')
      .required('Field is required')
      .test(true, `max ${deposit_staking_info.max} USDT`, () => {
        return amountField <= deposit_staking_info.max;
      })
      .test(true, `min ${deposit_staking_info.min} USDT`, () => {
        return amountField >= deposit_staking_info.min;
      })
  });

  useEffect(() => {
    if (staking_desc.type) dispatch(getTransfer(staking_desc && staking_desc.type));
  }, [staking_desc.type]);

  const {
    handleSubmit,
    setError,
    control,
    formState: {errors, isValid},
    setValue,
    getValues,
    reset
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      amount: ''
    }
  });

  const deposit = () => {
    dispatch(
      depositStaking(staking_desc && staking_desc.type, parameters.code, {
        amount: amountField
      })
    ).then((res) => {
      setLoad(false);
      closeDialogDeposit();
      setTransferData(res.payload);
      if (res.payload && res.payload.status && res.payload.status === 200) {
        toggleDialogCongratulations({status: true});

        dispatch(getTransfer(parameters.code));
        dispatch(getDashboardStaking());
      } else {
        Object.values(res.error.response.data)
          .flat()
          .forEach((el) => toast.error(el, {}));
      }
    });
  };

  const closeDialogDeposit = () => {
    toggleDeposit((prev) => ({...prev, status: false}));
  };

  const closeDialogCongratulations = () => {
    toggleDialogCongratulations((prev) => ({...prev, status: false}));
    setAmountField(null);
    reset();
    setParameters({...parameters, code: null, name: null});
  };

  const closeDialogWithdrawal = () => {
    toggleDialogWithdrawal((prev) => ({...prev, status: false}));

    reset();
  };

  const optionsPage = staking_desc_all
    .filter((el) => transfer.some((elem) => (elem === 'inv' ? el.type === 'stake' : elem === el.type)))
    .map((el, id) => ({
      value: el.type,
      label: (
        <div key={id} className='type_staking'>
          <img src={el.image} alt='' /> {el.name}
        </div>
      )
    }));

  const handleChange = (code, name) => {
    dispatch(depositStakingInfo(staking_desc && staking_desc.type, code, name));
    setParameters({...parameters, code: code, name: name});
  };

  return (
    <div className='deposit_block'>
      {transLoad ? (
        <></>
      ) : (
        <>
          <div className='deposit_move'>
            <div>
              <div className='title'>Deposit</div>
              <div className='descriptions'>
                {GlobixFixed(dashboardStaking[type].balance, 2)} {currency}
              </div>
              <div className='info'>
                <Convert name={currency} sum={dashboardStaking[type].balance} to={'USD'} /> $
              </div>
            </div>
            {transfer.length > 0 ? (
              <div className='right'>
                <button
                  className='move good-hover'
                  onClick={() =>
                    toggleDeposit({
                      status: true,
                      info: {
                        image: staking_desc.image,
                        name: staking_desc.name,
                        daily: stakingPercents
                      }
                    })
                  }
                >
                  <MoveIcon />
                </button>
                <span>
                  Move to <br /> another staking
                </span>
              </div>
            ) : null}
          </div>
          <div>
            <div className='title'>interest rate</div>
            <div className='descriptions blue'>
              {Number(dashboardStaking[type]?.balance) <= 0
                ? `${staking_desc.interest_rate}% Daily`
                : stakingPercents[type]?.percent > 0
                ? `${stakingPercents[type]?.percent}% Daily`
                : 'Float'}
            </div>
            <div className='info mb-6'>Earned yesterday</div>
            <span className={dashboardStaking[type].earned_yesterday >= 0 ? `green` : `red`}>
              {dashboardStaking[type].earned_yesterday >= 0 ? '+' : ''}
              {GlobixFixed(dashboardStaking[type].earned_yesterday, 2)} {currency}
            </span>
          </div>
          {isStake || isInv ? null : (
            <div>
              <div className='title'>
                {isStake ? 'Body' : 'PNL per week'}
                {/*{!isStake && (*/}
                {/*  <p>*/}
                {/*    <RefreshIcon /> {date_week}*/}
                {/*  </p>*/}
                {/*)}*/}
              </div>
              <div className='descriptions'>
                {canShow() &&
                  (isStake
                    ? GlobixFixed(stakeHistory[type].body, 2)
                    : GlobixFixed(dashboardStaking[type].pnl_per_week, 2))}{' '}
                {currency}
              </div>
              <div className='info mb-6'>
                {canShow() &&
                  (isStake ? (
                    <Convert name={currency} sum={stakeHistory[type].body} to={'USD'} />
                  ) : (
                    <Convert name={currency} sum={dashboardStaking[type].pnl_per_week} to={'USD'} />
                  ))}{' '}
                $
                {canShow() && dashboardStaking[type].pnl_per_week_percent !== null && (
                  <p className={dashboardStaking[type].pnl_per_week_percent >= 0 ? `green` : `red`}>
                    {dashboardStaking[type].pnl_per_week_percent >= 0 ? <ArrowGreenIcon /> : <ArrowRedIcon />}
                    {dashboardStaking[type] && dashboardStaking[type].pnl_per_week_percent
                      ? dashboardStaking[type].pnl_per_week_percent.toFixed(1)
                      : ''}
                    %
                  </p>
                )}
              </div>
            </div>
          )}
          <div>
            <div className='title'>
              {isStake || isInv ? 'Growth' : 'PNL per Month'}
              {/*{!isStake && (*/}
              {/*  <p>*/}
              {/*    <RefreshIcon /> {date_month}*/}
              {/*  </p>*/}
              {/*)}*/}
            </div>
            <div className='descriptions'>
              {canShow() &&
                (isStake || isInv
                  ? GlobixFixed(stakeHistory[type].growth, type === 'invbtc' || type === 'inveth' ? 8 : 2)
                  : GlobixFixed(dashboardStaking[type].pnl_per_month, 2))}{' '}
              {currency}
            </div>
            <div className='info mb-6'>
              {canShow() &&
                (isStake || isInv ? (
                  <Convert name={currency} sum={stakeHistory[type].growth} to={'USD'} />
                ) : (
                  <Convert name={currency} sum={dashboardStaking[type].pnl_per_month} to={'USD'} />
                ))}{' '}
              $
              {canShow() && !!dashboardStaking[type].pnl_per_month_percent && (
                <p className={dashboardStaking[type].pnl_per_month_percent >= 0 ? `green` : `red`}>
                  {dashboardStaking[type].pnl_per_month_percent >= 0 ? <ArrowGreenIcon /> : <ArrowRedIcon />}
                  {dashboardStaking[type] && dashboardStaking[type].pnl_per_month_percent
                    ? dashboardStaking[type].pnl_per_month_percent.toFixed(2)
                    : ''}
                  %
                </p>
              )}
            </div>
          </div>
        </>
      )}
      {Object.keys(staking_info).includes(type) && staking_info[type].status && (
        <div>
          {endDateRender(dashboardStaking[type] && dashboardStaking[type].close * 1000, true)}
          <ButtonMUI
            fullWidth
            onClick={() => {
              investInit(toggleDialogInvest, 'invest');
            }}
            loading={clickedBTN === 'invest' && btnLoad}
          >
            Invest
          </ButtonMUI>
          <ButtonMUI
            variant='outlined'
            fullWidth
            loading={clickedBTN === 'withdraw' && btnLoad}
            onClick={() => {
              investInit(toggleDialogWithdrawal({status: true}), 'withdraw');
              toggleBtnLoad();
            }}
          >
            <WithdrawalArro />
            Withdraw
          </ButtonMUI>
          <DialogMUI open={dialogInvest} onClose={toggleDialogInvest}>
            <StakingInvestDialog
              label={type}
              selectedStaking={selectedStaking}
              selectedWallet={selectedWallet}
              selectedStakingInfo={selectedStakingInfo}
            />
          </DialogMUI>
        </div>
      )}
      <DialogMUI open={dialogDeposit.status} onClose={() => closeDialogDeposit(true)}>
        <div className='deposit_move_dialog'>
          <div className='title'>Move funds to staking</div>
          <div className='brown'>From Staking:</div>
          <div className='staking_info'>
            <div className='left'>
              <div className='icon'>
                <img src={dialogDeposit.info.image} alt='' />
              </div>
              <div className='name'>{dialogDeposit.info.name}</div>
            </div>
            <div className='right'>
              {Number(dashboardStaking[type]?.balance) <= 0
                ? `${staking_desc.interest_rate}% Daily`
                : stakingPercents[type]?.percent > 0
                ? `${stakingPercents[type]?.percent}% Daily`
                : 'Float interest'}
            </div>
          </div>
          <div className='color_block'>Funds will be transferred within 20 days of your request.</div>
          <div className='descriptions'>Select the staking plan you want to transfer funds to:</div>

          <form onSubmit={handleSubmit(deposit)}>
            <div className='select_block'>
              <span>Staking</span>
              <SelectComponent
                options={optionsPage}
                onChange={(e) => handleChange(e.value, e.label)}
                value={parameters.code === null ? null : optionsPage.find((el) => el.value === parameters.code)}
                components={<VectorIcon />}
                placeholder='Select the currency'
              />
            </div>
            <div className='amount'>
              <div className='block'>
                <span>
                  <p>Amount</p>
                  <p>
                    Min:{deposit_staking_info.min ? deposit_staking_info.min : '0'} {currency} Max:
                    {deposit_staking_info.max ? deposit_staking_info.max : '0'} {currency}
                  </p>
                </span>
                <div>
                  <Controller
                    name='amount'
                    control={control}
                    render={({field}) => (
                      <InputMUI
                        className='auth-box__input'
                        type='text'
                        fullWidth
                        error={errors.amount?.message}
                        inputProps={field}
                        isFixed
                        stateSetter={setAmountField}
                        setValue={setValue}
                        //onChange={(e) => setAmountField(e.target.value)}
                      />
                    )}
                  />
                </div>
              </div>
              {amountField ? (
                <span className='commission'>
                  Comission: ~{GlobixFixed(amountField * (deposit_staking_info.commission / 100))}
                </span>
              ) : null}
            </div>
            <ButtonMUI fullWidth1 disabled={!isValid || buttonLoad} loading={buttonLoad} formAction>
              Move funds
            </ButtonMUI>
          </form>
        </div>
      </DialogMUI>

      <DialogMUI open={dialogCongratulations.status} onClose={closeDialogCongratulations}>
        <div className='dialog dialog_congratulations'>
          <div className='title'>Сongratulations</div>
          <div className='descriptions'>
            has been generated and will be processed shortly. Request for transfer{' '}
            <span>
              {transferData && transferData.data && transferData.data.result && transferData.data.result.amount_in}{' '}
              {currency}
            </span>{' '}
            from {dialogDeposit.info.name} staking to <div> {parameters ? parameters.name : ''}</div> has been
            generated.
          </div>
          <div className='color'>
            {transferData && transferData.data && transferData.data.result && transferData.data.result.amount_in}{' '}
            {currency}
          </div>
          <СongratulationsIcon />
        </div>
      </DialogMUI>
      <WithdrwalPopup
        open={dialogWithdrawal.status}
        onClose={closeDialogWithdrawal}
        selectedStakingInfo={selectedStakingInfo}
        selectedWallet={selectedWallet}
        label={type}
      ></WithdrwalPopup>
    </div>
  );
};

export default DepositBlock;
