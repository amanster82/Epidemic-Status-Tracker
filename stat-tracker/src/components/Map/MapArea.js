import React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
//import { Icon } from "leaflet";
import "./MapStyle.css";

function MapArea(props) {
  const coordinates = props.coordinates
  console.log(coordinates);
    return (
    <Map center={[coordinates[0], coordinates[1]]} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </Map>
  );
}

export default MapArea;
