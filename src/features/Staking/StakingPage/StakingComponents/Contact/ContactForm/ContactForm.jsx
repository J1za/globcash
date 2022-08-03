import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DialogMUI from '../../../../../../shared/DialogMUI';
import ButtonMUI from '../../../../../../shared/ButtonMUI';
import InputMUI from '../../../../../../shared/InputMUI';
import './ContactForm.scss';
import { sendContactForm } from '../../../StakingPageActions';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactForm = ({ dialog, toggleDialog }) => {
    const dispatch = useDispatch();
    const [btnLoad, setLoad] = useState(false);
    const onSubmit = data => {
        setLoad(true);
        dispatch(sendContactForm(data))
            .then(res => {
                if (res.payload && res.payload.status && res.payload.status === 200) {
                    toggleDialog();
                } else {
                    Object.values(res.error.response.data)
                        .flat()
                        .forEach(el =>
                            toast.error(el, {})
                        );
                }
            })
            .then(() => {
            console.log('finish')
                setLoad(false)
            });
    };
    const schema = yup.object({
        email: yup.string().email('Invalid email').required('Field is required'),
        message: yup.string().min(5, 'Min 5 characters').max(500, 'Max 500 characters')
    });
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        reset();
    }, [dialog])

    return (
        <DialogMUI open={dialog} onClose={toggleDialog}>
            <form className='contact-modal' onSubmit={handleSubmit(onSubmit)}>
                <h2>Contact us</h2>
                <p className="desc">Describe your question. Our managers will contact you shortly.</p>
                <div className='block'>
                    <span>Email</span>
                    <Controller
                        name='email'
                        control={control}
                        render={({ field }) => (<>
                            <InputMUI
                                className='auth-box__input'
                                type='text'
                                fullWidth
                                error={errors.email?.message}
                                inputProps={field}
                            //onChange={e => {}}
                            />
                        </>)}
                    />
                </div>
                <div className='block'>
                    <span>Message</span>
                    <Controller
                        name='message'
                        control={control}
                        render={({ field }) => (<>
                            <InputMUI
                                className='auth-box__input'
                                type='text'
                                fullWidth
                                error={errors.message?.message}
                                inputProps={field}
                                multiline
                                minRows={8}
                                maxRows={8}
                            //onChange={e => {}}
                            />
                        </>)}
                    />
                </div>

                <div className='btn'>
                    <ButtonMUI variant='outlined' onClick={toggleDialog}>
                        CANCEL
                    </ButtonMUI>
                    <ButtonMUI
                        loading={btnLoad}
                        formAction
                    >
                        SEND
                    </ButtonMUI>
                </div>
            </form>
        </DialogMUI>
    );
};

export default ContactForm;
