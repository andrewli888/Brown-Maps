import MapClickable from './MapClickable.jsx';
import Results from './Results.jsx';
import { useState, createContext } from 'react';
import { getDistance } from 'geolib';
import courseLocationsData from './data/course_locations.json'

const WALKDISTANCE = 300; // Using 300m as estimate for 5 minute walk

function getNearbyCourses(latlng) {
  return courseLocationsData.filter((course) => {
    if (course['course_location'] == null || course['location_data']['api_address'] == 'api error') {
      return false;
    }

    const distanceInMeters = getDistance(
      { latitude: latlng['lat'], longitude: latlng['lng'] },
      { latitude: course['location_data']['latitude'], longitude: course['location_data']['longitude'] }
    );
    return distanceInMeters <= WALKDISTANCE; 
  })
}

function App() {
  const [markers, setMarkers] = useState([]);
  // Stores the selected marker
  const [selectedIndex, setSelectedIndex] = useState(null);
  // States for the filter settings from the user
  const [departments, setDepartments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [currProgs, setCurrProgs] = useState([]);

  // Calculate values from state
  const selectedMarker = (selectedIndex == null) ? null : markers[selectedIndex];
  const nearbyCourses = (selectedMarker == null) ? null : getNearbyCourses(selectedMarker)

  // Event handlers for Results component
  // Changes to filter settings
  const handleDepartmentsChange = selected => {
    setDepartments(selected.map(item => item['value']));
  }
  const handleInstructorsChange = selected => {
    setInstructors(selected.map(item => item['value']));
  }
  const handleCurrProgsChange = selected => {
    setCurrProgs(selected.map(item => item['value']));
  }

  // Event handlers for Map component
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
      <Results 
        nearbyCourses={nearbyCourses} 
        handleDepartmentsChange={handleDepartmentsChange}
        handleInstructorsChange={handleInstructorsChange}
        handleCurrProgsChange={handleCurrProgsChange}
      />
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
