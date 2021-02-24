import React from 'react';

const SearchFront = (props) => {
  return (
    <div className="search-front">
      <input 
        type="search" 
        className="search-front__input"
        placeholder="Search a country..."
        onChange={props.updateSearchTerm}
      />
    </div>
  )
}

export default SearchFront;

