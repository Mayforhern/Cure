const MAPBOX_API_KEY = "pk.eyJ1IjoiZXJlbjk3IiwiYSI6ImNsendmMTY5YzBpZGgybnNpNHUxY2dmeXcifQ.SlfHg7eZD2QVa6miDf5hfw";

// Function to get road distance using Mapbox Directions API with improved accuracy
async function getRoadDistance(startLat, startLon, endLat, endLon) {
    try {
        // Add additional parameters for better accuracy
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLon},${startLat};${endLon},${endLat}? + 
            alternatives=false& +
            geometries=geojson& +
            overview=full& +
            steps=true& +
            access_token=${MAPBOX_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
            // Get the most optimal route
            const route = data.routes[0];
            
            // Convert distance from meters to kilometers with 2 decimal places
            const distanceInKm = (route.distance / 1000).toFixed(2);
            
            // Get estimated duration in minutes
            const durationInMinutes = Math.round(route.duration / 60);

            return {
                distance: parseFloat(distanceInKm),
                duration: durationInMinutes,
                route: route.geometry // Store route geometry for potential future use
            };
        }
        return null;
    } catch (error) {
        console.error("Error getting road distance:", error);
        return null;
    }
}

// Function to calculate straight-line distance (fallback)
function calculateStraightLineDistance(lat1, lon1, lat2, lon2) {
    lat1 = Number(lat1);
    lon1 = Number(lon1);
    lat2 = Number(lat2);
    lon2 = Number(lon2);

    const lat1Rad = lat1 * Math.PI / 180;
    const lon1Rad = lon1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const lon2Rad = lon2 * Math.PI / 180;

    const R = 6371;
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const placeName = await reverseGeocode(latitude, longitude);
                    const hospitals = await findNearestHospitals(latitude, longitude);
                    
                    resolve({
                        latitude,
                        longitude,
                        placeName,
                        hospitals
                    });
                } catch (error) {
                    reject(error);
                }
            },
            (error) => {
                reject(new Error("Failed to get your location."));
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
};

async function reverseGeocode(lat, lon) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            return data.features[0].place_name;
        } else {
            return "Unknown Location";
        }
    } catch (error) {
        console.error("Error fetching address:", error);
        return "Unknown Location";
    }
}

async function findNearestHospitals(lat, lon) {
    const overpassQuery = `
        [out:json];
        (
            node["amenity"="hospital"](around:10000, ${lat}, ${lon});
            way["amenity"="hospital"](around:10000, ${lat}, ${lon});
            relation["amenity"="hospital"](around:10000, ${lat}, ${lon});
        );
        out center;
    `;
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    try {
        const response = await fetch(overpassUrl);
        const data = await response.json();

        if (!data.elements || data.elements.length === 0) {
            return [];
        }

        // First, calculate straight-line distances to sort approximately
        const hospitalsWithDistance = data.elements.map(hospital => {
            const hospitalLat = hospital.lat || hospital.center?.lat;
            const hospitalLon = hospital.lon || hospital.center?.lon;

            if (!hospitalLat || !hospitalLon) {
                return null;
            }

            const straightLineDistance = calculateStraightLineDistance(
                lat,
                lon,
                hospitalLat,
                hospitalLon
            );

            return {
                ...hospital,
                straightLineDistance,
                lat: hospitalLat,
                lon: hospitalLon
            };
        }).filter(hospital => hospital !== null);

        // Sort by straight-line distance and take top 6
        hospitalsWithDistance.sort((a, b) => a.straightLineDistance - b.straightLineDistance);
        const nearestHospitals = hospitalsWithDistance.slice(0, 6);

        // Get road distances for the nearest hospitals
        const hospitalsWithRoadDistance = await Promise.all(
            nearestHospitals.map(async hospital => {
                const routeInfo = await getRoadDistance(
                    lat,
                    lon,
                    hospital.lat,
                    hospital.lon
                );

                return {
                    ...hospital,
                    distance: routeInfo ? routeInfo.distance : hospital.straightLineDistance,
                    duration: routeInfo ? routeInfo.duration : null,
                    route: routeInfo ? routeInfo.route : null,
                    isRoadDistance: !!routeInfo
                };
            })
        );

        // Sort by actual road distance
        hospitalsWithRoadDistance.sort((a, b) => a.distance - b.distance);

        // Return top 4 by actual road distance
        return hospitalsWithRoadDistance.slice(0, 4);

    } catch (error) {
        console.error("Error fetching hospital data:", error);
        return [];
    }
}

// Helper function to handle errors
function handleError(error) {
    console.error('Error:', error);
    return {
        error: true,
        message: error.message || 'An unexpected error occurred'
    };
}

// Export all functions for potential individual use
export const locationService = {
    getUserLocation,
    reverseGeocode,
    findNearestHospitals,
    getRoadDistance,
    calculateStraightLineDistance
};

export default locationService;