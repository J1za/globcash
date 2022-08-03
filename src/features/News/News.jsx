import React from 'react';
import LatestNews from "./LatestNews/LatestNews"
import PopularPosts from "./PopularPosts/PopularPosts"
import TopNews from './TopNews/TopNews';
import './News.scss';

const News = () => {

  return (
      <div className="news_page_wrapper">
        <TopNews />
        <div className='news_block_width'>
          <LatestNews />
          <PopularPosts />
        </div>
      </div>
  );
};

export default News;
