import React from 'react';
import './Contact.scss';
import { Link } from 'react-router-dom';
import { useToggle } from '../../../../../helpers/hooks';
import ContactForm from './ContactForm';

const Contact = () => {
  const [dialog, toggleDialog] = useToggle();
  return (
    <section className='contact_block'>
      <div>
        <span>Can’t find what you’re looking for?</span>
        <button className='good-hover' onClick={toggleDialog}>Contact us</button>
      </div>
      <ContactForm
        dialog={dialog}
        toggleDialog={toggleDialog}
      />
    </section>
  );
};

export default Contact;
