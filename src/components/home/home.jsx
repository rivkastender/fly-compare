import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Input,
  Container,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "@mui/material/Checkbox";
import LaunchIcon from "@mui/icons-material/Launch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import Popover from "@mui/material/Popover";
import CircleIcon from "@mui/icons-material/Circle";
import CircularProgress from "@mui/material/CircularProgress";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FlightIcon from "@mui/icons-material/Flight";
import { CompareAction } from "../../state/compare-reducer";
import { CompareContext } from "../../state/compare-context";
import "./home.css";
import dayjs from "dayjs";

export const Home = () => {
  const [selectedValue, setSelectedValue] = useState("round_trip");
  const [selectedDate, setSelectedDate] = useState(null);
  const [checked, setChecked] = useState(false);
  const [flightData, setFlightData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [expandSecond, setExpandSecond] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartureDate] = useState(null);
  const [arriveDate, setArriveDate] = useState(null);
  const [flightValue, setFlightValue] = useState("Round Trip");
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState(false);
  const [emptyInfo, setEmptyInfo] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);

  const { compareState, compareDispatch } = useContext(CompareContext);

  function addCompare(flight) {
    console.log(flight.ppn_contract_bundle);
    const compareExist = compareState.compare.find(
      (x) => x.flightinfo.ppn_contract_bundle === flight.ppn_contract_bundle
    );

    const item = { flightinfo: flight, isChecked: true };

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

  function setSearch() {
    const item = {
      searchby: flightValue,
      to: to,
      from: from,
      depart: departDate.toISOString().split("T")[0],
      return: arriveDate.toISOString().split("T")[0],
      class: selectedVal,
      adults: adults,
      children: children,
    };

    compareDispatch({
      type: CompareAction.SET,
      search: item,
    });
  }

  function setData() {
    if (compareState.search != null) {
      setFrom(compareState.search.from);
      setTo(compareState.search.to);

      setAdults(compareState.search.adults);
      setChildren(compareState.search.children);
      setSelectedVal(compareState.search.class);
      setFlightValue(compareState.search.search);

      if (flightValue == "Round Trip") CallAPIRoundTrip();
      else CallAPIOneWay();
    }
  }

  console.log(compareState);
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

  const onInputFrom = (event) => {
    const capitalizedValue = event.target.value.toUpperCase();
    setFrom(capitalizedValue);
  };

  const onInputTo = (event) => {
    const capitalizedValue = event.target.value.toUpperCase();
    setTo(capitalizedValue);
  };

  function formatDate(date) {
    return date ? date.toISOString().slice(0, 10) : "";
  }

  const CallAPIRoundTrip = () => {
    setEmptyInfo(false);
    setError(false);
    setFlightData([]);
    if (departDate != null && arriveDate != null && to != "" && from != "") {
      setClicked(true);

      fetch(
        `https://priceline-com-provider.p.rapidapi.com/v2/flight/roundTrip?sid=iSiX639&adults=${adults}&departure_date=${formatDate(
          departDate
        )}%2C${formatDate(
          arriveDate
        )}&destination_airport_code=${to}%2C${from}&cabin_class=${selectedVal}&origin_airport_code=${from}%2C${to}&children=${children}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Host": "priceline-com-provider.p.rapidapi.com",
            "X-RapidAPI-Key":
              "91bd8cf149msh10c65b76df66871p1185a2jsnd808611734d1",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.getAirFlightRoundTrip.error != null) {
            setError(true);
            setFlightData([]);
          } else {
            setError(false);
            setClicked(false);

            console.log(
              data.getAirFlightRoundTrip.results.result.itinerary_data
            );
            const itinerary_data =
              data.getAirFlightRoundTrip.results.result.itinerary_data;
            console.log("apiData");
            console.log(data);

            const apiData = Object.values(itinerary_data);

            setFlightData(apiData);
            setError(false);

            console.log("error");
            console.log(error);
          }
          setClicked(false);
          setSearch();
        });
    } else {
      setEmptyInfo(true);
    }
  };

  const CallAPIOneWay = () => {
    setEmptyInfo(false);
    setError(false);
    setFlightData([]);

    if (departDate != null && to != "" && from != "") {
      setClicked(true);

      fetch(
        `https://priceline-com-provider.p.rapidapi.com/v2/flight/departures?adults=${adults}&sid=iSiX639&departure_date=${formatDate(
          departDate
        )}&origin_airport_code=${from}&cabin_class=${selectedVal}&destination_airport_code=${to}&children=${children}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Host": "priceline-com-provider.p.rapidapi.com",
            "X-RapidAPI-Key":
              "91bd8cf149msh10c65b76df66871p1185a2jsnd808611734d1",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setError(false);
          console.log("in api");
          console.log(data);
          if (data.getAirFlightDepartures.error != null) {
            setError(true);
            setFlightData([]);
            setClicked(false);
          } else {
            setClicked(false);

            const itinerary_data =
              data.getAirFlightDepartures.results.result.itinerary_data;
            console.log("apiData");
            console.log(data);

            const apiData = Object.values(itinerary_data);

            setFlightData(apiData);
            setError(false);
            setSearch();
          }

          console.log(error);
        });
    } else {
      setEmptyInfo(true);
    }
  };

  function switchFields() {
    const temp = from;

    setFrom(to);
    setTo(temp);
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
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleIncrement = (type) => {
    if (type === "adults") {
      setAdults(adults + 1);
    } else if (type === "children") {
      setChildren(children + 1);
    }
  };

  const handleDecrement = (type) => {
    if (type === "adults" && adults > 1) {
      setAdults(adults - 1);
    } else if (type === "children" && children > 0) {
      setChildren(children - 1);
    }
  };

  const handleSelected = (event) => {
    setSelectedValue(event.target.value);
  };

  function getTime(time1, time2) {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);

    let hoursDiff = hours2 - hours1;
    let minutesDiff = minutes2 - minutes1;

    if (minutesDiff < 0) {
      minutesDiff += 60;
      hoursDiff--;
    }

    return `${hoursDiff}h ${minutesDiff}m`;
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
    const [hourString, minutesString, period] = time.split(/:|(?=[ap]m)/i);
    const hour = parseInt(hourString, 10);

    return hour >= 10;
  }

  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const endDatePickerRef = useRef(null);

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    if (date) {
      setIsEndDatePickerOpen(true);
    } else {
      setIsEndDatePickerOpen(false);
    }
  };

  const handleEndDateChange = (date) => {
    setDepartureDate(selectedStartDate);

    if (departDate && date && date < departDate) {
      return;
    }
    setArriveDate(date);
  };

  const handleEndDatePickerClose = () => {
    setIsEndDatePickerOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (
      endDatePickerRef.current &&
      !endDatePickerRef.current.contains(event.target)
    ) {
      setIsEndDatePickerOpen(false);
    }
  };

  const handleEndDatePickerFocus = () => {
    if (!isEndDatePickerOpen) {
      setIsEndDatePickerOpen(true);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
  const [selectedVal, setSelectedVal] = useState("economy");

  const handleAutocompleteChange = (event, value) => {
    setSelectedVal(value);
  };

  const handleAutocompleteFlightChange = (event, value) => {
    setFlightValue(value);
    console.log(flightValue);
  };

  function mapValues(obj) {
    const values = Object.values(obj).slice(1);
    return values;
  }

  function PickDate() {
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={departDate}
          onChange={setDepartureDate}
          format="YYYY-MM-DD"
          label="Depart"
        />
      </LocalizationProvider>
    );
  }

  useEffect(() => {
    setData();
  }, []);
  return (
    <>
      {flightData?.length == 0 && clicked == false && (
        <>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Typography
              sx={{
                fontSize: 48,
                marginTop: "5%",
                textAlign: "center",
                marginLeft: "15%",
              }}
            >
              Search flights:
            </Typography>
            {emptyInfo == true && (
              <Typography
                sx={{
                  fontSize: 25,
                  marginTop: "6.75%",
                  textAlign: "center",
                  color: "red",
                  marginLeft: "25%",
                }}
              >
                Error: Enter required data
              </Typography>
            )}
            {emptyInfo == false && error == true && (
              <Typography
                sx={{
                  fontSize: 25,
                  marginTop: "6.75%",
                  textAlign: "center",
                  color: "red",
                  marginLeft: "20%",
                }}
              >
                Error: No data for the input information
              </Typography>
            )}
          </Box>
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
            <Box sx={{ marginTop: "1%", marginBottom: "2%" }}>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Typography sx={{ marginRight: 2 }}>Search By</Typography>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={flightValue}
                  onChange={handleAutocompleteFlightChange}
                  sx={{ marginTop: "-1%", marginBottom: "1%" }}
                >
                  <FormControlLabel
                    value="Round Trip"
                    control={<Radio />}
                    label="Round Trip"
                    checked={flightValue == "Round Trip"}
                  />
                  <FormControlLabel
                    value="One Way"
                    control={<Radio />}
                    label="One Way"
                    checked={flightValue == "One Way"}
                  />
                </RadioGroup>
              </Box>
              <Box sx={{ marginTop: 2 }}>
                {flightValue === "Round Trip" ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        id="fromAirport"
                        label="From"
                        variant="outlined"
                        sx={{ fontSize: 20 }}
                        onInput={onInputFrom}
                        value={from}
                      />
                      <Button onClick={switchFields}>
                        <SyncAltRoundedIcon />
                      </Button>
                      <TextField
                        id="toAirport"
                        label="To"
                        variant="outlined"
                        sx={{ marginRight: 2, fontSize: 20 }}
                        onInput={onInputTo}
                        value={to}
                      />
                      <DatePicker
                        label="Depart"
                        value={departDate}
                        onChange={handleStartDateChange}
                        format="YYYY-MM-DD"
                      />
                      <DatePicker
                        label="Return"
                        value={arriveDate}
                        onChange={handleEndDateChange}
                        minDate={selectedStartDate}
                        open={isEndDatePickerOpen}
                        onOpen={() => setIsEndDatePickerOpen(true)}
                        onClose={handleEndDatePickerClose}
                        onFocus={handleEndDatePickerFocus}
                        format="YYYY-MM-DD"
                      />
                    </Box>
                  </LocalizationProvider>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      id="fromAirport"
                      label="From"
                      variant="outlined"
                      sx={{ marginRight: 1, fontSize: 20 }}
                      onInput={onInputFrom}
                      value={from}
                    />
                    <Button onClick={switchFields}>
                      <SyncAltRoundedIcon />
                    </Button>
                    <TextField
                      id="toAirport"
                      label="To"
                      variant="outlined"
                      sx={{ marginRight: 6, marginLeft: 1, fontSize: 20 }}
                      onInput={onInputTo}
                      value={to}
                    />
                    <PickDate
                      sx={{ marginRight: 4, marginLeft: 6, fontSize: 20 }}
                    />
                  </Box>
                )}
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Autocomplete
                  options={["economy", "premium", "business", "first"]}
                  value={selectedVal}
                  onChange={handleAutocompleteChange}
                  sx={{ width: 250, marginTop: "2%", marginLeft: "5%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Class" />
                  )}
                />
                <FormControl
                  sx={{ minWidth: 300, marginTop: "2%", marginLeft: "5%" }}
                >
                  <InputLabel>
                    Adults: {adults}, Children: {children}
                  </InputLabel>
                  <Select>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Typography sx={{ marginLeft: "3%" }}>
                          Adults:{" "}
                        </Typography>
                      </Grid>
                      <Grid item sx={{ marginLeft: "4.75%" }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleDecrement("adults")}
                        >
                          -
                        </Button>
                      </Grid>
                      <Grid item>
                        <Typography>{adults}</Typography>
                      </Grid>
                      <Grid item sx={{ marginLeft: ".25%" }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleIncrement("adults")}
                        >
                          +
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Typography sx={{ marginLeft: "3%" }}>
                          Children:
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="outlined"
                          onClick={() => handleDecrement("children")}
                        >
                          -
                        </Button>
                      </Grid>
                      <Grid item>
                        <Typography>{children}</Typography>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="outlined"
                          onClick={() => handleIncrement("children")}
                        >
                          +
                        </Button>
                      </Grid>
                    </Grid>
                  </Select>
                </FormControl>
                <Button
                  sx={{ marginLeft: "8%", maxHeight: 55, marginTop: "2%" }}
                  onClick={
                    flightValue === "Round Trip"
                      ? CallAPIRoundTrip
                      : CallAPIOneWay
                  }
                  variant="contained"
                  size="medium"
                >
                  SEARCH FLIGHTS
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      )}

      {clicked == true && (
        <>
          <Box
            sx={{
              backgroundColor: "#04628F",
              borderRadius: 2,
              display: "inline-flex",
              alignItems: "center",
              padding: 10,
              marginTop: 7,
              width: "69%",
              marginLeft: "10%",
              marginRight: "10%",
              maxHeight: "20%",
            }}
          ></Box>
          <FlightIcon
            sx={{
              width: 50,
              height: 50,
              marginLeft: 10,
              marginTop: 3,
            }}
            className="flightIcon"
          />
          <Box
            sx={{
              backgroundColor: "#04628F",
              borderRadius: 2,
              display: "inline-flex",
              alignItems: "center",
              padding: 10,
              marginTop: 15,
              width: "69%",
              marginLeft: "10%",
              marginRight: "10%",
              maxHeight: "20%",
            }}
          ></Box>
        </>
      )}

      {flightData?.length != 0 && (
        <>
          <Box
            sx={{
              width: "80%",
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
            <Box sx={{ marginTop: "1%", marginBottom: "2%" }}>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Autocomplete
                  options={["Round Trip", "One Way"]}
                  value={flightValue}
                  onChange={handleAutocompleteFlightChange}
                  sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search by"
                      variant="standard"
                    />
                  )}
                />
                <Autocomplete
                  options={["economy", "premium", "business", "first"]}
                  value={selectedVal}
                  onChange={handleAutocompleteChange}
                  sx={{ width: 150, marginLeft: "2%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Class" variant="standard" />
                  )}
                />
              </Box>
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {flightValue === "One Way" ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      id="fromAirport"
                      label="From"
                      variant="outlined"
                      sx={{ marginRight: 1, fontSize: 20 }}
                      onInput={onInputFrom}
                      value={from}
                    />
                    <Button onClick={switchFields}>
                      <SyncAltRoundedIcon />
                    </Button>
                    <TextField
                      id="toAirport"
                      label="To"
                      variant="outlined"
                      sx={{ marginRight: 6, marginLeft: 1, fontSize: 20 }}
                      onInput={onInputTo}
                      value={to}
                    />
                    <PickDate
                      sx={{
                        fontSize: 20,
                      }}
                    />
                  </Box>
                ) : (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        id="fromAirport"
                        label="From"
                        variant="outlined"
                        sx={{ fontSize: 20, width: 200 }}
                        onInput={onInputFrom}
                        value={from}
                      />
                      <Button onClick={switchFields}>
                        <SyncAltRoundedIcon />
                      </Button>
                      <TextField
                        id="toAirport"
                        label="To"
                        variant="outlined"
                        sx={{
                          marginRight: 2,
                          fontSize: 20,
                          width: 200,
                        }}
                        onInput={onInputTo}
                        value={to}
                      />
                      <DatePicker
                        label="Depart"
                        value={departDate}
                        onChange={handleStartDateChange}
                        format="YYYY-MM-DD"
                        sx={{ width: 200 }}
                      />
                      <DatePicker
                        label="Return"
                        value={arriveDate}
                        onChange={handleEndDateChange}
                        minDate={selectedStartDate}
                        open={isEndDatePickerOpen}
                        onOpen={() => setIsEndDatePickerOpen(true)}
                        onClose={handleEndDatePickerClose}
                        onFocus={handleEndDatePickerFocus}
                        format="YYYY-MM-DD"
                        sx={{ width: 200 }}
                      />
                    </Box>
                  </LocalizationProvider>
                )}
                <FormControl
                  sx={{
                    minWidth: 250,
                    marginLeft: flightValue == "One Way" ? "4%" : "1.5%",
                  }}
                >
                  <InputLabel>
                    Adults: {adults}, Children: {children}
                  </InputLabel>
                  <Select>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Typography sx={{ marginLeft: "3%" }}>
                          Adults:{" "}
                        </Typography>
                      </Grid>
                      <Grid item sx={{ marginLeft: "5.5%" }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleDecrement("adults")}
                        >
                          -
                        </Button>
                      </Grid>
                      <Grid item>
                        <Typography>{adults}</Typography>
                      </Grid>
                      <Grid item sx={{ marginLeft: ".25%" }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleIncrement("adults")}
                        >
                          +
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Typography sx={{ marginLeft: "2.75%" }}>
                          Children:
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="outlined"
                          onClick={() => handleDecrement("children")}
                        >
                          -
                        </Button>
                      </Grid>
                      <Grid item>
                        <Typography>{children}</Typography>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="outlined"
                          onClick={() => handleIncrement("children")}
                        >
                          +
                        </Button>
                      </Grid>
                    </Grid>
                  </Select>
                </FormControl>
                <Button
                  sx={{
                    marginLeft: flightValue == "One Way" ? "4%" : "1.5%",
                    height: 75,
                  }}
                  onClick={
                    flightValue === "Round Trip"
                      ? CallAPIRoundTrip
                      : CallAPIOneWay
                  }
                  variant="contained"
                  size="medium"
                >
                  <SendRoundedIcon />
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      )}

      {flightData.map((flight, index) => (
        <>
          <Box
            boxShadow={15}
            sx={{
              width: "50%",
              minHeight: "100px",
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
            {flight &&
              flight.slice_data &&
              Object.values(flight.slice_data).map((way) => (
                <>
                  <div
                    style={{
                      marginLeft: "2%",
                      marginTop: "2%",
                      marginBottom: "6%",
                    }}
                  >
                    <div style={{ marginLeft: "-1%" }}>
                      <Tooltip title={way.airline.name}>
                        <img
                          src={way.airline.logo}
                          alt="airline"
                          style={{
                            width: "9%",
                            borderRadius: "10%",
                          }}
                        />
                      </Tooltip>
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
                            marginLeft: "20%",
                            fontSize: 18,
                            maxWidth: "100px",
                          }}
                        >
                          {convertTime(way.info.duration)}
                        </Typography>
                        <Typography
                          sx={{
                            marginLeft: "15%",
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
                          width: "55%",
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
                            left: "49%",
                            transform: "translate(-50%, -50%)",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: "black",
                          }}
                        />
                      )}

                      <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Tooltip title={way.departure.airport.name}>
                          <Typography
                            sx={{
                              fontSize: 25,
                              maxWidth: "70px",
                              marginLeft: "16%",
                              maxHeight: "20px",
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
                              marginLeft: "21%",
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
                              marginLeft:
                                way.info.connection_count == 0 ? "16%" : "20%",
                              maxHeight: "20px",
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
            <Button
              style={{
                marginLeft: "88%",
                fontSize: 25,
                marginTop: flightValue === "Round Trip" ? "-35% " : "-22%",
              }}
            >
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
              }).format(flight.price_details.baseline_total_fare)}
            </Button>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: 25,
                marginLeft: "65%",
                marginTop: "-7%",
                marginBottom: "-3%",
              }}
            >
              <Checkbox
                name={`checkbox-${index}`}
                checked={checked[`checkbox-${index}`] || false}
                onChange={handleChange}
                onClick={() => addCompare(flight)}
                sx={{ marginTop: "-2.25%" }}
              />
              <Typography
                style={{
                  fontSize: 20,
                }}
              >
                Compare
              </Typography>

              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontSize: 25,
                }}
                sx={{ minWidth: "180px" }}
                onClick={(event) => handleClick(event, index)}
                onChange={() => addCompare(flight.ppn_contract_bundle)}
              >
                <Typography
                  style={{
                    fontSize: 20,
                    marginLeft: "25%",
                  }}
                >
                  View Info
                </Typography>
                <LaunchIcon sx={{ marginTop: "1%" }} />
              </Box>
            </Box>
          </Box>
        </>
      ))}
      <Popover
        id={id}
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 385, left: 760 }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        style={{ minWidth: "800px", overflowY: "auto" }}
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
            Object.values(flightData[selectedItemId].slice_data).map((way) => (
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
                      <div style={{ marginLeft: "-1%", marginBottom: ".5%" }}>
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
                        <Box sx={{ marginLeft: "15%", marginTop: "-16.5%" }}>
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
                                    ? "8%"
                                    : "4%",
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

                          <Box sx={{ display: "flex", flexDirection: "row" }}>
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
                        <Box sx={{ display: "Flex", flexDirection: "row" }}>
                          <CircleOutlinedIcon />
                          <Typography sx={{ marginLeft: "2%" }}>
                            {
                              way.flight_data.flight_0.departure.datetime
                                .time_12h
                            }
                          </Typography>
                          <Tooltip
                            title={
                              way.flight_data.flight_0.departure.airport.name
                            }
                          >
                            <Typography sx={{ marginLeft: "5%" }}>
                              {way.flight_data.flight_0.departure.airport.code}
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
                          {convertTime(way.flight_data.flight_0.info.duration)}
                        </Typography>
                        <Box sx={{ display: "Flex", flexDirection: "row" }}>
                          <CircleOutlinedIcon />
                          <Typography sx={{ marginLeft: "2%" }}>
                            {way.flight_data.flight_0.arrival.datetime.time_12h}
                          </Typography>
                          <Tooltip
                            title={
                              way.flight_data.flight_0.arrival.airport.name
                            }
                          >
                            <Typography sx={{ marginLeft: "5%" }}>
                              {way.flight_data.flight_0.arrival.airport.code}
                            </Typography>
                          </Tooltip>
                        </Box>
                      </Box>
                      {way.flight_data &&
                        mapValues(way.flight_data).map((value, index) => (
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
                                {"Connection Time - "}
                                {getTime(
                                  way.flight_data[`flight_${index}`].arrival
                                    .datetime.time_24h,
                                  way.flight_data[`flight_${index + 1}`]
                                    .departure.datetime.time_24h
                                )}
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
                                sx={{ display: "Flex", flexDirection: "row" }}
                              >
                                <CircleOutlinedIcon />
                                <Typography sx={{ marginLeft: "2%" }}>
                                  {value.departure.datetime.time_12h}
                                </Typography>
                                <Tooltip title={value?.departure.airport.name}>
                                  <Typography sx={{ marginLeft: "5%" }}>
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
                                sx={{ display: "Flex", flexDirection: "row" }}
                              >
                                <CircleOutlinedIcon />
                                <Typography sx={{ marginLeft: "2%" }}>
                                  {value.arrival.datetime.time_12h}
                                </Typography>
                                <Tooltip title={value?.arrival.airport.name}>
                                  <Typography sx={{ marginLeft: "5%" }}>
                                    {value.arrival.airport.code}
                                  </Typography>
                                </Tooltip>
                              </Box>
                            </Box>
                          </>
                        ))}
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
            ))}
        </Box>
      </Popover>
    </>
  );
};
