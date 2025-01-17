import { useState } from 'react';
import FilterSection from './FilterSection.jsx';
import PropTypes from 'prop-types';
import Select from 'react-select';
// Icons for Settings button and Close button
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog , faTimes} from '@fortawesome/free-solid-svg-icons';

// Data for user filters
import uniqueValuesData from './data/unique_values.json';
const departmentOptions = uniqueValuesData['department'].map(dept => ({
  value: dept, 
  label: dept
}));
const instructorOptions = uniqueValuesData['instructor'].map(instructor => ({
  value: instructor, 
  label: instructor
}));
const currProgOptions = uniqueValuesData['curricular_programs'].map(prog => ({
  value: prog, 
  label: prog
}));

function Results({ nearbyCourses, handleDepartmentsChange, handleInstructorsChange, handleCurrProgsChange }) {
  const [displayResults, setDisplayResults] = useState(true);

  const handleSettingsClick = () => {
    setDisplayResults(d => !d);
  }

  return (
    <>
      {displayResults ? (
        <div className="content-container">
          <div id="button-container">
            <button id="mode-button" onClick={handleSettingsClick}>
              <FontAwesomeIcon icon={faCog} />
            </button>
          </div>
          <h1 id="content-title">
            Nearby Courses
          </h1>
          <ul>
            {nearbyCourses === null ? (
              <li>Click on the map to find nearby courses!</li>
            ) : nearbyCourses.length === 0 ? (
              <li>No nearby courses found.</li>
            ) : (
              nearbyCourses.map((course, index) => (
                <li key={index} className="results-item">
                  {course.course_title}
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
          <h1 id="content-title">
            Settings
          </h1>
          <div className="settings-section-container">
            <h2>Filter Settings</h2>
            <FilterSection
              labelText="Department"
              inputId="departmentSelect"
              selectOptions={departmentOptions}
              handleChange={handleDepartmentsChange}
            />
            <FilterSection
              labelText="Instructor"
              inputId="instructorSelect"
              selectOptions={instructorOptions}
              handleChange={handleInstructorsChange}
            />
            <FilterSection
              labelText="Curricular Program"
              inputId="curricularProgSelect"
              selectOptions={currProgOptions}
              handleChange={handleCurrProgsChange}
            />
          </div>
          <div className="settings-section-container">
            <h2>Time Settings</h2>
            <div className="input-container">
                <input type="radio" id="current-time-radio" name="time-option" value="current" checked/>
                <label htmlFor="current-time-radio">Use Current Time</label>
            </div>

            <div className="input-container">
                <input type="radio" id="custom-time-radio" name="time-option" value="custom"/>
                <label htmlFor="custom-time-radio">Select Custom Time</label>
            </div>
          </div>
          <div className="settings-section-container">
            <h2>Location Settings</h2>
            <div className="input-container">
                <input type="radio" id="current-location-radio" name="location-option" value="current" checked/>
                <label htmlFor="current-location-radio">Use Current Location</label>
            </div>

            <div className="input-container">
                <input type="radio" id="custom-location-radio" name="location-option" value="custom"/>
                <label htmlFor="custom-location-radio">Select Custom Location</label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Prop validation
Results.propTypes = {
  nearbyCourses: PropTypes.list,
  handleDepartmentsChange: PropTypes.func,
  handleInstructorsChange: PropTypes.func,
  handleCurrProgsChange: PropTypes.func,
}

export default Results;