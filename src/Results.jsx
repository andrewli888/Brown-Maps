import PropTypes from 'prop-types';

function Results({ nearbyCourses }) {
  return (
    <div className="results-container">
      <h2 style={{ paddingBottom: '10px' }}>
        Nearby Courses
      </h2>
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
  );
}

// Prop validation
Results.propTypes = {
  nearbyCourses: PropTypes.list
}

export default Results;