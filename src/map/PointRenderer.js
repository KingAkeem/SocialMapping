import { Popup, Marker } from 'react-leaflet';

const filterPoint = (point) => {
  switch (point.originType) {
    case 'twitter':
      return point.place && point.place.coordinates && point.place.coordinates.length === 2;
    default:
      return false;
  }
};

export const PointRenderer = (props) => {
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
};
