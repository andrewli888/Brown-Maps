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
  return data.map(item => ({
    value: item,
    label: item,
  }))
}
const departmentOptions = formatForSelect(uniqueValuesData["department"]);
const instructorOptions = formatForSelect(uniqueValuesData["instructor"]);
const currProgOptions = formatForSelect(uniqueValuesData["curricular_programs"]);

function Results({
  nearbyCourses,
  selectedDepartments,
  selectedInstructors,
  selectedCurrProgs,
  handleDepartmentsChange,
  handleInstructorsChange,
  handleCurrProgsChange,
}) {
  const [displayResults, setDisplayResults] = useState(true);

  const handleSettingsClick = () => {
    setDisplayResults((d) => !d);
  };

  console.log("render");
  return (
    <>
      {displayResults ? (
        <div className="content-container">
          <div id="button-container">
            <button id="mode-button" onClick={handleSettingsClick}>
              <FontAwesomeIcon icon={faCog} />
            </button>
          </div>
          <h1 id="content-title">Nearby Courses</h1>
          <ul style={{ margin: "5px" }}>
            {nearbyCourses === null ? (
              <li>Click on the map to find nearby courses!</li>
            ) : nearbyCourses.length === 0 ? (
              <li>No nearby courses found.</li>
            ) : (
              nearbyCourses.map((course, index) => (
                <li key={index} className="results-item">
                  {`${course.course_code} - ${course.course_title}`}
                </li>
              ))
            )}
          </ul>
        </div>
      ) : (
        <div className="content-container">
          <div id="button-container">
            <button id="mode-button" onClick={handleSettingsClick}>
              <FontAwesomeIcon icon={faTimes}/>
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
      )}
    </>
  );
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
  updateSettingsStates: PropTypes.func,
};

export default Results;