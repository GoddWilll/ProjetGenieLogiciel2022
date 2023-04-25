import React from 'react'
import SideMenu from '../components/SideMenu';
import {createTheme, Button, styled , alpha, Typography, Stack, Card, Box, Grid, Divider, TextField, ThemeProvider} from '@mui/material';
import logo from '../resources/logo.png';
import AccountMenu from '../components/AccountMenu';
import PortfolioPlaceHolder from '../components/PortfolioPlaceHolder';
import { Link, NavLink , useNavigate} from "react-router-dom";
import TopMenu from '../components/TopMenu';
import { useTranslation } from 'react-i18next';

 // Styling part

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


const NewPasswordSuccess = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  setTimeout(()=>{
    navigate('/login');
  }, 3000);

  // code part
  return (
    <Grid container
    spacing={0}
    direction="column"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: '100vh', margin:'auto' }}>
      <Grid item xs={12} width={400} >
        <Card sx={{height: 'auto', boxShadow:'5px 5px 5px #9bcc6c', pb:2}}>
          <Stack alignItems='center'>
            <img className='login-logo' src={logo} alt='logo' width={70} height={70}/>
            <Typography sx={{textAlign:'center'}} className='typo' variant="h4">{t('pass_change_success')}</Typography>
            <ThemeProvider theme={theme}>
              <Link to='/login' className='link-4' style={{display: 'inline-block', mt:2, width:'80%', mb:5}}>
                <Button variant='contained' color='primary' sx={{mt:2, width:'100%', mb:3}}>{t('welcome')}</Button>
              </Link>
            </ThemeProvider>
            <Link className='link-2' to='/login'>
              <Typography variant="h7" >{t('redirect')}</Typography>
            </Link>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  )
}

export default NewPasswordSuccess