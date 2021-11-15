import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, Marker, useMap } from 'react-leaflet';
import { TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAsync } from 'react-async';
import './Maps.css'

async function getTweets(city, distance) {
	/**
	 * Add validation for city (validate city actually exists and is a valid string type)
	 * Add validation for distance (validate distance is actually a positive number within a reasonable limit)
	 */
	console.log(distance)
	const response = await fetch(`http://localhost:5000/search/tweets?city=${city}&distance=${distance}`);
	return response.json();
}

function TweetRenderer(props) {
	const map = useMap();
	const hasValidOrigin = props.origin.hasOwnProperty('latitude') && props.origin.hasOwnProperty('longitude');
	useEffect(() => {
		if (hasValidOrigin) {
			map.flyTo([props.origin['latitude'], props.origin['longitude']]);
		}
	}, [map, props.origin, hasValidOrigin]);

	return (
		<>
			{hasValidOrigin && 
				<Marker position={[props.origin['latitude'], props.origin['longitude']]}>
					<Popup>
						Origin of {props.city}
					</Popup>
				</Marker>
			}
			{props.tweets.length && props.tweets.filter(tweet => tweet.place && tweet.place.coordinates && tweet.place.coordinates.length === 2).map((tweet, index) => {
				return (
					<Marker key={index} position={tweet.place.coordinates}>
						<Popup>
							<b>Username:</b> {tweet.username}
							<br/>
							<b>Name:</b> {tweet.name}
							<br/>
							<b>Tweet:</b> {tweet.tweet}
						</Popup>
					</Marker>
				);
			})}
		</>
	)
}

function TwitterMap(props) {
	const [city, setCity] = useState(props.city); 
	const [distance, setDistance] = useState(props.distance);
	const [origin, setOrigin] = useState({});
	const [tweets, setTweets] = useState([]);

	const { run, isPending } = useAsync({
		deferFn: ([city, distance]) => getTweets(city, distance),
		onResolve: (tweetResponse) => {
			const {origin, tweets} = tweetResponse;
			setOrigin(origin);
			setTweets(tweets);
			
		},
	});


	return (
		<div id='mapcontainer'>
			<br/>
			<TextField label='City' onChange={(event) => setCity(event.target.value)}/>
			<TextField type='number' label='Distance' onChange={(event) => setDistance(event.target.value)}/>
			<LoadingButton onClick={() => run(city, distance)} loading={isPending} loadingIndicator='Searching...'>Search</LoadingButton>
			<MapContainer center={[51, 2]} zoom={12}>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<TweetRenderer city={city} origin={origin} tweets={tweets}/>
			</MapContainer>
		</div>
	);

}

export default TwitterMap;