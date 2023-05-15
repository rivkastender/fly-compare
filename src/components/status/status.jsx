import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Container,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import FlightIcon from "@mui/icons-material/Flight";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
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
  //const [deptArpt, setDeptArpt] = useState("");
  //const [arrvArpt, setArrvArpt] = useState("");
  const [flightStatus, setFlightStatus] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);

  const accessKey = "2d3cdd9ea8bf4d3c5752501ae9253b9f";

  console.log("flightData");
  console.log(flightData);

  console.log("flightNum");
  console.log(flightNum);

  const onInput = (event) => {
    console.log(event.target.value);
    setFlightNum(event.target.value);
  };

  const changeFlightNumber = (event) => {
    setFlightNum(event.target.value);
  };

  /*const departInput = (event) => {
    console.log(event.target.value);
    setDeptArpt(event.target.value);
  };

  const arriveInput = (event) => {
    console.log(event.target.value);
    setArrvArpt(event.target.value);
  };*/

  function CallAPI() {
    fetch(
      `https://flightera-flight-data.p.rapidapi.com/flight/info?flnr=${flightNum}&date=2023-05-14`,
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
        console.log("data");
        console.log(data);
        setFlightData(data);
        setFlightStatus(data.status);
      })
      .catch((error) => console.log(error));
  }

  function PickDate() {
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

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

  const [expanded, setExpanded] = useState(0);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Box
        sx={{
          width: "55%",
          height: 200,
          borderRadius: 4,
          margin: "auto",
          marginBottom: 15,
          border: 3,
          padding: 5,
          marginTop: 15,

          overflow: "hidden",
          position: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "75%",
          }}
        >
          <Typography
            sx={{
              marginRight: 2,
              fontSize: 25,
            }}
          >
            Flight status:
          </Typography>
        </Box>
        <Box sx={{ marginTop: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ marginRight: 2 }}>Flight Number:</Typography>
            <TextField
              id="flightNum"
              label=""
              onInput={onInput}
              value={flightNum}
            />
            <Typography sx={{ marginRight: 2, marginLeft: 2 }}>
              Date:
            </Typography>
            <PickDate />
            <Button
              variant="contained"
              size="large"
              onClick={CallAPI}
              sx={{ marginRight: 2, marginLeft: 2 }}
            >
              Search
            </Button>
          </Box>
        </Box>{" "}
      </Box>

      {flightData.map((flight, index) => (
        <div>
          <Accordion
            key={index}
            expanded={expanded === index}
            onChange={handleChange(index)}
            sx={{
              width: "65%",
              border: 0.25,
              borderColor: "lightgray",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
              sx={{ height: 75 }}
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                {flight.departure_iata} to {flight.arrival_iata}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                {flight.flight_number}
              </Typography>
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
                <Typography sx={{ textAlign: "center" }}> </Typography>
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
                    sx={{ transform: "rotate(90deg)", color: "green" }}
                  />
                  <Divider
                    style={{
                      width: "72%",
                      borderWidth: 1,
                      backgroundColor:
                        flight.status === "landed"
                          ? "green"
                          : flight.status === "landed"
                          ? "linear-gradient(to right, green 50%, black 50%)"
                          : "black",

                      //borderColor: flight ? "green" : "black",
                    }}
                    orientation="horizontal"
                  />
                  <FlightIcon
                    sx={{ transform: "rotate(90deg)", color: "green" }}
                  />

                  <Typography
                    sx={{ display: "inline", margin: "10px", fontSize: 45 }}
                  >
                    {flight.arrival_iata}
                  </Typography>
                </div>

                <Grid
                  container
                  spacing={2}
                  sx={{
                    "--Grid-borderWidth": "1px",
                    borderTop: "var(--Grid-borderWidth) solid",
                    borderLeft: "var(--Grid-borderWidth) solid",
                    borderColor: "divider",
                    "& > div": {
                      borderRight: "var(--Grid-borderWidth) solid",
                      borderBottom: "var(--Grid-borderWidth) solid",
                      borderColor: "divider",
                    },
                  }}
                >
                  <Grid
                    item
                    xs={6}
                    minHeight={250}
                    sx={{ border: "1px solid divider" }}
                  >
                    <Typography
                      color="text.primary"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        paddingTop: "10%",
                        fontSize: 20,
                        marginLeft: "4%",
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
                        marginLeft: "4%",
                      }}
                    >
                      <Typography
                        color="gray"
                        style={{
                          marginRight: "5%",
                          fontSize: 15,
                        }}
                      >
                        {flight ? "Departed" : "Scheduled departure"}
                      </Typography>
                      <Typography color="gray" sx={{ marginLeft: "35%" }}>
                        Terminal
                      </Typography>
                      <Typography color="gray" sx={{ marginLeft: "10%" }}>
                        Gate
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "1%",
                        marginLeft: "4%",
                      }}
                    >
                      <Typography
                        sx={{
                          display: "inline",
                          fontSize: 35,
                        }}
                      >
                        {flight.departure_iata}
                      </Typography>
                      <Typography
                        sx={{
                          marginLeft: "45%",
                          display: "inline",
                          fontSize: 35,
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
                          fontSize: 35,
                        }}
                      >
                        {flight.departure_gate}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    minHeight={250}
                    sx={{ border: "1px solid divider" }}
                  >
                    <Typography
                      color="text.primary"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        paddingTop: "10%",
                        marginLeft: "4%",
                        fontSize: 20,
                      }}
                    >
                      {flight.arrival_city}
                      <CircleIcon
                        sx={{ fontSize: 5, marginLeft: 1, marginRight: 1 }}
                      />
                      {formatDate(flight.scheduled_arrival_local)}
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
                        }}
                      >
                        {flight ? "Departed" : "Scheduled departure"}
                      </Typography>
                      <Typography color="gray" sx={{ marginLeft: "35%" }}>
                        Terminal
                      </Typography>
                      <Typography color="gray" sx={{ marginLeft: "10%" }}>
                        Gate
                      </Typography>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "1%",
                        marginLeft: "4%",
                      }}
                    >
                      <Typography
                        sx={{
                          display: "inline",
                          fontSize: 35,
                        }}
                      >
                        {flight.arrival_iata}
                      </Typography>
                      <Typography
                        sx={{
                          marginLeft: "45%",
                          display: "inline",
                          fontSize: 35,
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
                          fontSize: 35,
                        }}
                      >
                        {flight.arrival_gate}
                      </Typography>
                    </div>
                  </Grid>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderWidth: 1, borderColor: "black" }}
                  />
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </>
  );
};
