import React from 'react';
import './LocationDisplay.css';

function LocationDisplay({ location }) {
  if (!location) {
    return null;
  }

  return (
    <div className="location-display">
      <h2>Current Location</h2>
      <p>{location.placeName}</p>
    </div>
  );
}

export default LocationDisplay;