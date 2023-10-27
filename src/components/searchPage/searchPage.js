import React, {useState} from 'react';
import axios from 'axios';
import "./searchPage.css";

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [queryError, setQueryError] = useState('');
    const [isError, setIsError] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if(!query){setQueryError("Please provide a valid search query.");
                    setIsError(true);
                }
        try {
        const params = {
            q: query,
            media_type: 'image' 
        }
        if (startYear) {
            params.year_start = startYear;
        }

        if (endYear) {
            params.year_end = endYear;
        }
        const response = await axios.get('https://images-api.nasa.gov/search', {params});
        setSearchResults(response.data.collection.items);
        setSearched(true);
    }
    catch (error) {
        if (error.response) {
            console.error('Error:', error.response.status);
            if (error.response.status === 404) {
                throw new Error ("Not Found! The requested resource doesn’t exist.")
              }
              if(error.response.status === 400) {
                throw new Error ("Bad Request. Please check you request and try again.")
              }
              if(error.response.status === 500 || error.response.status===502 || 
                error.response.status ===503 || error.response.status === 504) {
                    throw new Error ("Sorry but we're working on our servers. Please try again later")
                }
          } else {
            throw new Error('An unexpected error occurred. Please try again later.');
          }
    }
} 

    return (
        <div className='container'>
            <h1 id="pageTitle">NASA Media Library Search</h1>
            <div className='form'>
                <div className='inputFields'>
                    <label htmlFor ="query">Find:</label>
                    <input type="text" id="query" value={query} onChange={(e) => {setQuery(e.target.value); setDisabled(false);}} required />
                    {isError ? <span id="error">{queryError}</span>: null} 
                </div>
                <div className='inputFields'>
                    <label htmlFor="startYear">Start Year:</label>
                    <input type="number" id="startYear" value={startYear} onChange={(e) => setStartYear(e.target.value)} />
                </div>
                <div className='inputFields'>
                    <label htmlFor="endwYear">End Year:</label>
                    <input type="number" id="endYear" value={endYear} onChange={(e) => setEndYear(e.target.value)} />
                </div>
                <div id='button'>
                    <button id="subBtn" disabled={disabled} onClick={handleSearch}>Search</button>
                </div>
            </div>
            <div id="resultContainer">
                {searchResults.length >= 1 ? (
                    searchResults.map((item) => (
                        <div key={item.data[0].nasa_id} className="photoItem">
                            <img id="photo" src={item.links[0].href} alt={item.data[0].title} />
                            <h2 id="photoTitle">{item.data[0].title}</h2>
                            <p id="location">{item.data[0].location}</p>
                            <p id="photographer">{item.data[0].photographer}</p>
                            <a href={`/show/${item.data[0].nasa_id}`} id="details">View Details</a>
                        </div>
                    ))
                ) : (
                       searched ? <span id="noItems">No items found. Please check your search.</span> : null
                    )
                }
            </div>
        </div>

    )
}
export default SearchPage;