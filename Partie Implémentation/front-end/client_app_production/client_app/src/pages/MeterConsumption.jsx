import {React, useState} from 'react';
import axios from "../api/axios";
import {Card, Stack, Button, TextField, InputAdornment, IconButton, Snackbar, Alert} from "@mui/material";
import { useNavigate, Link , useLocation} from 'react-router-dom';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TopMenu from '../components/TopMenu';
import SideMenu from '../components/SideMenu';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from 'react-i18next';
 
const URL = "http://localhost:8080/api/meter/";

const MeterConsumption = () => {
  const {t} = useTranslation();
  const location = useLocation();
  const pageAddress = "/enter-consumption";
  const pageName = t('enter_meter_consumption');
  const current_date = new Date();
  let day = current_date.getDate();
  let month = current_date.getMonth()+1;
  let year = current_date.getFullYear();
  const [selectedDate, setSelectedDate] = useState(dayjs(`${year}-${month}-${day}`));
  const [value, setValue] = useState("");
  const [dayValue, setDayValue] = useState("");
  const [nightValue, setNightValue] = useState("");
  const meter_ean = location.state.ean; 
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);

  const [dateError, setDateError] = useState(false);

  console.log(location.state)

  const cancel = () => {
    navigate("/manage-meters");
  }

  console.log(selectedDate > dayjs(`${year}-${month}-${day}`))
  
  const submit = () => {
    const jwt = localStorage.getItem("jwt");
    
    if (selectedDate > dayjs(`${year}-${month}-${day}`)) {
      setDateError(true);
      return;
    }
   
    if (location.state.hourType === "SIMPLE") {
      const data = {
        EAN : meter_ean,
        date : (selectedDate.$y).toString()  +'-'+ (selectedDate.$M +1 ).toString().padStart(2, '0') + '-'+ (selectedDate.$D).toString().padStart(2, '0') , 
        value : value,
      }

      try {
        
        const response = axios.post(URL + `${meter_ean}` + "/reading", null, {
          headers : {"Content-Type":"application/json",
        "Authorization" : `Bearer ${jwt}`,
        "Access-Control-Allow-Origin":true}
        , params:{ 
          date : data.date, 
          value : data.value,
          overwrite : true
        }}).then(response=>{
          setSuccess(true);
          setTimeout(()=>{
            navigate(-1);
          }, 3000)
          
        })
      } catch(err){
        console.log(err);
      }
    } else {
      const data = {
        EAN : meter_ean,
        date : (selectedDate.$y).toString()  +'-'+ (selectedDate.$M +1 ).toString().padStart(2, '0') + '-'+ (selectedDate.$D).toString().padStart(2, '0') , 
        dayValue : dayValue,
        nightValue : nightValue
      }
      try {
        const response = axios.post(URL + `${meter_ean}` + "/reading/double", null, {
          headers : {"Content-Type":"application/json",
        "Authorization" : `Bearer ${jwt}`,
        "Access-Control-Allow-Origin":true}
        , params:{
          EAN : data.meter_ean, 
          date : data.date, 
          dayValue : data.dayValue,
          nightValue : data.nightValue,
          overwrite : true
        }}).then(response=>{
          setSuccess(true);
          setTimeout(()=>{
            navigate(-1);
          }, 3000)
          
        })
      } catch (err){

      }
    }
  }
  
  const handleKeyDown = (event) => {
    if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-' || event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }

  return (
    <Stack direction='row' sx={{width:"100%", height:"100%", position:'fixed'}}>
      <SideMenu/>
      <Stack sx={{display:'flex', width:"100%"}} alignItems='center'>
        <TopMenu pageAddress={pageAddress} pageName={pageName}/>    
        <Stack>
          <IconButton sx={{m:1}} onClick={() => navigate(-1)}> 
            <ArrowBackIcon/>
            <div>{t('back')}</div>
          </IconButton>
          <Button variant='outlined' sx={{m:1}}>{`${meter_ean}`}</Button>
            <Stack> 
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker sx={{m:1}} label={t('select_date')} value={selectedDate} onChange={(newDate) => setSelectedDate(newDate)} />
              </LocalizationProvider>
            </Stack>
            <Stack>
              {location.state.hourType === "SIMPLE" ? <TextField sx={{m:1}} type="number"  onKeyDown={handleKeyDown} label={t('enter_meter_consumption')} onChange={(event)=> {
                setValue(event.target.value);
              }} InputProps={{
                endAdornment: <InputAdornment position="end">{location.state.energyType === "ELEC" ? 'kWh' : 'm3'}</InputAdornment>
              }}/>: <Stack>
                <TextField sx={{m:1}} type="number" onKeyDown={handleKeyDown} label={t('enter_day_consumption')} onChange={(event)=> {
                setDayValue(event.target.value);
              }} InputProps={{
                endAdornment: <InputAdornment position="end">kWh</InputAdornment>
              }}/>
              <TextField sx={{m:1}} type="number"  onKeyDown={handleKeyDown} label={t('enter_night_consumption')} onChange={(event)=> {
                setNightValue(event.target.value);
              }} InputProps={{
                endAdornment: <InputAdornment position="end">kWh</InputAdornment>
              }}/>
                </Stack> }
            </Stack>
            <Button sx={{m:1}} onClick={submit}>
              {t('confirm_data')}
            </Button>
            <Button sx={{m:1}} onClick={cancel}>
              {t('cancel')}
            </Button>
        </Stack>
      </Stack>
      <Snackbar open={success} autoHideDuration={3000} onClose={()=>setSuccess(false)}>
        <Alert severity="success">{t('request_success')}</Alert>
      </Snackbar>
      <Snackbar open={dateError} autoHideDuration={6000} onClose={()=>setDateError(false)}>
        <Alert severity="error">{t('date_error')}</Alert>
      </Snackbar>
    </Stack>
  );
}

export default MeterConsumption;