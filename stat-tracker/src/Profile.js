import React, {useContext} from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ProfileOverview from "./ProfileOverview";
import Settings from "./Settings.js";
import { MyContext } from "./MyContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>
          <Typography component={'Children'}>{children}</Typography>
          </div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "none",
    width: "100%",
    height: "100%"
  },
}));

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const {MetaData, getMetaData} = useContext(MyContext);

  console.log("MMMMMMMM---->", MetaData);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Account Settings" {...a11yProps(1)} />
          {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
        <ProfileOverview 
          id={MetaData.data.user.id}
          birthdate={MetaData.data.user.birthdate}
          email={MetaData.data.user.email}
          gender={MetaData.data.user.gender}
          province={MetaData.data.report.province}
          region={MetaData.data.report.postal}
          status={MetaData.data.report.status}
          timestamp={MetaData.data.report.date_stamp}
          symptoms={MetaData.data.report.symptoms}
        >

        </ProfileOverview>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>          
           <Settings
            birthdate={MetaData.data.user.birthdate}
            email={MetaData.data.user.email}
            gender={MetaData.data.user.gender}
           >

           </Settings>
        </TabPanel>
        {/* <TabPanel value={value} index={2} dir={theme.direction}>
     
        </TabPanel> */}

      </SwipeableViews>
    </div>
  );
}
