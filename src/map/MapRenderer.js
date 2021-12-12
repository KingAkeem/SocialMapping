import React, { useState } from 'react';
import { MapContainer, TileLayer, Popup, Marker, MapConsumer } from 'react-leaflet';
import {  TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Search } from '@mui/icons-material';
import { useAsync } from 'react-async';
import './Maps.css'

async function getTweets(city, distance, signal) {
	/**
	 * Add validation for city (validate city actually exists and is a valid string type)
	 * Add validation for distance (validate distance is actually a positive number within a reasonable limit)
	 */
	const response = await fetch(`http://localhost:5000/search/tweets?city=${city}&distance=${distance}`, { signal });
  const {origin, tweets} = await response.json();
  return {origin, tweets: tweets.map(tweet => {
    tweet.originType = 'twitter';
    return tweet;
  })};
}

const isValidOrigin = (origin) => {
	return origin.hasOwnProperty('latitude') && origin.hasOwnProperty('longitude');
};


const filterPoint = (point) => {
  switch (point.originType) {
    case 'twitter':
      return point.place && point.place.coordinates && point.place.coordinates.length === 2;
    default:
      return false;
  }
};

const FlyToRenderer = (props) => {
  const { flyTo } = props;
  return (
    <MapConsumer>
      {(map) => {
        if (map && isValidOrigin(flyTo)) {
          const position = [flyTo.latitude, flyTo.longitude]; 
          map.flyTo(position);
        }
        return null;
      }}
    </MapConsumer>
  )
}

const PointRenderer = (props) => {
	const { points } = props;

	return (
		<>
			{points.length && points.filter(point => filterPoint(point)).map((point, index) => {
				return (
					<Marker key={index} position={point.place.coordinates}>
						<Popup>
							{Object.keys(point).filter(key => typeof point[key] === 'string').map(key => {
								return  ( <div key={key}> <b>{key.toUpperCase()}</b> {point[key]} <br/> </div>);
							})}
						</Popup>
					</Marker>
				);
			})}
		</>
	)
}


const isDistanceValid = distance =>isNaN(parseFloat(distance)) || parseFloat(distance) < 0;
const LocationSearch = (props)  => {
	const [address, setAddress] = useState(props.address); 
	const [addressErr, setAddressErr] = useState("");

	const [distance, setDistance] = useState(props.distance);

	const { run: search, isPending } = useAsync({
		deferFn: ([city, distance], {signal}) => getTweets(city, distance, signal),
		onResolve: (tweetResponse) => {
			const {origin, tweets} = tweetResponse;
			setAddressErr("");
			props.onSearch({ origin, points: tweets });
			
		},
		onReject: (error) => {
			setAddressErr("Invalid address found.");
      console.error(error);
		}
	});

	const handleSearch = () => {
		if (isDistanceValid(distance)) return;
		search(address, distance);
	};

	return (
		<div style={{ height: '10vh', marginTop: '1rem'}}>
			<TextField
				label='Address'
				error={addressErr !== ""}
				helperText={addressErr}
				onChange={(event) => setAddress(event.target.value)}
			/>
			<TextField
				label='Distance (in miles)'
				type='number'
				error={isDistanceValid(distance)}
				helperText={isDistanceValid(distance) ? "Distance must be a positive float." : ""}
				onChange={(event) => setDistance(event.target.value)}
			/>
      <LoadingButton
        onClick={handleSearch}
        loading={isPending}
        endIcon={<Search/>}
        loadingPosiition="end">
          Search
        </LoadingButton>
		</div>
	);
}

const MapRenderer = (props) => {
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
        <PointRenderer points={points}/>
			</MapContainer>
		</div>
	);

};

export { MapRenderer };