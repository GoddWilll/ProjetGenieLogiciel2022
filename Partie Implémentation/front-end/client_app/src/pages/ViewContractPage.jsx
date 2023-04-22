import React from 'react'
import TopMenu from '../components/TopMenu'
import SideMenu from '../components/SideMenu'
import {Stack, Box, Typography, IconButton} from '@mui/material'
import {useLocation} from 'react-router-dom'
import axios from '../api/axios'
import  ArrowBackIcon  from '@mui/icons-material/ArrowBack'

const ViewContractPage = () => {
  const pageAddress = "/view-contract";
  const pageName = "View Contract";
  const location = useLocation();
  const jwt = localStorage.getItem('jwt')
  const [address, setAddress] = React.useState('')
  const [meter, setMeter] = React.useState({})

  console.log(location.state);

  React.useEffect(()=> {
    let temp_meter = {}

    const response = axios.get("http://localhost:8080/api/meter/all", {
      headers: {
        "Content-Type":"application/json",
        "Authorization" : `Bearer ${jwt}`,
        "Access-Control-Allow-Origin":true
      }
    }).then(response => {
      console.log(response.data)
      response.data.map(meter => {
        if (meter.ean === location.state.ean)
          setAddress(meter.address)
          setMeter(meter);
          temp_meter = meter;
          const request = axios.get("http://localhost:8080/api/contract/offers", {
            headers: {
              "Content-Type":"application/json",
              "Authorization" : `Bearer ${jwt}`,
              "Access-Control-Allow-Origin":true
            }, params : {
              hourType : temp_meter.hourType,
              energyType : temp_meter.energyType,
              address : temp_meter.address,
            }
          }).then(request => {
            console.log(request.data)
          } )
        })
      })
    }, [])


    


  return (
    <Stack direction='row' sx={{width:"100%", height:"100%", position:'fixed'}}>
      <SideMenu/>
      <Stack sx={{display:'flex', width:"100%"}} alignItems='center'>
        <TopMenu pageAddress={pageAddress} pageName={pageName}/>
        <Box sx={{width:"80%", m:5, borderRadius:'16px', backgroundColor:'white'}}>
          <Stack textAlign='center'>
            <IconButton>
              <ArrowBackIcon/>
            </IconButton>
            <Box sx={{m:2, backgroundColor:'#9bcc6c', borderRadius:'16px'}}>
              <Typography variant='h4' sx={{mr:5, mt:1.5}} style={{whiteSpace:'nowrap'}}>
                Contract  #{location.state.id}
              </Typography>
            </Box>
            <Box sx={{m:2}}>
              <Stack textAlign={'center'}>
                <Typography variant='h5' sx={{mr:5, mt:1.5}} style={{whiteSpace:'nowrap'}}>
                  <strong>Begin Date :</strong> {location.state.beginDate}
                </Typography>
                <Typography variant='h5' sx={{mr:5, mt:1.5}} style={{whiteSpace:'nowrap'}}>
                  <strong>End Date :</strong> {location.state.endDate}
                </Typography>
                <Typography variant='h5' sx={{mr:5, mt:1.5}} style={{whiteSpace:'nowrap'}}>
                  <strong>Offer :</strong> {location.state.offerId}
                </Typography>
                <Typography variant='h4' sx={{mr:5, mt:1.5}} style={{whiteSpace:'nowrap'}}>
                  <strong>Technical characteristics</strong>
                </Typography>
                <Typography variant='h5' sx={{mr:5, mt:1.5}} style={{whiteSpace:'nowrap'}}>
                  <strong>EAN :</strong> {location.state.ean}
                </Typography>
                <Typography variant='h5' sx={{mr:5, mt:1.5}} style={{whiteSpace:'nowrap'}}>
                  <strong>Address :</strong> {address}
                </Typography>
                <Typography variant='h5' sx={{mr:5, mt:1.5}} style={{whiteSpace:'nowrap'}}>
                  <strong>Energy type :</strong> {meter.energyType === 'ELEC' ? 'Electricity' : meter.energyType === 'GAS' ? 'Gas' : meter.energyType === 'WATER' ? 'Water' : 'Gas and electricity'}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  )
}

export default ViewContractPage