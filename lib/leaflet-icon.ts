// lib/leaflet-icon.ts
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// @ts-ignore
import iconUrl from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

export const DefaultIcon = L.icon({
  iconUrl: iconUrl.toString(),
  iconRetinaUrl: iconRetinaUrl.toString(),
  shadowUrl: shadowUrl.toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
