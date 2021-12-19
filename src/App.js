import './App.css';
import { MapRenderer } from './map/MapRenderer';
import { Toolbar } from './map/Toolbar';
import { Public, Close } from '@mui/icons-material';
import { Drawer, IconButton, ListSubheader, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';


function App() {
  const [ menuOpen, setMenuOpen ] = useState(true);
  const [points, setPoints] = useState([]);
  const [flyTo, setFlyTo] = useState({});

  const [menuSelection, setMenuSelection] = useState('map');

  const columnFields = points.length ? [...Object.keys(points[0].properties).values()] : [];
  const columns = columnFields.map(field => {
    return {
      field,
      headerName: field.toUpperCase(),
      width: 150,
    };
  });

  return (
    <div className="App">
      <Drawer open={menuOpen}>
        <List>
          <ListSubheader inset={true}>
            Main Menu <IconButton onClick={() => setMenuOpen(false)}><Close/></IconButton>
          </ListSubheader>
          <ListItem>
            <ListItemButton selected={menuSelection === 'map'} onClick={() => {
              setMenuSelection('map');
              setMenuOpen(false);
            }}>
              <ListItemIcon>
                <Public/>
              </ListItemIcon>
              <ListItemText primary="View Map"/>
            </ListItemButton>
          </ListItem>	
          <ListItem>
            <ListItemButton selected={menuSelection === 'archive'} onClick={() => {
              setMenuSelection('archive');
              setMenuOpen(false);
            }}>
              <ListItemIcon>
                <Public/>
              </ListItemIcon>
              <ListItemText primary="View Archive"/>
            </ListItemButton>
          </ListItem>	
        </List>
      </Drawer>
      {menuSelection === 'archive' &&
        <div style={{height: '53rem', width: '100%'}}>
          <Toolbar
            onMenuClick={() => {
              setMenuOpen(true);
            }}
            location={""}
            distance={1}
            onSearch={(searchResponse) => {
              setPoints(searchResponse.features);
              setFlyTo(searchResponse.origin);
            }}
          />
          <DataGrid columns={columns} rows={points.map(point => point.properties)}/>
        </div>}
      {menuSelection === 'map' &&
        <div className='mapcontainer'>
          <Toolbar
            onMenuClick={() => {
              setMenuOpen(true);
            }}
            location={""}
            distance={1}
            onSearch={(searchResponse) => {
              setPoints(searchResponse.features);
              setFlyTo(searchResponse.origin);
            }}
          />
          <MapRenderer points={points} flyTo={flyTo}/>
        </div>}
    </div>
  );
}

export default App;
