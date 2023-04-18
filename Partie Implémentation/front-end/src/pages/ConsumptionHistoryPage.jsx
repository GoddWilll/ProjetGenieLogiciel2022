import React, { useEffect , useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from "../api/axios";
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import{Card, Stack} from "@mui/material";
import SideMenu from '../components/SideMenu';
import TopMenu from '../components/TopMenu';


const ConsumptionHistoryPage = () => {
  
  const {id} = useParams();

  const jwt = localStorage.getItem("jwt");


  const URL2 = `http://localhost:8080/api/portfoliof/${id}/consumption`

  const readings = [
    {
    ean : "EAN1234",
    date : "12/04/23",
    value: "123",
    status :"active"
    },
    {
      ean : "EAN1234",
      date : "12/05/23",
      value: "563",
      status :"active"
  },
  {
    ean : "EAN1234",
    date : "12/06/23",
    value: "125",
    status :"active"
  }
]

  const data = [];

  
  
  useEffect(()=>{
    const response = axios.get(URL2, {
      headers : {"Content-Type":"application/json",
      "Authorization" : `Bearer ${jwt}`,
      "Access-Control-Allow-Origin":true}
      }).then(response=>{
        data = response.data;
        console.log(data);
      })
  })


  const columns = [
    {
      field:"ean", headerName : "EAN", minWidth: 100
    }, 
    {
      field:"assignment_date", headerName:"Assignment date", minWidth: 150
    }, 
    {
      field:"supplier", headerName : "Supplier",  minWidth: 100
    },
    {
      field:"id", headerName :"ID",  minWidth: 150
    }, 
    {
      field:"expiration_date", headerName:"Expiration date",  minWidth: 150
    },
    {
      field:"status", headerName:"Status", minWidth: 50
    }
  ]

  const rows = data.map((row)=>({
    ean : row.ean, 
    assignment_date : row.assignment_date, 
    supplier : row.supplier,
    id : row.id,
    expiration_date : row.expiration_date,
    status : row.status
  }))
  


  return (
    <Stack direction='row' sx={{width:"100%", height:"100%", position:'fixed'}}>
      <SideMenu/>
      <Stack sx={{display:'flex', width:"100%"}}>
        <TopMenu pageAddress={"/assignment-history"} pageName={"Assignment History"}/>
        <Card sx={{m:5, height:'100%', width:"90%"}}>
          <DataGrid 
          rows={rows} 
          columns={columns} 
          pageSize={10} 
          slots={{
            toolbar: GridToolbar,
          }}
          />
        </Card>
        
      </Stack>
    </Stack>
  )
}

export default ConsumptionHistoryPage