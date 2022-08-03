import React, {useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {ReactComponent as ArrowIcon} from '../../../assets/images/arrow_back.svg';
import {useDispatch, useSelector} from 'react-redux';
import {getMainThree} from '../newsActions';
import moment from 'moment';
import {PropagateLoader} from 'react-spinners';
import './TopNews.scss';

const TopNews = () => {
  const { main_three , main_threeLoad } = useSelector(({ news }) => (news));
  const dispatch = useDispatch();

  useEffect(() => {
  }, [main_three]);

  useEffect(() => {
    dispatch(getMainThree());
  }, []);

  const history = useHistory();

  const handleOpen = (id) => {
    history.push(`/main/dashboard/news/${id}`);
  };

  return (
     <div className='top_news_block '>
       <div className='breadcrumbs'>
         <Link className='good-hover' to={'/main/dashboard'}>Dashboard</Link>
         <ArrowIcon/>
         <span>News</span>
       </div>
       {main_threeLoad ?
         <section className='reports_table loading'>
           <div className='card-wrap'>
             <PropagateLoader color={'#3579FC'} />
           </div>
         </section>
         :
         <div className="wrapper">
           {main_three && main_three.map(({ large_image, types, author, created_date, id, title }, idx) => (
             <div key={idx}  onClick={() => handleOpen(id)}>
               <img src={large_image} alt="news"/>
               <span>
                 {types && types.map(({ id, name }) => (
                   <p key={id}>{name}</p>
                 ))}
              </span>
               <div className='info'>
                <span>
                    {types && types.map(({ id, name }) => (
                      <p key={id}>{name}</p>
                    ))}
                </span>
                 <p>{title}</p>
                 <div>
                   {types && types.map(({ id, name }) => (
                     <div key={id}>{name}</div>
                   ))}
                   <span>{author}</span>
                   <p>{moment(created_date).fromNow()}</p>
                 </div>
               </div>
             </div>
           ))}
         </div>
       }
     </div>
  );
};

export default TopNews;
