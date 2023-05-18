import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import FlightIcon from "@mui/icons-material/Flight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  LocalizationProvider,
  DatePicker,
  DateField,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import background from "./../../Background.svg";
import "./status.css";

export const Status = () => {
  const [flightData, setFlightData] = useState([]);
  const [flightNum, setFlightNum] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [expanded, setExpanded] = useState(0);
  const [numNoZero, setNumNoZero] = useState("");

  const accessKey = "2d3cdd9ea8bf4d3c5752501ae9253b9f";

  console.log("flightData");
  console.log(flightData);

  console.log("flightNum");
  console.log(flightNum);

  console.log("No zero's");
  console.log(numNoZero);

  const onInput = (event) => {
    const capitalizedValue = event.target.value.toUpperCase();
    setNumNoZero(capitalizedValue.replace(/[a-zA-Z]0+/g, (match) => match[0]));
    setFlightNum(capitalizedValue);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  function CallAPI() {
    if (flightNum !== "" && selectedDate !== null) {
      fetch(
        `https://flightera-flight-data.p.rapidapi.com/flight/info?flnr=${numNoZero}&date=${selectedDate}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "91bd8cf149msh10c65b76df66871p1185a2jsnd808611734d1",
            "X-RapidAPI-Host": "flightera-flight-data.p.rapidapi.com",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setFlightData(data);
        })
        .catch((error) => console.log(error));
    } else {
      console.log("Error empty info");
    }
  }

  function PickDate() {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          popperPlacement="bottom"
        />
      </LocalizationProvider>
    );
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const dateFormatted = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", dateFormatted);
  }

  function formatTime(timeString) {
    const date = new Date(timeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine if it's AM or PM
    const amOrPm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Format hours and minutes to have leading zeros if needed
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  }

  function timeOfFlight(depart, arrive) {
    const departTime = new Date(depart);
    const arriveime = new Date(arrive);

    const timeDifference = arriveime - departTime;

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m`;
  }

  function findStatusColor(data) {
    if (data.status == "canc") {
      return "black";
    }
    const schedArrive = new Date(data.scheduled_arrival_local);
    const actualArrive = new Date(data.actual_arrival_local);

    const timeDifference = schedArrive - actualArrive;

    return timeDifference < 0 ? "red" : "green";
  }

  function statusText(flight) {
    let statusText;

    switch (flight.status) {
      case "landed":
        statusText =
          findStatusColor(flight) === "red" ? "Arrived Late" : "Arrived";
        break;
      case "canc":
        statusText = "Cancelled";
        break;
      case "sched":
      case "live":
        statusText = findStatusColor(flight) === "red" ? "Delayed" : "On time";
        break;

      default:
        statusText = "";
        break;
    }
    return statusText;
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Typography
        sx={{
          fontSize: 48,
          marginTop: "5%",
          textAlign: "center",
          marginRight: "55%",
        }}
      >
        Flight status:
      </Typography>
      <Box
        sx={{
          width: "58%",
          height: "45%",
          borderRadius: 4,
          margin: "auto",
          marginBottom: "5%",
          border: 3,
          padding: 5,
          marginTop: "2%",

          overflow: "hidden",
          position: "center",
        }}
      >
        <Box sx={{ marginTop: "1%" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ marginRight: 2, fontSize: 20 }}>
              Flight Number:
            </Typography>
            <TextField
              id="flightNum"
              label=""
              onInput={onInput}
              value={flightNum}
            />
            <Typography
              sx={{ marginRight: "2%", marginLeft: "3%", fontSize: 20 }}
            >
              Date:
            </Typography>
            <PickDate />
            <Button
              variant="contained"
              size="large"
              onClick={CallAPI}
              sx={{ marginLeft: "5%" }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Box>
      {Array.isArray(flightData) &&
      flightData.length === 2 &&
      flightData[0].departure_city === flightData[1].departure_city ? (
        <div></div>
      ) : flightData && Array.isArray(flightData) && flightData.length > 0 ? (
        flightData.map((flight, index) => (
          <div>
            <Accordion
              key={index}
              expanded={expanded === index}
              onChange={handleChange(index)}
              sx={{
                width: "60%",
                border: 0.25,
                borderColor: "lightgray",
              }}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
                sx={{ height: 75 }}
              >
                <Box>
                  <Typography sx={{ fontSize: 20 }}>
                    {formatTime(flight.scheduled_departure_local)}
                  </Typography>
                  <Box
                    sx={{
                      border: 2,
                      color: findStatusColor(flight),
                      textAlign: "center",
                      marginRight: 18,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        paddingRight: 1,
                        paddingLeft: 1,
                        fontSize: 19,
                        color: findStatusColor(flight),
                      }}
                    >
                      {statusText(flight)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ width: "33%" }}>
                  <Typography sx={{ fontSize: 20 }}>{flight.flnr}</Typography>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography
                      sx={{
                        fontSize: 19,
                        marginRight: "2%",
                      }}
                    >
                      {flight.arrival_city}
                    </Typography>
                    <Typography
                      sx={{
                        marginTop: "1.5%",
                        fontSize: 15,
                        color: "text.secondary",
                      }}
                    >
                      {flight.arrival_iata}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ height: 375 }}>
                <Box
                  boxShadow={15}
                  sx={{
                    width: "80%",
                    height: 250,
                    borderRadius: 4,
                    margin: "auto",
                    border: 3,
                    padding: 5,
                    overflow: "hidden",
                    position: "center",
                  }}
                >
                  <Typography sx={{ textAlign: "center", marginBottom: "-5%" }}>
                    {flight.actual_departure_is_estimated
                      ? timeOfFlight(
                          flight.scheduled_departure_local,
                          flight.scheduled_arrival_local
                        )
                      : timeOfFlight(
                          flight.actual_departure_local,
                          flight.actual_arrival_local
                        )}
                  </Typography>
                  <div
                    style={{
                      marginTop: "-4%",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        display: "inline",
                        margin: "10px",
                        fontSize: 45,
                      }}
                    >
                      {flight.departure_iata}
                    </Typography>

                    <FlightIcon
                      sx={{
                        transform: "rotate(90deg)",
                        color: findStatusColor(flight),
                      }}
                    />
                    <Divider
                      style={{
                        width: "72%",
                        borderWidth: 1,
                        backgroundColor: findStatusColor(flight),
                      }}
                      orientation="horizontal"
                    />
                    <FlightIcon
                      sx={{
                        transform: "rotate(90deg)",
                        color: findStatusColor(flight),
                      }}
                    />

                    <Typography
                      sx={{ display: "inline", margin: "10px", fontSize: 45 }}
                    >
                      {flight.arrival_iata}
                    </Typography>
                  </div>

                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={6}
                      minHeight={250}
                      sx={{ borderRight: "1px solid lightgray" }}
                    >
                      <Typography
                        color="text.primary"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          paddingTop: "5%",
                          fontSize: 20,
                          marginLeft: "2%",
                        }}
                      >
                        {flight.departure_city}
                        <CircleIcon
                          sx={{ fontSize: 5, marginLeft: 1, marginRight: 1 }}
                        />
                        {formatDate(flight.scheduled_departure_local)}
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "1%",
                          marginLeft: "2%",
                        }}
                      >
                        <Typography
                          color="gray"
                          style={{
                            marginRight: "5%",
                            fontSize: 15,
                            marginTop: "1%",
                          }}
                        >
                          {flight.actual_departure_is_estimated
                            ? "Scheduled departure"
                            : "Departed"}
                        </Typography>
                        <Typography
                          color="gray"
                          sx={{ marginLeft: "27%", marginTop: "1%" }}
                        >
                          Terminal
                        </Typography>
                        <Typography
                          color="gray"
                          sx={{ marginLeft: "10%", marginTop: "1%" }}
                        >
                          Gate
                        </Typography>
                      </div>
                      <div
                        style={{
                          marginLeft: "2%",
                        }}
                      >
                        <Typography
                          sx={{
                            display: "inline",
                            fontSize: 30,
                            color: findStatusColor(flight),
                          }}
                        >
                          {flight.actual_departure_is_estimated
                            ? formatTime(flight.scheduled_departure_local)
                            : formatTime(flight.actual_departure_local)}
                        </Typography>
                        <Typography
                          sx={{
                            marginLeft: "20%",
                            display: "inline",
                            fontSize: 30,
                          }}
                        >
                          {flight.departure_terminal
                            ? flight.departure_terminal
                            : "-"}
                        </Typography>
                        <Typography
                          sx={{
                            marginLeft: "15%",
                            display: "inline",
                            fontSize: 30,
                          }}
                        >
                          {flight.departure_gate ? flight.departure_gate : "-"}
                        </Typography>
                        <div>
                          <Typography
                            color="gray"
                            sx={{
                              display: "inline",
                              fontSize: 20,
                              textDecoration:
                                flight.actual_departure_is_estimated
                                  ? "none"
                                  : "line-through",
                            }}
                          >
                            {flight.actual_departure_is_estimated
                              ? null
                              : formatTime(flight.scheduled_departure_local)}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      minHeight={250}
                      sx={{ borderLeft: "1px solid lightgray" }}
                    >
                      <Typography
                        color="text.primary"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          paddingTop: "5%",
                          marginLeft: "4%",
                          fontSize: 20,
                        }}
                      >
                        {flight.arrival_city}
                        <CircleIcon
                          sx={{ fontSize: 5, marginLeft: 1, marginRight: 1 }}
                        />
                        {formatDate("2023-05-15T23:50:00-04:00")}

                        <Typography
                          color={"gray"}
                          style={{
                            fontSize: 12,
                            textDecoration: "line-through",
                          }}
                        >
                          {formatDate(flight.scheduled_arrival_local) !==
                          formatDate("2023-05-15T23:50:00-04:00")
                            ? formatDate(flight.scheduled_arrival_local)
                            : null}
                        </Typography>
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "1%",
                          marginLeft: "4%",
                        }}
                      >
                        <Typography
                          color="gray"
                          style={{
                            marginRight: "5%",
                            fontSize: 15,
                            marginTop: "1%",
                          }}
                        >
                          {flight.status === "landed"
                            ? "Arrived"
                            : "Scheduled arrival"}
                        </Typography>
                        <Typography
                          color="gray"
                          sx={{ marginLeft: "27%", marginTop: "1%" }}
                        >
                          Terminal
                        </Typography>
                        <Typography
                          color="gray"
                          sx={{ marginLeft: "10%", marginTop: "1%" }}
                        >
                          Gate
                        </Typography>
                      </div>

                      <div
                        style={{
                          marginLeft: "4%",
                        }}
                      >
                        <Typography
                          sx={{
                            display: "inline",
                            fontSize: 30,
                            color: findStatusColor(flight),
                          }}
                        >
                          {flight.actual_departure_is_estimated
                            ? formatTime(flight.scheduled_arrival_local)
                            : formatTime(flight.actual_arrival_local)}
                        </Typography>
                        <Typography
                          sx={{
                            marginLeft: "26%",
                            display: "inline",
                            fontSize: 30,
                          }}
                        >
                          {flight.arrival_terminal
                            ? flight.arrival_terminal
                            : "-"}
                        </Typography>
                        <Typography
                          sx={{
                            marginLeft: "15%",
                            display: "inline",
                            fontSize: 30,
                          }}
                        >
                          {flight.arrival_gate ? flight.arrival_gate : "-"}
                        </Typography>
                        <div>
                          <Typography
                            color="gray"
                            sx={{
                              display: "inline",
                              fontSize: 20,
                              textDecoration:
                                flight.actual_departure_is_estimated
                                  ? "none"
                                  : "line-through",
                            }}
                          >
                            {flight.actual_departure_is_estimated
                              ? null
                              : formatTime(flight.scheduled_arrival_local)}{" "}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          </div>
        ))
      ) : null}
    </>
  );
};
