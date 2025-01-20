import PropTypes from "prop-types";
import {
  MapContainer,
  TileLayer,
  useMapEvent,
  Marker,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet's CSS

// Create custom marker icons
import L from "leaflet";
import mainMarker from "./images/mainMarker.png";
import coursesMarker from "./images/coursesMarker.png";
const mainMarkerIcon = L.icon({
  iconUrl: mainMarker,
  iconSize: [50, 50],
  iconAnchor: [25, 45],
});
const coursesMarkerIcon = L.icon({
  iconUrl: coursesMarker,
  iconSize: [30, 30],
  iconAnchor: [15, 27],
});

function MarkerManager({ onClick }) {
  useMapEvent("click", (e) => {
    const { lat, lng } = e.latlng;
    // Add marker to list of markers
    onClick({ lat, lng });
  });
  return null;
}

function MapClickable({
  marker,
  radius,
  onMapClick,
  nearbyCoursesLocations,
  selectedCourse,
}) {
  // console.log(nearbyCoursesLocations);
  return (
    <MapContainer center={[41.8268, -71.4025]} zoom={17}>
      <MarkerManager onClick={onMapClick} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {marker && (
        <>
          <Marker position={marker} icon={mainMarkerIcon} />
          <Circle center={[marker["lat"], marker["lng"]]} radius={radius} />
        </>
      )}
      {selectedCourse ? (
        <Marker
          position={{
            "lat": selectedCourse["location_data"]["latitude"],
            "lng": selectedCourse["location_data"]["longitude"],
          }}
          icon={coursesMarkerIcon}
        ></Marker>
      ) : (
        nearbyCoursesLocations &&
        nearbyCoursesLocations.map((latlng, index) => (
          <Marker
            key={index}
            position={latlng}
            icon={coursesMarkerIcon}
          ></Marker>
        ))
      )}
    </MapContainer>
  );
}

// Prop validation
MarkerManager.propTypes = {
  onClick: PropTypes.func.isRequired,
};

MapClickable.propTypes = {
  marker: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  radius: PropTypes.number,
  onMapClick: PropTypes.func,
  nearbyCoursesLocations: PropTypes.list,
  selectedCourse: PropTypes.object,
};

export default MapClickable;
