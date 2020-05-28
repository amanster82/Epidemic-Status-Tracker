import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import External from './External';
import Report from './Report';
import Dashboard from './Dashboard';
import axios from "axios";
import { MyContext } from "./MyContext";
import CircularProgress from '@material-ui/core/CircularProgress';


function authenticate (setPage, setMetaData){
  let url = window.location.href;
  url = url.split(":");
  url = url[0] + ":" + url[1];
  console.log(url);
  axios
    .get(url + `:9000/api/authentication`, { withCredentials: true })
    .then(function (res) {
      if(res.data.Auth){
        //alert("setting the page to true and setting the metadata to null")
        setPage(true);
        //setMetaData(null);
      }else{
        setPage(false);
        setMetaData(false);
      }
    });
};

async function getMetaData(setMetaData){
  let url = window.location.href;
  url = url.split(":");
  url = url[0] + ":" + url[1];
  console.log(url);  
  try{
  const results = await axios.get(url + `:9000/api/metadata`, { withCredentials: true });
  console.log("-------------------THE METADATA HERE---------------------")
    console.log(results);
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
      
      if(Pagechange==null || MetaData==null) {
        authenticate(setPage, setMetaData);
        getMetaData(setMetaData);
      }else{
        console.log("App.js Effect Done")
      } 

    });

    return (
        <MyContext.Provider value={{Pagechange, setPage, MetaData, setMetaData, getMetaData}}>
        
        {Pagechange != null && MetaData !=null
        ?
        <BrowserRouter>
            <Route path='/' exact component={External} />
            <Route path='/self-report' exact component={Report} />
            <Route path='/Dashboard' exact component={Dashboard} />  
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