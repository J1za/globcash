import React, {useEffect, useState} from 'react';
import Slider from 'react-slick';
import useWindowDimensions from '../../../helpers/useWindowDimensions';
import moment from 'moment';
import {ReactComponent as NoItemIcon} from '../../../assets/images/no_notif.svg';
import {useDispatch, useSelector} from 'react-redux';
import {getPopularity, getPopular} from '../newsActions';
import {useHistory} from 'react-router-dom';
import './PopularPosts.scss';
import {PropagateLoader} from 'react-spinners';

const PopularPosts = () => {
  const [activePage, setActivePage] = useState(0);
  const [parameters, setParameters] = useState({
    page_size: 7
  });
  const {width} = useWindowDimensions();
  const {popular, popularLoad} = useSelector(({news}) => (news));
  const dispatch = useDispatch();
  const history = useHistory();

  const handleOpen = (id) => {
    history.push(`/main/dashboard/news/${id}`);
  };

  const doRequest = (page) => {
    let ST = pageYOffset;
    dispatch(getPopularity(parameters.page_size * (width <= 768 ? 1 : 2), ((page ? page : activePage) + 1))).then(res => {
      if (res.payload && res.payload.status && res.payload.status === 200 && width <= 768) {
        window.scrollTo({top: ST});
      }
    });
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    rows: parameters.page_size,
    slidesToShow: 1,
    afterChange: (e) => {
      if (((e + 1) * parameters.page_size) <= popular.results.length && popular.results.length !== popular.count) {
        setPage({selected: e}, true);
      }
    }
  };

  useEffect(() => {
    doRequest();
  }, []);

  useEffect(() => {
    console.log(popular);
  }, [popular]);

  const setPage = ({selected}, isReload) => {
    setActivePage(selected);
    if (isReload) doRequest(selected);
  };

  const morePopular = () => {
    setPage({selected: activePage + 1}, true);
  };

  return (
    <div className='popular_posts card-wrap'>
      <div className="title">Popular posts</div>
      {width > 768 &&
      <div>
        {popularLoad ?
          <section className='popular_loading'>
              <PropagateLoader color={'#3579FC'} />
          </section>
          : popular.count > 0 ? (
          <div>
            <Slider {...settings}>
              {popular.results &&
              popular.results.map(({author, created_date, id, title}) => (
                <div className='slider_items' onClick={() => handleOpen(id)} key={id}>
                  <div className="slider_content">
                    <span>{title}</span>
                    <div>
                      <span>{author}</span>
                      <p>{moment(created_date).fromNow()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className='no_items'>
            <NoItemIcon/>
            <span>No Popular posts</span>
          </div>
        )}
      </div>
      }
      {width <= 768 &&
        <div>
          {popularLoad ?
            <section className='popular_loading'>
              <PropagateLoader color={'#3579FC'} />
            </section>
            : popular.count > 0 ? (
              <div className='mob'>
                {popular.results &&
                popular.results.map(({author, created_date, id, title}) => (
                  <div className='slider_items' onClick={() => handleOpen(id)} key={id}>
                    <div className="slider_content">
                      <span>{title}</span>
                      <div>
                        <span>{author}</span>
                        <p>{moment(created_date).fromNow()}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {popular && popular.results &&
                popular.count > popular.results.length ?
                  <button
                    className='more good-hover'
                    onClick={morePopular}
                  >
                    Show more
                  </button>
                  : null
                }
              </div>
            ) : (
              <div className='no_items'>
                <NoItemIcon/>
                <span>No Popular posts</span>
              </div>
            )}
        </div>
      }
    </div>
  );
};

export default PopularPosts;
