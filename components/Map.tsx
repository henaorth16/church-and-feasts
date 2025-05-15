"use client"
import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DefaultIcon } from '@/lib/leaflet-icon'; // your custom file
import { LocateIcon } from 'lucide-react';

export default function Map({ latitude, longitude }: { latitude: number, longitude: number }) {
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>marker</Popup>
      </Marker>
    </MapContainer>
  );
}
