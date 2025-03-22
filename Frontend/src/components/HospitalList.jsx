import React from 'react';
import './HospitalList.css';

function HospitalList({ hospitals }) {
  if (!hospitals?.length) {
    return null;
  }

  return (
    <div className="hospitals-container">
      <h2>Nearest Hospitals</h2>
      <div className="hospitals-grid">
        {hospitals.map((hospital, index) => (
          <div key={index} className="hospital-card">
            <h3>{hospital.tags?.name || 'Unknown Hospital'}</h3>
            <div className="hospital-details">
              <p>
                Distance: {hospital.distance.toFixed(2)} km
                <span className="distance-type">
                  {hospital.isRoadDistance ? ' (by road)' : ' (direct)'}
                </span>
              </p>
              {hospital.duration && (
                <p className="duration">
                  Estimated time: {hospital.duration} minutes
                </p>
              )}
              <div className="coordinates">
                <p>Lat: {hospital.lat.toFixed(4)}</p>
                <p>Lon: {hospital.lon.toFixed(4)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HospitalList;