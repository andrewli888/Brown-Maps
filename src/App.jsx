import MapClickable from "./MapClickable.jsx";
import Results from "./Results.jsx";
import { useState, useEffect } from "react";
import {
  formatTime,
  filterCourses,
  getNearbyCourses,
  getUniqueLocations,
} from "./helpers.js";

const FIVEMINUTEWALK = 300; // Using 300m as estimate for 5 minute walk

function App() {
  // State for the marker
  const [marker, setMarker] = useState(null);
  // States for course filters
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [filteredCurrProgs, setFilteredCurrProgs] = useState([]);
  // States for time settings
  const [timePreference, setTimePreference] = useState("any");
  const [customDay, setCustomDay] = useState("anyday");
  const [customTime, setCustomTime] = useState("09:00");
  // State for distance setting
  const [markerRadius, setMarkerRadius] = useState(FIVEMINUTEWALK); // In meters
  // State for the course selected by user, if exists
  const [selectedCourse, setSelectedCourse] = useState(null);

  /* Event handlers for Results component */
  // Changes to filter settings
  const handleDepartmentsChange = (selected) => {
    setFilteredDepartments(selected.map((item) => item["value"]));
  };
  const handleInstructorsChange = (selected) => {
    setFilteredInstructors(selected.map((item) => item["value"]));
  };
  const handleCurrProgsChange = (selected) => {
    setFilteredCurrProgs(selected.map((item) => item["value"]));
  };
  // Changes to time settings
  const handleTimePreferenceChange = (event) => {
    setTimePreference(event.target.value);
  };
  const handleDayChange = (event) => {
    setTimePreference("custom");
    setCustomDay(event.target.value);
  };
  const handleTimeChange = (event) => {
    setTimePreference("custom");
    setCustomTime(event.target.value);
  };
  /* Event handlers for Map component */
  function handleMapClick(latlng) {
    setMarker(latlng);
  }

  // Sync customDay, customTime with current time
  // useEffect(() => {
  //   if (timePreference == "current") {
  //     const intervalId = setInterval(() => {
  //       const [currentDay, currentTime] = getCurrentESTDateTime();
  //       setCustomDay(currentDay);
  //       setCustomTime(currentTime);
  //     }, 60000); // Update every minute
  //     return () => clearInterval(intervalId); // Cleanup
  //   }
  // }, [timePreference]);

  // Check if user has filtered a custom time
  const [filteredDay, filteredTime] =
    timePreference == "any" ? [null, null] : formatTime(customDay, customTime);
  // Lookup nearby courses within the filtered courses
  const nearbyCourses =
    marker == null
      ? null
      : getNearbyCourses(
          marker,
          filterCourses(
            filteredDepartments,
            filteredInstructors,
            filteredCurrProgs,
            filteredDay,
            filteredTime
          ),
          markerRadius
        );
  // Get a list of unique latlng locations of the nearby courses
  const nearbyCoursesLocations =
    nearbyCourses == null ? null : getUniqueLocations(nearbyCourses);

  return (
    <>
      <Results
        nearbyCourses={nearbyCourses}
        filteredDepartments={filteredDepartments}
        filteredInstructors={filteredInstructors}
        filteredCurrProgs={filteredCurrProgs}
        timePreference={timePreference}
        customDay={customDay}
        customTime={customTime}
        markerRadius={markerRadius}
        selectedCourse={selectedCourse}
        handleDepartmentsChange={handleDepartmentsChange}
        handleInstructorsChange={handleInstructorsChange}
        handleCurrProgsChange={handleCurrProgsChange}
        handleTimePreferenceChange={handleTimePreferenceChange}
        handleDayChange={handleDayChange}
        handleTimeChange={handleTimeChange}
        setMarkerRadius={setMarkerRadius}
        setSelectedCourse={setSelectedCourse}
      />
      <MapClickable
        marker={marker}
        radius={markerRadius}
        onMapClick={handleMapClick}
        nearbyCoursesLocations={nearbyCoursesLocations}
        selectedCourse={selectedCourse}
      />
    </>
  );
}

export default App;
