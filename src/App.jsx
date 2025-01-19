import MapClickable from "./MapClickable.jsx";
import Results from "./Results.jsx";
import { useState } from "react";
import { getDistance } from "geolib";
import courseData from "./data/course_data.json";

const WALKDISTANCE = 300; // Using 300m as estimate for 5 minute walk

// Filter courses by user-selected filters
function filterCourses(departments, instructors, currProgs) {
  return courseData.filter((course) => {
    // Check the user applied filters
    if (departments.length > 0 && course["course_code"]) {
      const courseDept = course["course_code"].split(" ")[0];
      if (!departments.includes(courseDept)) {
        return false;
      }
    }
    if (instructors.length > 0 && course["instructor_information"]) {
      const courseInstructorInfo = course["instructor_information"];
      // Checks if any selected instructor name is a substring of the current course's instructor data
      if (
        !instructors.some((instructorName) =>
          courseInstructorInfo.includes(instructorName)
        )
      ) {
        return false;
      }
    }
    if (currProgs.length > 0 && course["curricular_programs"]) {
      const courseCurrProgs = course["curricular_programs"];
      // Checks if any selected currprog is a substring of the current course's currprog data
      if (
        !currProgs.some((currProgName) =>
          courseCurrProgs.includes(currProgName)
        )
      ) {
        return false;
      }
    }
    // Passed all filters
    return true;
  });
}

function getNearbyCourses(latlng, departments, instructors, currProgs) {
  const filteredCourses = filterCourses(departments, instructors, currProgs);
  return filteredCourses.filter((course) => {
    // Check the location
    if (
      course["course_location"] == null ||
      course["location_data"]["api_address"] == "api error"
    ) {
      return false;
    }
    const distanceInMeters = getDistance(
      { 
        latitude: latlng["lat"], 
        longitude: latlng["lng"] 
      },
      {
        latitude: course["location_data"]["latitude"],
        longitude: course["location_data"]["longitude"],
      }
    );
    return distanceInMeters <= WALKDISTANCE;
  });
}

function App() {
  // State for the marker
  const [marker, setMarker] = useState(null);
  // States for course filters
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedCurrProgs, setSelectedCurrProgs] = useState([]);

  // Calculate values from state
  const nearbyCourses =
    marker == null
      ? null
      : getNearbyCourses(
          marker,
          selectedDepartments,
          selectedInstructors,
          selectedCurrProgs
        );

  // Event handlers for Results component
  // Changes to filter settings
  const handleDepartmentsChange = (selected) => {
    setSelectedDepartments(selected.map((item) => item["value"]));
  };
  const handleInstructorsChange = (selected) => {
    setSelectedInstructors(selected.map((item) => item["value"]));
  };
  const handleCurrProgsChange = (selected) => {
    setSelectedCurrProgs(selected.map((item) => item["value"]));
  };

  // Event handlers for Map component
  function handleMapClick(latlng) {
    setMarker(latlng);
  }

  return (
    <>
      <Results
        nearbyCourses={nearbyCourses}
        selectedDepartments={selectedDepartments}
        selectedInstructors={selectedInstructors}
        selectedCurrProgs={selectedCurrProgs}
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
  );
}

export default App;
