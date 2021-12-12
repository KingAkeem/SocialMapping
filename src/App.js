import './App.css';
import { MapRenderer } from './map/MapRenderer';
import { Public, Close } from '@mui/icons-material';
import { Drawer, IconButton, ListSubheader, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';

function App() {
  const [ menuOpen, setMenuOpen ] = useState(true);

  return (
    <div className="App">
      <Drawer open={menuOpen} variant="persistent">
        <List>
          <ListSubheader inset={true}>
            Main Menu <IconButton onClick={() => setMenuOpen(false)}><Close/></IconButton>
          </ListSubheader>
          <ListItem>
            <ListItemButton selected={true}>
              <ListItemIcon>
                <Public/>
              </ListItemIcon>
              <ListItemText primary="Locate Tweets"/>
            </ListItemButton>
          </ListItem>	
        </List>
      </Drawer>
      <MapRenderer/>
    </div>
  );
}

export default App;
