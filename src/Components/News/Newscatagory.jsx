
import React, { use } from 'react';
import NewsCatagoryCard from './NewsCatagoryCard';

const Newscatagory = ({newsHeadersPromise}) => {
    // const newsHData = use(newsHeadersPromise)
    // const newsData = newsHData.articles;
    const { categories: newsHData } = use(newsHeadersPromise);
    // console.log(newsHData);
    
    return (
        <div>
            {/* <h2 className='text-4xl text-blue-600'>total length  </h2> */}
            <div className="flex gap-2 mx-auto max-w-40 justify-center  ">
                {
                    newsHData.map(newsData => (
                        <NewsCatagoryCard newsData={newsData} ></NewsCatagoryCard>
                    ))
                }
            </div>
        </div>
    );
};

export default Newscatagory;