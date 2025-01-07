
function Results({ nearbyCourses }) {
  return (
    <div className="results-container">
      <h2 style={{ paddingBottom: '10px' }}>
        Nearby Courses
      </h2>
      <ul>
        {nearbyCourses.length === 0 ? (
          <li>No nearby courses found.</li>
        ) : (
          nearbyCourses.map((course, index) => (
            <li key={index} className='results-item'>
              {course['course_title']}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Results;