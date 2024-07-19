import { useState } from 'react';
import './searchBar.scss';
import { Link } from 'react-router-dom';

const types = ['Auctions', 'Pre-Auctions'];
const propertyTypes = [
  'flowers',
  'vehicles',
  'house',
  'condo',
  'land',
  'other',
];

function SearchBar() {
  const [query, setQuery] = useState({
    type: 'Auctions',
    property: '',
    minBasePrice: 0,
    maxBasePrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? 'active' : ''}
          >
            {type}
          </button>
        ))}
      </div>
      <form>
        <select
          name="property"
          onChange={handleChange}
          value={query.property}
          required
        >
          <option value="" disabled>
            Select Product Type
          </option>
          {propertyTypes.map((property) => (
            <option key={property} value={property}>
              {property.charAt(0).toUpperCase() + property.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="minBasePrice"
          min={0}
          max={10000000}
          placeholder="minBasePrice"
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxBasePrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          onChange={handleChange}
        />
        <Link
          to={`/list?type=${query.type}&property=${query.property}&minBasePrice=${query.minBasePrice}&maxBasePrice=${query.maxBasePrice}`}
        >
          <button>
            <img src="/search.png" alt="search" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
