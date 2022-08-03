import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {sendPromocode} from '../settingsActions';
import './Promo.scss';
import ButtonMUI from '../../../shared/ButtonMUI';
import InputMUI from '../../../shared/InputMUI';
import DialogMUI from '../../../shared/DialogMUI';
import {toast} from 'react-toastify';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {notifySuccess} from '../../../helpers/notifySnack';
import {ReactComponent as SuccessIMG} from '../../../assets/images/congratsIMG.svg';
import {ReactComponent as Smile} from '../../../assets/images/smile.svg';

function Promo() {
  const [buttonLoad, setButtonLoad] = useState(false);
  const [openPromo, setOpenPromo] = useState(false);
  const [popupType, setPopupType] = useState(true);
  const [sendData, setSendData] = useState({code: null});
  const dispatch = useDispatch();
  const closeDialogPromo = () => {
    setOpenPromo(false);
  };

  const schema = yup.object({
    promocode: yup.string().required('Field is required')
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: {errors, isValid},
    setValue
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      promocode: ''
    }
  });

  const onSubmit = (data) => {
    setButtonLoad(true);

    dispatch(sendPromocode(sendData))
      .then((res) => {
        setOpenPromo(true);
        if (res.payload && res.payload.status && res.payload.status === 200) {
          setPopupType(true);
          reset();
        } else {
          setPopupType(false);
          reset();
          // Object.values(res.error.response.data)
          //   .flat()
          //   .forEach((el) => toast.error(el, {}));
        }
      })
      .then(() => {
        setButtonLoad(false);
      });
  };

  const close = () => {
    closeDialogPromo();
    setTimeout(() => {
      setPromoField(null);
      reset();
      setModalStatus('Promo');
    }, 500);
  };

  return (
    <div className='promo_block card-wrap'>
      <form onSubmit={handleSubmit(onSubmit)} className='promo_block--form'>
        <h2 className='promo_block--title'>Have a promo code?</h2>
        <p className='promo_block--txt'>Expand the possibilities of your account</p>
        <div className='promo_block--row'>
          <Controller
            name='promocode'
            control={control}
            render={({field}) => (
              <>
                <InputMUI
                  className='promo_block--input'
                  type='text'
                  placeholder={'Enter the code'}
                  onChange={(e) => setSendData({code: e.target.value})}
                  fullWidth
                  error={errors.last_name?.message}
                  inputProps={field}
                />
              </>
            )}
          />
          <div className='btn promo_block--btn'>
            <ButtonMUI loading={buttonLoad} disabled={!isValid} formAction>
              Apply
            </ButtonMUI>
          </div>
        </div>
      </form>
      <DialogMUI open={openPromo} onClose={close}>
        <div className='promo_popup'>
          {popupType && <SuccessIMG />}
          <div className={popupType ? 'promo_popup--title' : 'promo_popup--title left'}>
            {popupType ? (
              'Сongratulations!'
            ) : (
              <>
                Wrong code
                <Smile />
              </>
            )}
          </div>
          <p className={popupType ? 'promo_popup--txt' : 'promo_popup--txt left'}>
            {popupType ? (
              'You will be able to withdraw funds from any active staking now.'
            ) : (
              <>Sorry, you have entered the wrong code. Check the data and re-enter.</>
            )}
          </p>

          {!popupType && <ButtonMUI onClick={() => closeDialogPromo()}>OK</ButtonMUI>}
        </div>
      </DialogMUI>
    </div>
  );
}

export default Promo;
