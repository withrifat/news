import React, { use } from 'react';
import NewsCatagoryCard from './NewsCatagoryCard';

const Newscatagory = ({ newsHeadersPromise, onCategorySelect }) => {
  const { categories: newsHData } = use(newsHeadersPromise); // categories data

  const catagoryClicked = (id) => {
    console.log(id);

    fetch(`https://news-api-fs.vercel.app/api/categories/${id}`)
      .then((res) => res.json())
      .then((data) => {
        onCategorySelect(data.articles);
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
      });
  };

  return (
    <div>
      {/* <h2 className='text-4xl text-blue-600'>total length  </h2> */}
      <div className="flex gap-2 mx-auto max-w-40 justify-center  ">
        {newsHData.map((newsData) => (
          <NewsCatagoryCard key={newsData.id} catagoryClicked={catagoryClicked} newsData={newsData}></NewsCatagoryCard>
        ))}
      </div>
    </div>
  );
};

export default Newscatagory;
