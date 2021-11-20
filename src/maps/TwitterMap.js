import React, { useState } from 'react';
import { MapContainer, TileLayer, MapConsumer, Popup, Marker } from 'react-leaflet';
import { Divider, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Cancel } from '@mui/icons-material';
import { useAsync } from 'react-async';
import './Maps.css'

async function getTweets(city, distance, signal) {
	/**
	 * Add validation for city (validate city actually exists and is a valid string type)
	 * Add validation for distance (validate distance is actually a positive number within a reasonable limit)
	 */
	const response = await fetch(`http://localhost:5000/search/tweets?city=${city}&distance=${distance}`, { signal });
	return await response.json();
}

function TweetRenderer(props) {
	return (
		<>
			{props.tweets.length && props.tweets.filter(tweet => tweet.place && tweet.place.coordinates && tweet.place.coordinates.length === 2).map((tweet, index) => {
				return (
					<Marker key={index} position={tweet.place.coordinates}>
						<Popup>
							{Object.keys(tweet).filter(key => typeof tweet[key] === 'string').map(key => {
								return  ( <> <b>{key.toUpperCase()}</b> {tweet[key]} <br/> </>);
							})}
						</Popup>
					</Marker>
				);
			})}
		</>
	)
}

function TweetSearch(props)  {

	const [address, setAddress] = useState(props.address); 
	const [addressErr, setAddressErr] = useState("");

	const [distance, setDistance] = useState(props.distance);

	const { run: search, isPending, cancel } = useAsync({
		deferFn: ([city, distance], {signal}) => getTweets(city, distance, signal),
		onResolve: (tweetResponse) => {
			const {origin, tweets} = tweetResponse;
			setAddressErr("");
			props.onSearch({ origin, tweets });
			
		},
		onReject: (error) => {
			setAddressErr("Invalid address found.");
		}
	});

	const handleSearch = () => {
		if (isDistanceValid(distance)) return;
		search(address, distance);
	};

	return (
		<>
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
			<Divider orientation="vertical"/>
			<LoadingButton onClick={handleSearch} loading={isPending} loadingIndicator='Searching...'>Search</LoadingButton>
			{isPending && <IconButton onClick={() => cancel()}><Cancel/></IconButton>}
		</>
	);
}
const isDistanceValid = distance =>isNaN(parseFloat(distance)) || parseFloat(distance) < 0;

function TwitterMap(props) {
	const [tweets, setTweets] = useState([]);
	const [origin, setOrigin] = useState({});

	return (
		<div id='mapcontainer'>
			<TweetSearch
				address={props.address}
				distance={props.distance}
				onSearch={({origin, tweets})  => {
					setTweets(tweets);
					setOrigin(origin);
				}}
			/>
			<br/>
			<MapContainer center={[51, 2]} zoom={12}>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<MapConsumer>
					{(map) => {
						if (origin.hasOwnProperty('latitude') && origin.hasOwnProperty('longitude')) {
							map.flyTo([origin['latitude'], origin['longitude']]);
						}
						return null;
					}}
				</MapConsumer>
				<TweetRenderer tweets={tweets}/>
			</MapContainer>
		</div>
	);

}

export default TwitterMap;