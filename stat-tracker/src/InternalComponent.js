import React from 'react';
import { Button } from '@material-ui/core';

function InternalComponent(props) {
    return (
        <div style={{ flexDirection: "column", height: "100%", display: "flex", alignItems: "center", justifyContent:"center"}}>
        <div><h1>{props.title}</h1></div>
        <Button variant='contained' onClick={()=>props.action()}>Change the result</Button>
      </div>
    );
}

export default InternalComponent;