import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "@mui/material/Checkbox";
import LaunchIcon from "@mui/icons-material/Launch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import Popover from "@mui/material/Popover";
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { CompareAction } from "../../state/compare-reducer";
import { CompareContext } from "../../state/compare-context";

export const Compare = () => {
  const [checked, setChecked] = useState(true);
  const [flightData, setFlightData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [expandSecond, setExpandSecond] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const { compareState, compareDispatch } = useContext(CompareContext);

  function addCompare(ppn) {
    console.log(ppn);
    const compareExist = compareState.compare.find((x) => x.ppn === ppn);

    const item = { ppn: ppn, isChecked: true };

    if (!compareExist) {
      compareDispatch({
        type: CompareAction.ADD,
        compare: item,
      });
    } else {
      compareDispatch({
        type: CompareAction.REMOVE,
        compare: item,
      });
    }
  }

  console.log(compareState.compare);
  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemId(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  const handleExpand = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const handleExpandSecond = (event, isExpanded) => {
    setExpandSecond(isExpanded);
  };

  console.log("flightData");
  console.log(flightData);

  const handleChange = (event) => {
    setChecked((prevCheckedItems) => ({
      ...prevCheckedItems,
      [event.target.name]: event.target.checked,
    }));
  };

  function getConnections(way, connection_count) {
    if (connection_count <= 0) {
      return "Direct Flight";
    } else if (connection_count == 1) {
      return way.flight_data.flight_0.arrival.airport.code;
    } else {
      let flights = way.flight_data.flight_0.arrival.airport.code;
      for (let i = 1; i < connection_count; i++) {
        flights += ", " + way.flight_data[`flight_${i}`].arrival.airport.code;
      }
      return flights;
    }
  }

  function removeState(flight) {
    const item = { flightinfo: flight, isChecked: true };
    compareDispatch({
      type: CompareAction.REMOVE,
      compare: item,
    });
  }

  function convertTime(timeString) {
    if (!timeString) {
      return "";
    }
    const [days, hours, minutes] = timeString.split(":");
    let convertedTime = "";

    if (parseInt(days, 10) > 0) {
      convertedTime += parseInt(days, 10) * 24 + parseInt(hours, 10);
    } else {
      convertedTime += parseInt(hours, 10);
    }

    convertedTime += `h ${parseInt(minutes, 10)}m`;

    return convertedTime;
  }

  function getDateDifference(dateDepart, dateArrive) {
    const date1 = new Date(dateDepart);
    const date2 = new Date(dateArrive);

    const oneDay = 24 * 60 * 60 * 1000;

    const diffInDays = Math.round((date2 - date1) / oneDay);

    if (diffInDays === 0) {
      return 0;
    } else {
      return diffInDays;
    }
  }

  function isTimeAfter10(time) {
    const hour = parseInt(time.split(":")[0], 10);
    return hour > 10;
  }

  function mapValues(obj) {
    const values = Object.values(obj).slice(1);
    return values;
  }

  return (
    <>
      {compareState.compare.map((state, index) => (
        <>
          <Box
            boxShadow={15}
            sx={{
              width: "35%",
              maxHeight: "150px",
              borderRadius: 4,
              margin: "auto",
              border: 3,
              padding: 5,
              marginTop: "5%",
              overflow: "hidden",
              position: "center",
              borderRadius: 15,
            }}
          >
            <div onClick={() => removeState(state.flightinfo)}>
              <CloseIcon sx={{ marginLeft: "95%", marginTop: -150 }} />
            </div>

            {state.flightinfo &&
              state.flightinfo.slice_data &&
              Object.values(state.flightinfo.slice_data).map((way) => (
                <>
                  <div
                    style={{
                      marginLeft: "2%",
                      marginTop: "-2%",
                      marginBottom: "7%",
                    }}
                  >
                    <div>
                      <Tooltip title={way.airline.name}>
                        <img
                          src={way.airline.logo}
                          alt="airline"
                          style={{
                            width: "9%",
                            borderRadius: "10%",
                            marginTop: "5%",
                            marginBottom: "-5%",
                          }}
                        />
                      </Tooltip>

                      <Divider
                        style={{
                          width: "55%",
                          borderWidth: 1,
                          background: "black",
                          marginLeft: "30%",
                          marginTop: ".25%",
                        }}
                      />
                      {way.info.connection_count > 0 && (
                        <CircleIcon
                          style={{
                            position: "absolute",
                            left: "51.5%",
                            transform: "translate(-50%, -50%)",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: "black",
                          }}
                        />
                      )}

                      <Box sx={{ marginBottom: "3%" }}>
                        <Tooltip title={way.departure.airport.name}>
                          <Typography
                            sx={{
                              fontSize: 25,
                              maxWidth: "70px",
                              marginLeft: "16%",
                              maxHeight: "20px",
                              marginTop: "-4%",
                            }}
                          >
                            {way.departure.airport.code}
                          </Typography>
                        </Tooltip>
                        <Tooltip
                          title={getConnections(way, way.info.connection_count)}
                        >
                          <Typography
                            sx={{
                              fontSize: 18,
                              maxWidth: "100px",
                              marginLeft: "48%",
                              marginTop: "1%",
                              maxHeight: "20px",
                            }}
                          >
                            {way.info.connection_count > 0
                              ? `${way.info.connection_count} ${
                                  way.info.connection_count > 1
                                    ? "Stops"
                                    : "Stop"
                                }`
                              : "Direct Flight"}
                          </Typography>
                        </Tooltip>
                        <Tooltip title={way.arrival.airport.name}>
                          <Typography
                            sx={{
                              fontSize: 25,
                              maxWidth: "70px",
                              marginLeft: "88%",
                              maxHeight: "20px",
                              marginTop: "-12%",
                            }}
                          >
                            {way.arrival.airport.code}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </div>
                  </div>
                </>
              ))}
          </Box>
        </>
      ))}
    </>
  );
};
