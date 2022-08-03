import React, { useEffect, useState } from 'react';
import Pagination from '../../../shared/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { getNewsType, getNews } from '../newsActions';
import moment from 'moment';
import { PropagateLoader } from 'react-spinners';
import './LatestNews.scss';
import './LatestNewsInner.scss';
import { Link, useHistory } from 'react-router-dom';
import noNewsImage from '../../../assets/images/no_news_image.png'
import { ReactComponent as ArrowRight } from '../../../assets/images/forecast_arrow.svg';
import { ReactComponent as LinkIndicator } from '../../../assets/images/link_indicator.svg';
import { ToListStart } from '../../../helpers/functions';

const LatestNews = ({ currencyId }) => {
  const [isFirst, setIsFirst] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const { news_type, news, news_typeLoad, newsLoad } = useSelector(({ news }) => (news));
  const dispatch = useDispatch();

  const setPage = ({ selected }, isReload) => {
    setActivePage(selected);
    if (isReload) doRequest(selected);
  };

  const doRequest = page => {
    let url = [`page=${(page || page) + 1 || (activePage) + 1}`];
    for (let key in parameters) {
      if (parameters[key] !== null && parameters[key] !== '') {
        url.push(`${key}=${parameters[key].value ? parameters[key].value : parameters[key]}`);
      }
    }
    dispatch(getNews(url.join('&')))
  };

  const [parameters, setParameters] = useState({
    page_size: currencyId ? 4 : 10,
    types: null,
    currency: currencyId || null
  });

  useEffect(() => {
    if (isFirst) {
      dispatch(getNewsType());
      setIsFirst(false);
    }
    doRequest()
  }, [parameters]);

  useEffect(() => {
    setPage({ selected: 0 }, true);
  }, [parameters]);

  const checkType = (id, page) => {
    setParameters({
      ...parameters,
      types: id === parameters.types ? null : id,
    });
  };

  const history = useHistory();

  const handleOpen = (id, source_link) => {
    if (source_link) {
      window.open(source_link, '_blank')
    } else {
      history.push(`/main/dashboard/news/${id}`);
    }
  };

  const renderFunc = () => (
    <div className={`latest_news_wrapper card-wrap ${currencyId ? 'latest_news_block' : ''}`}>
      <div className="title">
        <span>Latest news</span>
        {currencyId
          ? <Link className='good-hover' to={`/main/dashboard/news`}>
            All news
            <ArrowRight />
          </Link>
          : news_typeLoad
            ? null
            : <div>
              <div>
                {news_type && news_type.map(({ name, id, }) => (
                  <button
                    key={id}
                    className={id === parameters.types ? 'active' : ''}
                    onClick={() => checkType(id)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
        }
      </div>
      {newsLoad ?
        <section className='popular_loading'>
          <PropagateLoader color={'#3579FC'} />
        </section>
        :
        <div>
          {news.results.length > 0 ?
            <div className="news_wrapper">
              {news && news.results && news.results.map(({ id, author, created_date, types, small_image, preview, title, source_link }) => (
                <div key={id} onClick={() => handleOpen(id, source_link)}>
                  <div className="icon">
                    <img src={small_image || noNewsImage} alt="image" />
                  </div>
                  <div className="info_news">
                    <span>
                      {types.map(({ id, name }) => (
                        <p key={id}>{name}</p>
                      ))}
                    </span>
                    <div className='name'>
                      {title}
                      {source_link && <LinkIndicator />}
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: preview }} />
                    <div className="author">
                      <span>{author}</span>
                      <p>{moment(created_date).fromNow()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            :
            <div>no items</div>
          }
        </div>
      }
      {!currencyId && news.count > parameters.page_size && <>
        <Pagination
          active={activePage}
          pageCount={Math.ceil(news.count / parameters.page_size)}
          onChange={(page) => setPage(page, true)}
        />
        <ToListStart element='.latest_news_wrapper' counter={activePage} breakpoint={null} />
      </>}
    </div>
  );

  return (
    currencyId
      ? news?.results?.length < 1
        ? null
        : renderFunc()
      : renderFunc()
  );
};

export default LatestNews;
