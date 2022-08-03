import React from 'react';
import {ReactComponent as EditIcon} from '../../../../assets/images/edit.svg';
import {ReactComponent as ClearIcon} from '../../../../assets/images/clear.svg';
import {ReactComponent as PDFIcon} from '../../../../assets/images/pdf.svg';

const Upload = ({getter, name, setter, title, description, link, idx, key}) => {
  return (
    <div className='download_wrapper_file' key={key}>
      {!getter[name].status ? (
        <div className='inactive'>
          <div className='text'>
            <span>{title}</span>
            {description ? <p>{description}</p> : null}
          </div>
          <div className='btn_controller'>
            <label htmlFor={`file-input-${idx}`} className='pulse'>
              <span>Upload file</span>
              <input
                className='file-input'
                id={`file-input-${idx}`}
                type='file'
                onChange={(e) => setter(name, e)}
                accept='image/*'
              />
            </label>
          </div>
        </div>
      ) : (
        <div className='active'>
          <div className='text'>
            <span>{title}</span>
            {description ? <p>{description}</p> : null}
          </div>

          <div className='active_btn'>
            <span>
              <a target='_blank' href={link}>
                <PDFIcon />
              </a>
            </span>
            <div className='btn_controller'>
              <div className='pulse'>
                <span>
                  <EditIcon />
                </span>
                <input
                  className='file-input'
                  id='file-input'
                  type='file'
                  onChange={(e) => setter(name, e)}
                  accept='image/*'
                />
              </div>
            </div>
            <button onClick={() => setter(name)}>
              <ClearIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
