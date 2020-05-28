import React, { useContext } from "react";
import { Map, Marker, Popup, TileLayer, Rectangle } from "react-leaflet";
import { MyContext } from "../../MyContext";
import { Icon } from "leaflet";
import "./MapStyle.css";

function MapArea(props) {
  const coordinates = props.coordinates;
  const boundingBox = [props.boundingBox[0], props.boundingBox[2], props.boundingBox[1], props.boundingBox[3]];
  console.log("bounding box", boundingBox)
  const { MetaData } = useContext(MyContext);
  const greenIcon = new Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const blueIcon = new Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const yellowIcon = new Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const redIcon = new Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  console.log(coordinates);
  console.log("-----------------in the Map---------------");
  console.log(MetaData);

  function iconCheck(status) {
    if (status == "-") return greenIcon;
    else if (status == "+") return redIcon;
    else if (status == "=") return blueIcon;
    else return blueIcon;
  }

  function popUpInfo(status, date_stamp) {
    switch(status){
      case "+":
        status = 'positive'
        return (
          <div>
            <strong>Status</strong>:{status}
            <br></br>
            <strong>Reported on</strong>:{date_stamp}
          </div>
        );
      case "-":
        status = 'negative'
        return (
          <div>
            <strong>Status</strong>:{status}
            <br></br>
            <strong>Reported on</strong>:{date_stamp}
          </div>
        );
      case "=":
        status = "recovered"
        return (
          <div>
            <strong>Status</strong>:{status}
            <br></br>
            <strong>Reported on</strong>:{date_stamp}
          </div>
        );
      case "s":
        status = "possible case"
        return (
          <div>
            <strong>Status</strong>:{status}
            <br></br>
            <strong>Reported on</strong>:{date_stamp}
          </div>
        );
    }
  }

  return (
    <Map center={[coordinates[0], coordinates[1]]} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {MetaData.data.locations.map((pinpoint, index) => {
        console.log("this is the pinpoint", pinpoint);
        console.log("and the index", index);
        console.log(pinpoint.status);
        return (
          <>
            <Marker
              key={index}
              position={[pinpoint.lat, pinpoint.long]}
              icon={iconCheck(pinpoint.status)}
            >
              <Popup>{popUpInfo(pinpoint.status, pinpoint.date_stamp)}</Popup>
            </Marker>
          </>
        );
      })}
    </Map>
  );
}

export default MapArea;
