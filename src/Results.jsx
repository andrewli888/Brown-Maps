import { useState } from "react";
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
  selectedDepartments,
  selectedInstructors,
  selectedCurrProgs,
  handleDepartmentsChange,
  handleInstructorsChange,
  handleCurrProgsChange,
}) {
  const [displayMode, setDisplayMode] = useState("results");
  // The course that the user is viewing, if it exists
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleCourseClick = (course) => {
    setDisplayMode("singleCourse");
    setSelectedCourse(course);
  };

  // Determine the content based on display mode
  let content;
  switch (displayMode) {
    case "results":
      content = (
        <div className="content-container">
          <div id="button-container">
            <button id="mode-button" onClick={() => setDisplayMode("settings")}>
              <FontAwesomeIcon icon={faCog} />
            </button>
          </div>
          <h1 id="content-title">Nearby Courses</h1>
          {nearbyCourses === null ? (
            <p>Click on the map to find nearby courses!</p>
          ) : nearbyCourses.length === 0 ? (
            <p>No nearby courses found.</p>
          ) : (
            <ul className="results-list">
              {nearbyCourses.map((course, index) => (
                <li
                  key={index}
                  className="results-item"
                  onClick={() => handleCourseClick(course)}
                  // onMouseEnter={() => console.log("hover start")}
                  // onMouseLeave={() => console.log("hover end")}
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
        <div className="content-container">
          <div id="button-container">
            <button id="mode-button" onClick={() => setDisplayMode("results")}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <h1 id="content-title">Settings</h1>
          <div className="settings-section-container">
            <h2>Filter Settings</h2>
            <FilterSection
              labelText="Department"
              inputId="departmentSelect"
              selectOptions={departmentOptions}
              value={formatForSelect(selectedDepartments)}
              handleChange={handleDepartmentsChange}
            />
            <FilterSection
              labelText="Instructor"
              inputId="instructorSelect"
              selectOptions={instructorOptions}
              value={formatForSelect(selectedInstructors)}
              handleChange={handleInstructorsChange}
            />
            <FilterSection
              labelText="Curricular Program"
              inputId="curricularProgSelect"
              selectOptions={currProgOptions}
              value={formatForSelect(selectedCurrProgs)}
              handleChange={handleCurrProgsChange}
            />
          </div>
          <div className="settings-section-container">
            <h2>Time Settings</h2>
            <div className="input-container">
              <input
                type="radio"
                id="current-time-radio"
                name="time-option"
                value="current"
                checked
              />
              <label htmlFor="current-time-radio">Use Current Time</label>
            </div>

            <div className="input-container">
              <input
                type="radio"
                id="custom-time-radio"
                name="time-option"
                value="custom"
              />
              <label htmlFor="custom-time-radio">Select Custom Time</label>
            </div>
          </div>
          <div className="settings-section-container">
            <h2>Location Settings</h2>
            <div className="input-container">
              <input
                type="radio"
                id="current-location-radio"
                name="location-option"
                value="current"
                checked
              />
              <label htmlFor="current-location-radio">
                Use Current Location
              </label>
            </div>

            <div className="input-container">
              <input
                type="radio"
                id="custom-location-radio"
                name="location-option"
                value="custom"
              />
              <label htmlFor="custom-location-radio">
                Select Custom Location
              </label>
            </div>
          </div>
          {/* <div className="settings-buttons">
            <button id="save-button" onClick={handleSaveSettings}>
              Save
            </button>
            <button id="cancel-button" onClick={() => {setDisplayResults(true)}}>Cancel</button>
          </div> */}
        </div>
      );
      break;
    case "singleCourse":
      content = (
        <div className="content-container">
          <div id="button-container">
            <button
              id="mode-button"
              onClick={() => {
                setSelectedCourse(null);
                setDisplayMode("results");
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <h1 id="content-title">{selectedCourse["course_code"]}</h1>
        </div>
      );
      break;
    default:
      content = <p>Error: Invalid Display Mode. Try refreshing the page</p>;
  }
  return <>{content}</>;
}

// Prop validation
Results.propTypes = {
  nearbyCourses: PropTypes.list,
  selectedDepartments: PropTypes.list,
  selectedInstructors: PropTypes.list,
  selectedCurrProgs: PropTypes.list,
  handleDepartmentsChange: PropTypes.func,
  handleInstructorsChange: PropTypes.func,
  handleCurrProgsChange: PropTypes.func,
};

export default Results;
