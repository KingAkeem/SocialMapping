import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './Maps.css'

import { PointRenderer } from './PointRenderer';
import { FlyToRenderer } from './FlyToRenderer';
import { LocationSearch } from './LocationSearch';

export const MapRenderer = (props) => {
  const [points, setPoints] = useState([]);
  const [flyTo, setFlyTo] = useState({});

  return (
    <div className='mapcontainer'>
      <LocationSearch
        location={props.location}
        distance={props.distance}
        onSearch={(searchResponse) => {
          setPoints(searchResponse.points);
          setFlyTo(searchResponse.origin);
        }}
      />
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
    </div>
  );
};
