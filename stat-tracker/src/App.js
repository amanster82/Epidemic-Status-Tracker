import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import External from './External';
import Report from './Report';
import Dashboard from './Dashboard';
import axios from "axios";
import { MyContext } from "./MyContext";
import CircularProgress from '@material-ui/core/CircularProgress';
import Forgot from './Forgot';
import { getBackendURL } from './util';


async function authenticate (setPage, setMetaData){
  try{
  const results = await axios.get(getBackendURL() + `/api/authentication`, { withCredentials: true })
      if(results.data.Auth){
        //alert("setting the page to true and setting the metadata to null")
        setPage(true);
        //setMetaData(null);
        getMetaData(setMetaData);
      }else{
        setPage(false);
        setMetaData(false);
      }
  }catch(error){
    console.error(error)
    setPage(false);
    setMetaData(false);
  }
};

async function getMetaData(setMetaData, changeLocation){
  try{
  const results = await axios.post(getBackendURL() + `/api/metadata`, {locationChange: changeLocation}, { withCredentials: true });
  console.log("-------------------THE METADATA HERE---------------------")
    console.log("THEEEEEEEEEEEEE REEEESSSSSUUSUUUULTTTS:", results);
    setMetaData(results);
    return(results);
  }catch{
    console.log("@@@@@@NO METADATA TO SHOW@@@@@@@@@");
    setMetaData(false); 
  }
}

function App() {
    const [Pagechange, setPage] = useState(null);
    console.log("what is the page", Pagechange);
    const [MetaData, setMetaData] = useState(null);
    console.log("what is the metadata", MetaData);

    useEffect(() =>{
      
      if(Pagechange==null && MetaData==null) {
        authenticate(setPage, setMetaData);
      }else{
        console.log("App.js Effect Done")
      } 

    });

    return (
        <MyContext.Provider value={{Pagechange, setPage, MetaData, setMetaData, getMetaData, }}>
        
        {Pagechange != null && MetaData !=null
        ?
        <BrowserRouter>
            <Route path='/' exact component={External} />
            <Route path='/self-report' exact component={Report} />
            <Route path='/Dashboard' exact component={Dashboard} /> 
            <Route path='/Forgot/:token' exact component={Forgot} /> 
            {/* <Route path='/Profile' exact component={Profile}/> */}
        </BrowserRouter>
        : <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
            }}>
            <CircularProgress></CircularProgress>
            </div>
        }
        </MyContext.Provider>
    );
}

export default App;
