import PropTypes from 'prop-types';
import L from 'leaflet';
import { MapContainer, TileLayer, useMapEvent, Marker, Circle } from 'react-leaflet';
import "leaflet/dist/leaflet.css"; // Ensure you import Leaflet's CSS

// Manually set marker image for leaflet map, otherwise not shown for some reason
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25,41], 
  iconAnchor: [12,41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MarkerManager({ onClick }) {
  useMapEvent('click', (e) => {
    const { lat, lng } = e.latlng;
    // Add marker to list of markers
    onClick({ lat, lng });
  })
  return null;
}

function MapClickable({ marker, radius, onMapClick }) {
  return (
    <MapContainer center={[41.8268, -71.4025]} zoom={17}>
      <MarkerManager onClick={onMapClick}/>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      { marker && <Marker position={marker} />}
      { marker && <Circle center={ [marker['lat'], marker['lng']] } radius={radius} />}
    </MapContainer>
  )
}

// Prop validation
MarkerManager.propTypes = {
  onClick: PropTypes.func.isRequired
}

MapClickable.propTypes = {
  marker: PropTypes.shape({
    'lat': PropTypes.number,
    'lng': PropTypes.number,
  }),
  radius: PropTypes.number,
  onMapClick: PropTypes.func
}

export default MapClickable;