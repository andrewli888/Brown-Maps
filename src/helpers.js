/*** HELPER FUNCTIONS USED IN App.jsx ***/

import { getDistance } from "geolib";
import courseData from "./data/course_data.json";

const DAYOFWEEKMAPPINGS = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
  anyday: 7,
};
/**
 * Takes a day of week and time as formatted for the time settings inputs,
 * formats it to be compatible with the course data file.
 * Ex: monday 09:00 -> 0 900
 */
export function formatTime(dayOfWeek, time) {
  const [timeHour, timeMinute] = time.split(":");
  const formattedTime = parseInt(timeHour) * 100 + parseInt(timeMinute);
  return [DAYOFWEEKMAPPINGS[dayOfWeek], formattedTime];
}
/**
 * Returns the current day of week and time (EST)
 * in the format for the time settings inputs
 */
export function getCurrentESTDateTime() {
  const now = new Date();

  // Get the day of the week
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayOfWeek = daysOfWeek[now.getDay()];

  // Get the time in EST
  const ESTOffset = 5; // EST is 5h behind UTC
  const timeInEST = `${now.getHours() - ESTOffset}:${now.getMinutes()}`;

  return [dayOfWeek, timeInEST];
}

// Filter courses by user-selected filters
export function filterCourses(
  departments,
  instructors,
  currProgs,
  dayOfWeek,
  timeOfDay
) {
  return courseData.filter((course) => {
    // Department Filter
    if (departments.length > 0 && course["course_code"]) {
      const courseDept = course["course_code"].split(" ")[0];
      if (!departments.includes(courseDept)) {
        return false;
      }
    }
    // Instructor Filter
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
    // Curricular Programs Filter
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
    // Custom Time Filter
    if (dayOfWeek != null) {
      let timeMatches = false;
      for (const meetingTime of course["formatted_meeting_times"]) {
        // Check that meeting day and meeting time match
        if (
          (dayOfWeek === DAYOFWEEKMAPPINGS.anyday ||
            meetingTime["meet_day"] === dayOfWeek) &&
          timeOfDay >= meetingTime["start_time"] &&
          timeOfDay <= meetingTime["end_time"]
        ) {
          timeMatches = true;
          break;
        }
      }
      if (!timeMatches) {
        return false;
      }
    }
    // Passed all filters
    return true;
  });
}

// Takes a location, a list of courses, and a radius, returns those that are close to the location
export function getNearbyCourses(latlng, courses, radius) {
  return courses.filter((course) => {
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
        longitude: latlng["lng"],
      },
      {
        latitude: course["location_data"]["latitude"],
        longitude: course["location_data"]["longitude"],
      }
    );
    return distanceInMeters <= radius;
  });
}

// Takes a list of course data, returns a list of unique latlng locations of the courses
export function getUniqueLocations(courses) {
  let uniqueLocations = [];
  for (const course of courses) {
    const courseLat = course["location_data"]["latitude"];
    const courseLng = course["location_data"]["longitude"];
    let isDuplicate = false;
    // Check all previous locations (might want to make more efficient with Map)
    for (const location of uniqueLocations) {
      if (location["lat"] == courseLat && location["lng"] == courseLng) {
        isDuplicate = true;
        break;
      }
    }
    // New location found
    if (!isDuplicate) {
      uniqueLocations.push({
        lat: courseLat,
        lng: courseLng,
      });
    }
  }

  return uniqueLocations;
}
