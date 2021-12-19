import './App.css';
import { MapRenderer } from './map/MapRenderer';
import { Toolbar } from './map/Toolbar';
import { Public, Close } from '@mui/icons-material';
import { Drawer, IconButton, ListSubheader, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material';
import { useState } from 'react';

function App() {
  const [ menuOpen, setMenuOpen ] = useState(true);
  const [points, setPoints] = useState([]);
  const [flyTo, setFlyTo] = useState({});

  const [menuSelection, setMenuSelection] = useState('twitter');

  return (
    <div className="App">
      <Drawer open={menuOpen}>
        <List>
          <ListSubheader inset={true}>
            Main Menu <IconButton onClick={() => setMenuOpen(false)}><Close/></IconButton>
          </ListSubheader>
          <ListItem>
            <ListItemButton selected={menuSelection === 'twitter'} onClick={() => {
              setMenuSelection('twitter');
              setMenuOpen(false);
            }}>
              <ListItemIcon>
                <Public/>
              </ListItemIcon>
              <ListItemText primary="Locate Tweets"/>
            </ListItemButton>
          </ListItem>	
        </List>
      </Drawer>
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
      </div>
    </div>
  );
}

export default App;
