import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './Maps.css'

import { PointRenderer } from './PointRenderer';
import { FlyToRenderer } from './FlyToRenderer';

export const MapRenderer = (props) => {
  const { points, flyTo } = props;
  return (
    <MapContainer
      center={[51, 2]}
      zoom={12}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToRenderer flyTo={flyTo}/>
      <PointRenderer features={points}/>
    </MapContainer>
  );
};
