import PropTypes from 'prop-types';
import L from 'leaflet';
import { MapContainer, TileLayer, useMapEvent, Marker, Popup, Circle } from 'react-leaflet';
import "leaflet/dist/leaflet.css"; // Ensure you import Leaflet's CSS

// Manually set marker image, otherwise it doesn't get shown
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: icon,
    shadowUrl: iconShadow
});

function MarkerManager({ onClick }) {
  useMapEvent('click', (e) => {
    const { lat, lng } = e.latlng;
    // Add marker to list of markers
    onClick({ lat, lng });
  })
  return null;
}

function MapClickable({ markers, selectedMarker, radius, onMapClick, onSelectMarker, onRemoveMarker }) {
  return (
    <MapContainer center={[41.8268, -71.4025]} zoom={18}>
      <MarkerManager onClick={onMapClick}/>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((latlng, index) => (
        <Marker 
          key={index} 
          position={latlng} 
          eventHandlers={{
            click: () => onSelectMarker(index),
            dblclick: () => onRemoveMarker(index)
          }}>
          <Popup>
            Marker {index + 1}
          </Popup>
        </Marker>
      ))}
      { selectedMarker && <Circle center={ [selectedMarker['lat'], selectedMarker['lng']] } radius={radius} />}
    </MapContainer>
  )
}

// Prop validation
MarkerManager.propTypes = {
  onClick: PropTypes.func.isRequired
}

MapClickable.propTypes = {
  markers: PropTypes.array,
  selectedMarker: PropTypes.shape({
    'lat': PropTypes.number,
    'lng': PropTypes.number,
  }),
  radius: PropTypes.number,
  onMapClick: PropTypes.func,
  onSelectMarker: PropTypes.func,
  onRemoveMarker: PropTypes.func
}

export default MapClickable;