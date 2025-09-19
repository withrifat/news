
import React from 'react';

const NewsCatagoryCard = ({newsData}) => {
    console.log(newsData.id);
    
    return (
        <button  className='btn btn-outline'> {newsData.id} </button>
        
    );
};

export default NewsCatagoryCard;