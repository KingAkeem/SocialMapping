import React, { useState } from 'react';
import { useAsync } from 'react-async';
import { LoadingButton } from '@mui/lab';
import { Search } from '@mui/icons-material';
import { TextField } from '@mui/material';

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

const isDistanceValid = distance =>isNaN(parseFloat(distance)) || parseFloat(distance) < 0;
export const LocationSearch = (props)  => {
  const [address, setAddress] = useState(props.location); 
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
};
