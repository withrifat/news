import React from 'react';

const NewsCatagoryCard = ({ newsData, catagoryClicked }) => {
  console.log(newsData.id);



  return (
    <button
      onClick={() => catagoryClicked(newsData.id)}
      className="btn btn-outline">
      {newsData.id}
    </button>
  );
};

export default NewsCatagoryCard;