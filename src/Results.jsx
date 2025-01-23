import { useState, useRef, useEffect } from "react";
import FilterSection from "./FilterSection.jsx";
import PropTypes from "prop-types";
// Icons for Settings button and Close button
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faTimes } from "@fortawesome/free-solid-svg-icons";

// Data for user filters
import uniqueValuesData from "./data/unique_values.json";
// Maps each item in a list to the correct object format for react select
function formatForSelect(data) {
  return data.map((item) => ({
    value: item,
    label: item,
  }));
}
const departmentOptions = formatForSelect(uniqueValuesData["department"]);
const instructorOptions = formatForSelect(uniqueValuesData["instructor"]);
const currProgOptions = formatForSelect(
  uniqueValuesData["curricular_programs"]
);

function Results({
  nearbyCourses,
  filteredDepartments,
  filteredInstructors,
  filteredCurrProgs,
  timePreference,
  customDay,
  customTime,
  markerRadius,
  selectedCourse,
  handleDepartmentsChange,
  handleInstructorsChange,
  handleCurrProgsChange,
  handleTimePreferenceChange,
  handleDayChange,
  handleTimeChange,
  setMarkerRadius,
  setSelectedCourse,
}) {
  const [displayMode, setDisplayMode] = useState("results");

  // Keep track of scroll position of results list
  const resultsListScrollPos = useRef(null);
  // If user switches to singleCourse mode, scroll to top
  useEffect(() => {
    if (displayMode === "singleCourse") {
      const contentContainer = document.getElementById("content-container");
      contentContainer.scrollTop = 0;
    }
  }, [displayMode]);
  // When user switches to results mode, restore scroll position
  useEffect(() => {
    if (displayMode === "results") {
      const contentContainer = document.getElementById("content-container");
      contentContainer.scrollTop = resultsListScrollPos.current ?? 0;
    }
  }, [displayMode]);

  // Determine the content based on display mode
  let content;
  switch (displayMode) {
    case "results":
      content = (
        <div id="content-container">
          <div id="button-container">
            <button id="mode-button" onClick={() => setDisplayMode("settings")}>
              <FontAwesomeIcon icon={faCog} />
            </button>
          </div>
          <h1 className="content-title">Nearby Courses</h1>
          {nearbyCourses === null ? (
            <p className="results-para">
              Click on the map to find nearby courses!
            </p>
          ) : nearbyCourses.length === 0 ? (
            <p className="results-para">No nearby courses found.</p>
          ) : (
            <ul id="results-list">
              {nearbyCourses.map((course, index) => (
                <li
                  key={index}
                  className="results-item"
                  onClick={() => {
                    // Save current scroll position
                    const resultsListElement =
                      document.getElementById("content-container");
                    resultsListScrollPos.current = resultsListElement.scrollTop;
                    // Switch to single course mode
                    setSelectedCourse(course);
                    setDisplayMode("singleCourse");
                  }}
                >
                  {`${course["course_code"]} - ${course["course_title"]}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
      break;
    case "settings":
      content = (
        <div id="content-container">
          <div id="button-container">
            <button id="mode-button" onClick={() => setDisplayMode("results")}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <h1 className="content-title">Settings</h1>
          <div className="settings-section-container">
            <h2>Filter Settings</h2>
            <FilterSection
              labelText="Department"
              inputId="departmentSelect"
              selectOptions={departmentOptions}
              value={formatForSelect(filteredDepartments)}
              handleChange={handleDepartmentsChange}
            />
            <FilterSection
              labelText="Instructor"
              inputId="instructorSelect"
              selectOptions={instructorOptions}
              value={formatForSelect(filteredInstructors)}
              handleChange={handleInstructorsChange}
            />
            <FilterSection
              labelText="Curricular Program"
              inputId="curricularProgSelect"
              selectOptions={currProgOptions}
              value={formatForSelect(filteredCurrProgs)}
              handleChange={handleCurrProgsChange}
            />
          </div>
          <div className="settings-section-container">
            <h2>Time Settings</h2>
            <div className="time-option">
              <input
                type="radio"
                id="any-time"
                name="time-preference"
                value="any"
                checked={timePreference === "any"}
                onChange={handleTimePreferenceChange}
              />
              <label htmlFor="any-time">Any Time</label>
            </div>
            {/* <div className="time-option">
              <input
                type="radio"
                id="current-time"
                name="time-preference"
                value="current"
                checked={timePreference === "current"}
                onChange={handleTimePreferenceChange}
              />
              <label htmlFor="current-time">Use Current Time</label>
            </div> */}
            <div className="time-option">
              <input
                type="radio"
                id="custom-time"
                name="time-preference"
                value="custom"
                checked={timePreference === "custom"}
                onChange={handleTimePreferenceChange}
              />
              <label htmlFor="custom-time">Custom Time:</label>
              <div id="custom-time-options">
                <select
                  id="day-of-week"
                  name="day-of-week"
                  value={customDay}
                  onChange={handleDayChange}
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                  <option value="anyday">Any Day</option>
                </select>
                <input
                  type="time"
                  id="time-input"
                  name="custom-time"
                  value={customTime}
                  onChange={handleTimeChange}
                />
              </div>
            </div>
          </div>
          <div className="settings-section-container">
            <h2>Distance Settings</h2>
            <div className="slider-container">
              <label htmlFor="markerRadiusSlider">
                {`Marker Radius: ${markerRadius} meters`}
              </label>
              <input
                  type="range"
                  id="markerRadiusSlider"
                  min="50"
                  max="500"
                  value={markerRadius}
                  onChange={event => {
                    setMarkerRadius(parseInt(event.target.value));
                  }}
              />
            </div>
          </div>
        </div>
      );
      break;
    case "singleCourse":
      content = (
        <div id="content-container">
          <div id="button-container">
            <button
              id="mode-button"
              onClick={() => {
                // Switch to results mode
                setSelectedCourse(null);
                setDisplayMode("results");
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <h1 className="content-title">{selectedCourse["course_code"]}</h1>
          <h2 id="course-title">{selectedCourse["course_title"]}</h2>
          <div className="course-info-section">
            <h3>Description</h3>
            <p className="course-description">
              {selectedCourse["course_description"] ?? "No Description"}
            </p>
          </div>
          <div className="course-info-section">
            <h3>Enrollment Information</h3>
            <p>
              <strong>Limit:</strong>{" "}
              {selectedCourse["enrollment_limit"] ?? "No Limit"}
            </p>
            <p>
              <strong>Total Enrolled:</strong>{" "}
              {selectedCourse["enrollment_total"] ?? "No Data"}
            </p>
            <p>
              <strong>Remaining Seats:</strong>{" "}
              {selectedCourse["enrollment_remaining"] ?? "N/A"}
            </p>
            <details>
              <summary>
                <strong>Enrollment Breakdown</strong>
              </summary>
              <p>Freshmen: {selectedCourse["enrollment_freshmen"] ?? "N/A"}</p>
              <p>
                Sophomores: {selectedCourse["enrollment_sophomores"] ?? "N/A"}
              </p>
              <p>Juniors: {selectedCourse["enrollment_juniors"] ?? "N/A"}</p>
              <p>Seniors: {selectedCourse["enrollment_seniors"] ?? "N/A"}</p>
              <p>
                Graduates: {selectedCourse["enrollment_graduates"] ?? "N/A"}
              </p>
              <p>Other: {selectedCourse["enrollment_other"] ?? "N/A"}</p>
            </details>
          </div>
          <div className="course-info-section">
            <h3>Registration Restrictions</h3>
            <p>{selectedCourse["registration_restrictions"] ?? "N/A"}</p>
          </div>
          <div className="course-info-section">
            <h3>Course Meeting Time</h3>
            <p className="course-meeting-time">
              {selectedCourse["course_meeting_time"] ?? "N/A"}
            </p>
          </div>
          <div className="course-info-section">
            <h3>Course Location</h3>
            <p className="course-location">
              {selectedCourse["course_location"] ?? "N/A"}
            </p>
          </div>
          <div className="course-info-section">
            <h3>Instructor Information</h3>
            <p className="instructor-information">
              {selectedCourse["instructor_information"] ?? "N/A"}
            </p>
          </div>
          <div className="course-info-section">
            <h3>Exam Date</h3>
            <p className="exam-datetime">
              {selectedCourse["exam_datetime"] ?? "N/A"}
            </p>
          </div>
        </div>
      );
      break;
    default:
      content = <p>Error: Invalid display mode. Try refreshing the page</p>;
  }
  return <>{content}</>;
}

// Prop validation
Results.propTypes = {
  nearbyCourses: PropTypes.list,
  filteredDepartments: PropTypes.list,
  filteredInstructors: PropTypes.list,
  filteredCurrProgs: PropTypes.list,
  timePreference: PropTypes.str,
  customDay: PropTypes.str,
  customTime: PropTypes.str,
  markerRadius: PropTypes.number,
  selectedCourse: PropTypes.object,
  handleDepartmentsChange: PropTypes.func,
  handleInstructorsChange: PropTypes.func,
  handleCurrProgsChange: PropTypes.func,
  handleTimePreferenceChange: PropTypes.func,
  handleDayChange: PropTypes.func,
  handleTimeChange: PropTypes.func,
  setMarkerRadius: PropTypes.func,
  setSelectedCourse: PropTypes.func,
};

export default Results;
