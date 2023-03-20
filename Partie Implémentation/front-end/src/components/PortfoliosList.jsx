import React, { useState } from 'react'
import { Box, Stack, Grid, List, ListItem, ListItemButton, IconButton, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FixedSizeList} from 'react-window';

const PortfoliosList = () => {
  const [portfolios, setPortfolios] = useState({});
  
  return (
    <Box sx={{height:'100%', width:'100%'}} alignment='center'>
      <List style={{maxHeight: '100%', overflow: 'auto'}}>
        {generate(
          <ListItem>
            <ListItemButton 
              textAlign='center'
              style={{backgroundColor:"#fff"}}>
              <ListItemText 
                primary="Bouton test" 
                className='list-button'/>
            </ListItemButton>
            <IconButton>
              <DeleteIcon/>
            </IconButton>
          </ListItem>
        )}
      </List>
    </Box>
  )
}

export default PortfoliosList