import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import External from './External';
import Report from './Report';
import Dashboard from './Dashboard';
import axios from "axios";
import { MyContext } from "./MyContext";
import CircularProgress from '@material-ui/core/CircularProgress';


function authenticate (setPage){
  let url = window.location.href;
  url = url.split(":");
  url = url[0] + ":" + url[1];
  console.log(url);
  axios
    .get(url + `:9000/api/authentication`, { withCredentials: true })
    .then(function (res) {
      if(res.data.Auth){
        setPage(true)
      }else{
        setPage(false)
      }
    });
};

function App() {
    const [Pagechange, setPage] = useState(null);
    useEffect(()=>{
      (Pagechange==null ? authenticate(setPage) : console.log("App.js Effect Done"))
    });

    return (
        <MyContext.Provider value={{Pagechange, setPage}}>
        
        {Pagechange != null
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