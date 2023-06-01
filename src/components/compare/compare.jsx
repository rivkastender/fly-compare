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
          <Accordion
            expanded={expanded}
            onChange={handleExpand}
            sx={{
              borderRadius: "8px",
              boxShadow: "none",
              borderTop: "none",
              borderBottom: "none",
              maxWidth: "35%",
              flexDirection: "row",
              overflow: "auto",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="accordion-content"
              id="accordion-header"
            >
              <Box
                boxShadow={15}
                sx={{
                  width: "100%",
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
                <Button
                  onClick={() =>
                    removeState(state.flightinfo.ppn_contract_bundle)
                  }
                >
                  <CloseIcon sx={{ marginLeft: "95%", marginTop: -150 }} />
                </Button>

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
                              title={getConnections(
                                way,
                                way.info.connection_count
                              )}
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
            </AccordionSummary>

            <AccordionDetails
              id={id}
              open={open}
              onClose={handleClose}
              style={{ minWidth: "800px", overflow: "auto" }}
            >
              <Box
                sx={{
                  minHeight: 300,
                  minWidth: 800,
                  border: 3,
                  borderRadius: 0,
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "80%",
                    fontSize: 25,
                  }}
                >
                  <Checkbox
                    name={`checkbox-${selectedItemId}`}
                    checked={checked[`checkbox-${selectedItemId}`] || false}
                    onChange={handleChange}
                    onClick={() =>
                      addCompare(flightData[selectedItemId].ppn_contract_bundle)
                    }
                  />
                  <Typography
                    style={{
                      fontSize: 20,
                      marginTop: "4.5%",
                      marginLeft: "-5%",
                    }}
                  >
                    Compare
                  </Typography>
                </Box>
                {flightData[selectedItemId] &&
                  flightData[selectedItemId].slice_data &&
                  Object.values(flightData[selectedItemId].slice_data).map(
                    (way) => (
                      <>
                        <div>
                          <Box
                            sx={{
                              marginBottom: "2%",
                            }}
                          >
                            <Typography sx={{ fontSize: 25, marginLeft: "5%" }}>
                              {way.departure.datetime.date_display}
                            </Typography>
                          </Box>
                          <Accordion
                            expanded={expanded}
                            onChange={handleExpand}
                            sx={{
                              borderRadius: "8px",
                              boxShadow: "none",
                              borderTop: "none",
                              borderBottom: "none",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                              sx={{
                                border: 3,
                                marginTop: 1,
                                marginLeft: 3,
                                marginRight: 3,
                                borderBottomLeftRadius: expanded ? 0 : 30,
                                borderBottomRightRadius: expanded ? 0 : 30,
                                borderTopLeftRadius: 30,
                                borderTopRightRadius: 30,
                              }}
                            >
                              <div
                                style={{
                                  marginLeft: "-1%",
                                  marginBottom: ".5%",
                                }}
                              >
                                <Tooltip title={way.airline.name}>
                                  <img
                                    src={way.airline.logo}
                                    alt="airline"
                                    style={{
                                      width: "18%",
                                      borderRadius: "10%",
                                    }}
                                  />
                                </Tooltip>
                                <Box
                                  sx={{
                                    marginLeft: "15%",
                                    marginTop: "-16.5%",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      marginTop: "-10%",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        marginLeft: "14%",
                                        fontSize: 25,
                                        maxWidth: "70px",
                                      }}
                                    >
                                      {way.departure.datetime.time_12h}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        marginLeft: "45%",
                                        fontSize: 18,
                                        minWidth: "300px",
                                        marginTop: "1%",
                                      }}
                                    >
                                      {convertTime(way.info.duration)}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        marginLeft: "-20%",
                                        fontSize: 25,
                                        maxWidth: "70px",
                                      }}
                                    >
                                      {way.arrival.datetime.time_12h}
                                    </Typography>
                                    {getDateDifference(
                                      way.departure.datetime.date,
                                      way.arrival.datetime.date
                                    ) > 0 && (
                                      <Typography
                                        sx={{
                                          marginLeft: isTimeAfter10(
                                            way.arrival.datetime.time_12h
                                          )
                                            ? "4%"
                                            : "2%",
                                        }}
                                      >
                                        {getDateDifference(
                                          way.departure.datetime.date,
                                          way.arrival.datetime.date
                                        )}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Divider
                                    style={{
                                      width: "135%",
                                      borderWidth: 1,
                                      background: "black",
                                      marginLeft: "20%",
                                      marginTop: ".25%",
                                    }}
                                  />
                                  {way.info.connection_count > 0 && (
                                    <CircleIcon
                                      style={{
                                        position: "absolute",
                                        left: "53%",
                                        transform: "translate(-50%, -50%)",
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        background: "black",
                                      }}
                                    />
                                  )}

                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <Tooltip title={way.departure.airport.name}>
                                      <Typography
                                        sx={{
                                          fontSize: 25,
                                          maxWidth: "70px",
                                          marginLeft: "14%",
                                          maxHeight: "20px",
                                        }}
                                      >
                                        {way.departure.airport.code}
                                      </Typography>
                                    </Tooltip>
                                    <Tooltip
                                      title={getConnections(
                                        way,
                                        way.info.connection_count
                                      )}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: 18,
                                          minWidth: "100px",
                                          marginLeft: "51%",
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
                                          marginLeft: "40%",
                                          maxHeight: "20px",
                                        }}
                                      >
                                        {way.arrival.airport.code}
                                      </Typography>
                                    </Tooltip>
                                  </Box>
                                </Box>
                              </div>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                padding: 2,
                                border: 3,
                                borderTop: 0,
                                marginLeft: 3,
                                marginRight: 3,
                                marginTop: 0,
                                marginBottom: 0,
                                borderBottomLeftRadius: 30,
                                borderBottomRightRadius: 30,
                              }}
                            >
                              <Typography>
                                {`${way.flight_data.flight_0.info.marketing_airline} - `}
                                {`${way.flight_data.flight_0.info.marketing_airline_code} `}
                                {way.flight_data.flight_0.info.flight_number}
                              </Typography>
                              <Box
                                sx={{
                                  marginLeft: "5%",
                                  marginTop: "2%",
                                  marginBottom: "2%",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "Flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <CircleOutlinedIcon />
                                  <Typography sx={{ marginLeft: "2%" }}>
                                    {
                                      way.flight_data.flight_0.departure
                                        .datetime.time_12h
                                    }
                                  </Typography>
                                  <Tooltip
                                    title={
                                      way.flight_data.flight_0.departure.airport
                                        .name
                                    }
                                  >
                                    <Typography sx={{ marginLeft: "5%" }}>
                                      {
                                        way.flight_data.flight_0.departure
                                          .airport.code
                                      }
                                    </Typography>
                                  </Tooltip>
                                </Box>
                                <Divider
                                  orientation="vertical"
                                  sx={{
                                    background: "black",
                                    width: 100,
                                    transform: "rotate(90deg)",
                                    border: 1,
                                    marginLeft: "-6%",
                                    marginTop: "7.5%",
                                    marginBottom: "7.25%",
                                  }}
                                />
                                <Typography
                                  sx={{
                                    marginLeft: "8%",
                                    marginTop: "-9%",
                                    marginBottom: "5.25%",
                                  }}
                                >
                                  {convertTime(
                                    way.flight_data.flight_0.info.duration
                                  )}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "Flex",
                                    flexDirection: "row",
                                  }}
                                >
                                  <CircleOutlinedIcon />
                                  <Typography sx={{ marginLeft: "2%" }}>
                                    {way.arrival.datetime.time_12h}
                                  </Typography>
                                  <Tooltip title={way.arrival.airport.name}>
                                    <Typography sx={{ marginLeft: "5%" }}>
                                      {way.arrival.airport.code}
                                    </Typography>
                                  </Tooltip>
                                </Box>
                              </Box>
                              {way.flight_data &&
                                mapValues(way.flight_data).map(
                                  (value, index) => (
                                    <>
                                      <Box
                                        sx={{
                                          backgroundColor: "lightgray",
                                          borderRadius: 2,
                                          marginTop: 3,
                                          marginBottom: 3,
                                        }}
                                      >
                                        <Typography sx={{ marginLeft: 5 }}>
                                          908
                                          {/* {way.flight_data &&
                              convertTime(
                                Object.values(way.flight_data)[index].info
                                  .notes[0].duration
                              )} */}
                                        </Typography>
                                      </Box>
                                      <Typography>
                                        {`${value.info.marketing_airline} - `}
                                        {`${value.info.marketing_airline_code} `}
                                        {value.info.flight_number}
                                      </Typography>
                                      <Box
                                        sx={{
                                          marginLeft: "5%",
                                          marginTop: "2%",
                                          marginBottom: "2%",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: "Flex",
                                            flexDirection: "row",
                                          }}
                                        >
                                          <CircleOutlinedIcon />
                                          <Typography sx={{ marginLeft: "2%" }}>
                                            {value.departure.datetime.time_12h}
                                          </Typography>
                                          <Tooltip
                                            title={
                                              value?.departure.airport.name
                                            }
                                          >
                                            <Typography
                                              sx={{ marginLeft: "5%" }}
                                            >
                                              {value.departure.airport.code}
                                            </Typography>
                                          </Tooltip>
                                        </Box>
                                        <Divider
                                          orientation="vertical"
                                          sx={{
                                            background: "black",
                                            width: 100,
                                            transform: "rotate(90deg)",
                                            border: 1,
                                            marginLeft: "-6%",
                                            marginTop: "7.5%",
                                            marginBottom: "7.25%",
                                          }}
                                        />
                                        <Typography
                                          sx={{
                                            marginLeft: "8%",
                                            marginTop: "-9%",
                                            marginBottom: "5.25%",
                                          }}
                                        >
                                          {convertTime(value.info.duration)}
                                        </Typography>
                                        <Box
                                          sx={{
                                            display: "Flex",
                                            flexDirection: "row",
                                          }}
                                        >
                                          <CircleOutlinedIcon />
                                          <Typography sx={{ marginLeft: "2%" }}>
                                            {value.arrival.datetime.time_12h}
                                          </Typography>
                                          <Tooltip
                                            title={value?.arrival.airport.name}
                                          >
                                            <Typography
                                              sx={{ marginLeft: "5%" }}
                                            >
                                              {value.arrival.airport.code}
                                            </Typography>
                                          </Tooltip>
                                        </Box>
                                      </Box>
                                    </>
                                  )
                                )}
                              <Box
                                sx={{
                                  display: "Flex",
                                  flexDirection: "row",
                                }}
                              >
                                <Typography>Arrives:</Typography>
                                <Typography sx={{ marginLeft: "1%" }}>
                                  {way.arrival.datetime.time_12h}
                                </Typography>
                                <Typography sx={{ marginLeft: "10%" }}>
                                  {convertTime(way.info.duration)}
                                </Typography>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                          <Box
                            sx={{
                              minHeight: 20,
                            }}
                          ></Box>
                        </div>
                      </>
                    )
                  )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </>
      ))}
    </>
  );
};
