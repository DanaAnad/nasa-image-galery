import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../showPage/showPage.css";

const ShowPage = () => {
    const { id } = useParams();
  const [collectionItem, setCollectionItem] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        if(id){
        const response = await axios.get(`https://images-api.nasa.gov/search?nasa_id=${id}`);
        const item = response.data.collection.items[0];
        setCollectionItem(item);
      }} catch (error) {
        console.error(error);
      }
    };
    fetchCollection();
  }, [id]);

  return (
    <div id="container">
    {collectionItem ? (
      <div id="item-container">
        <h2 id="itemTitle">{collectionItem.data[0].title}</h2>
        <img id="imageItem" src={collectionItem.links[0].href} alt={collectionItem.title} />
        <span>photographed at</span>
        <p id="itemLocation">{collectionItem.data[0].location}</p>
        <span>by</span>
        <p id="itemPhotographer">{collectionItem.data[0].photographer}</p>
       <span>Description:</span>
       <p id="itemDescriptiom">{collectionItem.data[0].description}</p>
        <span>Keywords:</span>
        <p id="itemKeywords">{collectionItem.data[0].keywords.join(', ')}</p>
        <span>Date:</span>
        <p id="itemDate">{collectionItem.data[0].date_created.toLocaleString('en-GB').slice(0,10)}</p>
        <button id="backBtn" onClick={() => window.history.back()}>Back</button>
      </div>
    ) : (
        <div id="loading"><span>Loading...</span></div>
    )}
    </div>
    )
};
export default ShowPage;

