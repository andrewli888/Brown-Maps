import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Ensure you import Leaflet's CSS

const brownLatLong = [41.8268, -71.4025];

function InteractiveMap() {
  return (
    <MapContainer center={brownLatLong} zoom={16} >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}

export default InteractiveMap;