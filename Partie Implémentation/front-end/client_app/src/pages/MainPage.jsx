import React from 'react';
import { useState, useEffect,  forceUpdate } from "react";
import {Stack, Box, Grid, Divider, TextField} from '@mui/material';
import PortfolioPlaceHolder from '../components/PortfolioPlaceHolder';
import TopMenu from '../components/TopMenu';
import PortfolioMainGraph from '../components/PortfolioMainGraph';
import { Sidebar, Menu, MenuItem, useProSidebar} from 'react-pro-sidebar';
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ElectricMeterOutlinedIcon from '@mui/icons-material/ElectricMeterOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import {Select, FormControl, InputLabel } from '@mui/material';
import {  Link, useLocation, useNavigate} from 'react-router-dom';
import { useForceUpdate } from '../components/hooks/useForceUpdate';
import {createBrowserHistory} from "history";
import axios from "../api/axios";
import { useTranslation } from "react-i18next";
import i18next from 'i18next';

const PORTFOLIO_URL = "http://localhost:8080/api/portfolio/all";



const MainPage = () => {
    const { t } = useTranslation();

    // hardcoded const in order to test the "create portfolio message"
    const [hasSelectedPortfolio, setHasSelectedPortfolio] = useState(false);
    const [portfolio, setPortfolio] = useState("");
    const [portfolios, setPortfolios] = useState([]);
    const [data, setData] = useState({});
    const [state, setState] = useState(0);

    
    const pageAddress = "/main-page";
    const pageName = t('general_overview');

    const { collapseSidebar } = useProSidebar(); 

    const handleChange = async (e) => {
        const value = e.target.value;
        const jwt = localStorage.getItem("jwt");
        const selectedPortfolio = portfolios.find((portfolio) => portfolio.id === value);
      
        const response = await axios.get(`http://localhost:8080/api/portfolio/${value}/consumption`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`,
            "Access-Control-Allow-Origin": true
          }
        });
        setData(response.data);
        setPortfolio(selectedPortfolio.id);
        setState(state + 1);
        setHasSelectedPortfolio(true);
      };

    useEffect(()=> {
        const jwt = localStorage.getItem("jwt");
        const response = axios.get(PORTFOLIO_URL, {
            headers : {"Content-Type":"application/json",
            "Authorization" : `Bearer ${jwt}`,
            "Access-Control-Allow-Origin":true}
            }).then(response => {
                setPortfolios(response.data);
            })
        const me = axios.get("http://localhost:8080/api/client/me", {
            headers : {
                "Content-Type":"application/json",
                "Authorization" : `Bearer ${jwt}`,
                "Access-Control-Allow-Origin":true,
            }
        }).then(response=>{
            const request = axios.get(`http://localhost:8080/api/portfolio/${response.data.client.favoritePortfolioId}/consumption`, {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`,
                "Access-Control-Allow-Origin": true
              }
            }).then(request => {
                console.log(request.data);
                console.log(response.data);
                i18next.changeLanguage(response.data.client.lang);
                setData(request.data); 
                setPortfolio(response.data.client.favoritePortfolioId);
                setState(state + 1);
                setHasSelectedPortfolio(true);
            })
        })
          
    }, [])

    return (
        <Stack direction='row' sx={{width:"100%", height:"100%", position:'fixed'}}>
            <Sidebar style={{ height:"100%"}}>
                <Stack>
                    <Menu>
                        <MenuItem
                            icon= {<MenuOutlinedIcon/>}
                            onClick={() => {
                                collapseSidebar();
                            }}
                            style={{ textAlign: 'center'}}>
                        </MenuItem>

                        <MenuItem icon={<WalletOutlinedIcon/>}>
                            <Menu>
                                <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth size="small" margin="normal">
                                <InputLabel margin="normal" id="select-portfolio-label">{t('portfolio')}:</InputLabel>
                                <Select
                                    labelId="portfolio-select-label"
                                    id="portfolio-select"
                                    value={portfolio}
                                    label="Portfolio:"
                                    onChange={handleChange}
                                >
                                    {portfolios.map((portfolio) => (
                                    <MenuItem key={portfolio.id} value={portfolio.id}>
                                        {portfolio.name}
                                    </MenuItem>
                                    ))}
                                </Select>
                                </FormControl>

                                </Box>
                            </Menu>
                        </MenuItem>
                    </Menu>
                </Stack>
                <Menu>      
                    <MenuItem onClick={()=>{}}> 
                        <Divider/>
                    </MenuItem>
                    <Link to="/main-page" className='link' >
                        <MenuItem icon={<VisibilityOutlinedIcon />} onClick={()=>{}}>
                            {t('general_overview')}
                        </MenuItem>
                    </Link>
                    <Link to="/manage-portfolios" className='link'>
                        <MenuItem icon={<AccountBalanceWalletOutlinedIcon />} onClick={()=>{}}>
                            {t('manage_portfolios')}
                        </MenuItem>
                    </Link>
                    <Link to="/manage-meters" className='link'>
                        <MenuItem icon={<ElectricMeterOutlinedIcon />}>
                            {t('manage_meters')}
                        </MenuItem>
                    </Link>
                    <Link to="/manage-contracts" className='link'>
                        <MenuItem icon={<AssignmentIndOutlinedIcon />}>
                            {t('manage_contracts')}
                        </MenuItem>
                    </Link>
                </Menu>
            </Sidebar>
        <Stack sx={{display:'flex', width:"100%"}}>  
            <TopMenu pageAddress={pageAddress} pageName = {pageName}/>
            <Stack direction='row' justifyContent='center' sx={{minHeight:900}}>
                { // if the user created a portfolio, print 'Portfolio graphic', otherwise print the creation message
                // 'Portfolio graphic' replaces an actual portfolio infographic for now
                hasSelectedPortfolio ? <PortfolioMainGraph portfolio={data}/> : <PortfolioPlaceHolder/>
                }
            </Stack>
        </Stack>
    </Stack>
    );
}
  


export default MainPage

/**<FormControl fullWidth size="small" margin="normal">
                                <InputLabel margin="normal" id="select-portfolio-label">Portfolio :</InputLabel>
                                    <Select
                                    labelId="portfolio-select-label"
                                    id="portfolio-select"
                                    value={page}
                                    label="Portfolio :"
                                    onChange={handleChange}
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={1}>Portfolio 1</MenuItem>
                                    <MenuItem value={2}>Portfolio 2</MenuItem>                    
                                    </Select>
                                </FormControl> */