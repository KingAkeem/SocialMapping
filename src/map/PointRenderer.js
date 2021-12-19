import { Popup, Marker } from 'react-leaflet';

export const PointRenderer = (props) => {
  const { features } = props;
  return (
    <>
      {features && features.length && features.map((feature, index) => {
        return (
          <Marker key={index} position={feature.geometry.coordinates}>
            <Popup>
              {Object.keys(feature.properties).filter(key => typeof feature.properties[key] === 'string').map(key => {
                return ( <div key={key}> <b>{key.toUpperCase()}</b> {feature.properties[key]} <br/> </div>);
              })}
            </Popup>
          </Marker>
        );
      })}
    </>
  )
};
