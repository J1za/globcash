import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {yupResolver} from '@hookform/resolvers/yup';
import InputMUI from '../../../../shared/InputMUI';
import ButtonMUI from '../../../../shared/ButtonMUI';
import DialogMUI from '../../../../shared/DialogMUI';
import {setKycData, getKycData} from '../../../Settings/settingsActions';
import './VerificationDialog.scss';
import Upload from './upload';

const VerificationDialog = ({open, onClose}) => {
  const {
    header: {
      userInfo: {first_name, last_name, t_photo_url, avatar}
    },
    settings: {
      KYC: {telegram_id, username, passport_file, address_file, id_card_file, wealth_file}
    }
  } = useSelector(({header, settings}) => ({header, settings}));

  const dispatch = useDispatch();

  const [loading, setLoad] = useState(false);

  const [activeButton, setActiveButton] = useState(false);
  const [documents, setDocs] = useState({
    passport: {
      status: false,
      file: null,
      title: 'Certified copy of passport',
      description: null,
      touched: false
    },
    idCard: {
      status: false,
      file: null,
      title: 'Certified copy of ID card',
      description: null,
      touched: false
    },
    address: {
      status: false,
      file: null,
      title: 'Proof of address',
      description: 'one utility bill not older than 3 months',
      touched: false
    },
    wealth: {
      status: false,
      file: null,
      title: 'Proof of wealth',
      description: 'copy of financial information such as bank statement',
      touched: false
    }
  });

  const sendData = (info) => {
    const data = new FormData();
    documents.passport.file ? data.append('passport_file', documents.passport.file) : data.append('passport_file', '');
    documents.address.file ? data.append('address_file', documents.address.file) : data.append('address_file', '');
    documents.idCard.file ? data.append('id_card_file', documents.idCard.file) : data.append('id_card_file', '');
    documents.wealth.file ? data.append('wealth_file', documents.wealth.file) : data.append('wealth_file', '');
    data.append('telegram_id', info.id_number);
    data.append('username', info.name);
    dispatch(setKycData(data));
    setDocs({
      address: {...documents.address, touched: false},
      idCard: {...documents.idCard, touched: false},
      wealth: {...documents.wealth, touched: false},
      passport: {...documents.passport, touched: false}
    });
    onClose();
  };

  const handleFile = (doc, e) => {
    if (typeof e === 'object') {
      e.persist();
      let file = e.target.files[0];
      if (file) {
        const newUrl = URL.createObjectURL(file);
        setDocs({
          ...documents,
          [doc]: {
            ...documents[doc],
            status: true,
            touched: true,
            file
          }
        });
        setActiveButton(true);
      }
    } else {
      setDocs({
        ...documents,
        [doc]: {
          ...documents[doc],
          status: undefined,
          touched: true,
          file: null
        }
      });
      setActiveButton(false);
    }
  };

  const schema = yup.object({
    id_number: yup.number().min(8, 'Min 8 characters').required('Field is required'),
    name: yup.string().min(2, 'Min 2 characters').required('Required')
  });

  const {
    control,
    formState: {errors, isValid, isDirty},
    reset,
    handleSubmit,
    setValue
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      id_number: '',
      name: ''
    }
  });

  useEffect(() => {
    reset();
    dispatch(getKycData());
    console.log(documents);
    setDocs({
      ...documents,
      address: {...documents.address, status: address_file},
      idCard: {...documents.idCard, status: id_card_file},
      wealth: {...documents.wealth, status: wealth_file},
      passport: {...documents.passport, status: passport_file}
    });
    setValue('name', username ? username : '');
    setValue('id_number', telegram_id ? telegram_id : '');
  }, [open]);

  const onDeleteFormFiles = () => (
    setDocs({
      address: {...documents.address, status: false, file: false, touched: true},
      idCard: {...documents.idCard, status: false, file: false, touched: true},
      wealth: {...documents.wealth, status: false, file: false, touched: true},
      passport: {...documents.passport, status: false, file: false, touched: true}
    }),
    setActiveButton(false)
  );

  return (
    <DialogMUI open={open} onClose={onClose}>
      <form className='dialog_verification' onSubmit={handleSubmit(sendData)}>
        <div className='title'>KYC verification</div>
        <div className='descriptions'>
          To proceed with the verification process, please provide the following documentation and info:
        </div>
        <div>
          <div className='block'>
            <span>Your Globix.cash ID number</span>
            <Controller
              name='id_number'
              control={control}
              render={({field}) => (
                <InputMUI
                  className=''
                  type='text'
                  onChange={() => setActiveButton(true)}
                  fullWidth
                  error={errors.id_number?.message}
                  inputProps={field}
                />
              )}
            />
            <p>*this is displayed when pushing the Settings button</p>
          </div>
          <div className='block'>
            <span>Full name and surname(s)</span>
            <Controller
              name='name'
              control={control}
              render={({field}) => (
                <InputMUI
                  className=''
                  type='text'
                  onChange={() => setActiveButton(true)}
                  fullWidth
                  error={errors.name?.message}
                  inputProps={field}
                />
              )}
            />
          </div>
          <div className='download_title'>
            Attachments <span> (should be PDF)</span>
          </div>
          {Object.keys(documents).map((el, idx) => (
            <Upload
              key={idx}
              idx={idx}
              getter={documents}
              name={el}
              setter={handleFile}
              title={documents[el].title}
              description={documents[el].description}
              link={documents[el].status}
            />
          ))}

          <div className='wrapper_edit'>
            <ButtonMUI color='secondary' onClick={onDeleteFormFiles}>
              Delete
            </ButtonMUI>

            <ButtonMUI
              loading={loading}
              formAction
              disabled={
                !documents.passport.touched &&
                !documents.idCard.touched &&
                !documents.wealth.touched &&
                !documents.address.touched &&
                !isDirty
              }
            >
              Save
            </ButtonMUI>
          </div>
        </div>
      </form>
    </DialogMUI>
  );
};

export default VerificationDialog;
