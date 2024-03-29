import {React, useState, useEffect} from 'react'
import SideMenu from '../components/SideMenu';
import {Stack,Card, Box, Grid, Button, ThemeProvider, createTheme, List, ListItem, ListItemButton, IconButton, ListItemText} from '@mui/material';
import logo from '../resources/logo.png';
import AccountMenu from '../components/AccountMenu';
import TopMenu from '../components/TopMenu';
import {Link, useNavigate} from 'react-router-dom';

import axios from "../api/axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PortfoliosList2 from '../components/portfolio/PortfoliosList2';
import { useTranslation } from 'react-i18next';

const theme = createTheme({
  palette: {
    primary: {
      main: "#9bcc6c",
      contrastText: '#fff'
    }, 
    secondary: {
      main: "#000",
      contrastText: '#000000'
    }
  }
});

const PORTFOLIO_URL = "http://localhost:8080/api/portfolio/all";


const ManagePortfolios = () => {
  const {t} = useTranslation();
  const  navigate = useNavigate();
  const [portfolios, setPortfolios] =  useState([]);
  useEffect(()=> {
    // getting the jwt
    const jwt = localStorage.getItem("jwt");
  
    const response = axios.get(PORTFOLIO_URL, {
    headers : {"Content-Type":"application/json",
    "Authorization" : `Bearer ${jwt}`,
    "Access-Control-Allow-Origin":true}
    }).then(response=>{
    setPortfolios(response.data);
    });
  }, [])

  function handleArrowButton(){
    setSelectedId("");
  }


  const [selectedId, setSelectedId] = useState("");

  const [childPortfolio, setChildPortfolio] = useState();

  const handleClick = (id) => {
    portfolios.map(portfolio => {
      if (portfolio.id === id){
        setChildPortfolio(portfolio);
      }
    })
    setSelectedId(id);
  }

  const [state, setState] = useState(1);
  
  const pageAddress = "/manage-portfolios";
  const pageName = t('manage_portfolios');
  return (
    <Stack direction='row' sx={{width:"100%", height:"100%", position:'fixed'}}>
      <SideMenu/>
      <Stack sx={{display:'flex', width:"100%"}}>
        <TopMenu pageAddress={pageAddress} pageName={pageName}/>   
          <Grid align='center'>
          <Card sx={{width:'40%', m:2, height:'60%'}}>
          <PortfoliosList2/>
        </Card>
        <ThemeProvider theme={theme}>
          <Link to='/create-portfolio' className='link-3' style={{display: 'inline-block', mt:2, width:'40%', mb:5}}>
            <Button  variant='outlined' color='secondary' sx={{mt:2, width:'100%', mb:5}}>
              {t('create_portfolio')}
            </Button>
          </Link>
        </ThemeProvider> </Grid>
      </Stack>
      
    </Stack>
  );
}

export default ManagePortfolios