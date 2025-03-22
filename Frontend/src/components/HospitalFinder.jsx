import React, { useState } from 'react';
import LocationDisplay from './LocationDisplay';
import HospitalList from './HospitalList';
import { getUserLocation } from '../services/locationService';
import './HospitalFinder.css';

function HospitalFinder() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFindHospitals = async () => {
    setLoading(true);
    setError(null);
    try {
      const locationData = await getUserLocation();
      setLocation(locationData);
      setHospitals(locationData.hospitals);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hospital-finder">
      <div className="button-container">
        <button 
          className="find-button"
          onClick={handleFindHospitals}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Find Nearest Hospitals'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <LocationDisplay location={location} />
      <HospitalList hospitals={hospitals} />
    </div>
  );
}

export default HospitalFinder;