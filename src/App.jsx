import MapClickable from './MapClickable.jsx';
import Results from './Results.jsx';
import { useState } from 'react';
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
  // State for the marker
  const [marker, setMarker] = useState(null);
  // States for the filter settings from the user
  const [departments, setDepartments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [currProgs, setCurrProgs] = useState([]);

  // Calculate values from state
  const nearbyCourses = (marker == null) ? null : getNearbyCourses(marker)

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
    setMarker(latlng);
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
        marker={marker} 
        radius={WALKDISTANCE}
        onMapClick={handleMapClick}
      />
    </>
  )
}

export default App;
