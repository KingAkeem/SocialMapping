import { MapConsumer } from "react-leaflet";

const isValidOrigin = origin => origin.hasOwnProperty('latitude') && origin.hasOwnProperty('longitude');

export const FlyToRenderer = (props) => {
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
};
