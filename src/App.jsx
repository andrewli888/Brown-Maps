import MapClickable from './MapClickable.jsx';
import Results from './Results.jsx';
import { useState } from 'react';
import { getDistance } from 'geolib';
import courseLocationsData from './data/course_locations.json'

const WALKDISTANCE = 300; // Using 300m as estimate for 5 minute walk

function getNearbyCourses(latlng) {
  return courseLocationsData.filter((course) => {
    if (course['course_location'] == null || course['api_address'] == 'api error') {
      return false;
    }

    const distanceInMeters = getDistance(
      { latitude: latlng['lat'], longitude: latlng['lng'] },
      { latitude: course['latitude'], longitude: course['longitude'] }
    );
    return distanceInMeters <= WALKDISTANCE; 
  })
}

function App() {
  const [markers, setMarkers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const selectedMarker = (selectedIndex == null) ? null : markers[selectedIndex];
  const nearbyCourses = (selectedMarker == null) ? [] : getNearbyCourses(selectedMarker)

  function handleMapClick(latlng) {
    const newMarkers = [...markers, latlng];
    setMarkers(newMarkers);
    setSelectedIndex(newMarkers.length - 1); // Select the newest marker
  }

  function handleSelectMarker(index) {
    setSelectedIndex(index);
  }

  function handleRemoveMarker(index) {
    const newMarkers = [...markers];
    newMarkers.filter((_, i) => i !== index);
    setMarkers(newMarkers);
    // Check if any markers left
    setSelectedIndex(newMarkers.length == 0 ? null : newMarkers.length - 1)
  }

  return (
    <>
      <Results nearbyCourses={nearbyCourses}/>
      <MapClickable 
        markers={markers} 
        selectedMarker={selectedMarker}
        radius={WALKDISTANCE}
        onMapClick={handleMapClick} 
        onSelectMarker={handleSelectMarker}
        onRemoveMarker={handleRemoveMarker}
      />
    </>
  )
}

export default App;
