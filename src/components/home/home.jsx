import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider,
  DatePicker,
  DateField,
} from "@mui/x-date-pickers";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import "react-datepicker/dist/react-datepicker.css";

export const Home = () => {
  const [selectedValue, setSelectedValue] = useState("round_trip");
  const [selectedDate, setSelectedDate] = useState(null);
  const today = new Date("2023-05-07");
  const [age, setAge] = React.useState("");

  const handledChange = (event) => {
    setAge(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  function RowRadioButtonsGroup() {
    return (
      <RadioGroup
        row
        aria-labelledby="radio-buttons"
        name="row-radio-buttons-group"
      >
        <FormControlLabel
          value="flight_num"
          control={<Radio />}
          label="Flight Number"
        />
        <FormControlLabel value="cities" control={<Radio />} label="Cities" />
      </RadioGroup>
    );
  }

  function SearchByRoundTrip() {
    const [showDateRange, setShowDateRange] = useState(false);
    const defaultSelected = {
      from: today,
      to: today,
    };
    const [range, setRange] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const endPickerRef = useRef(null);

    const handleStartChange = (date) => {
      setStartDate(date);
      endPickerRef.current?.setOpen(true);
    };

    const handleEndChange = (date) => {
      setEndDate(date);
    };

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ marginRight: 2 }}>From:</Typography>
        <TextField id="fromAirport" label="" variant="outlined" />
        <SyncAltIcon
          variant="contained"
          sx={{ bgcolor: "primary.main", color: "white", borderRadius: 1 }}
        />
        <Typography sx={{ marginRight: 2 }}>To:</Typography>
        <TextField id="toAirport" label="" variant="outlined" />
        <Typography sx={{ marginRight: 2, marginLeft: 2 }}>
          Depart - Return:
        </Typography>
        {/*
        <TextField
          id="date-range"
          type="text"
          onClick={() => setShowDateRange(true)}
          value={
            range.to
              ? `${format(range.from, "PPP")} - ${format(range.to, "PPP")}`
              : format(range.from, "PPP")
          }
        />
        {showDateRange && (
          <DayPicker
            defaultMonth={today}
            selected={range}
            onSelect={setRange}
            captionLayout="dropdown"
            fromYear={2015}
            toYear={2025}
            numberOfMonths={2}
            showOutsideDays
          />
        )}*/}

        {/*}        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          isClearable
        />*/}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div>
            <TextField
              id="start-date"
              label="From"
              value={startDate ? startDate.toDateString() : ""}
              onChange={() => {}}
            />
            <DatePicker
              label="From"
              value={startDate}
              onChange={handleStartChange}
              renderInput={() => null}
              onClick={() => endPickerRef.current?.focus()}
            />
          </div>
          <div>
            <TextField
              id="end-date"
              label="To"
              value={endDate ? endDate.toDateString() : ""}
              inputRef={endPickerRef}
              onChange={() => {}}
            />
            <DatePicker
              label="To"
              value={endDate}
              onChange={handleEndChange}
              renderInput={() => null}
            />
          </div>
        </LocalizationProvider>

        {/* {startDate && endDate && (
            <p>
              Selected date range: {startDate.toLocaleDateString()} -
              {endDate.toLocaleDateString()}
            </p>
          )}*/}
      </Box>
    );
  }

  function SearchByOneWay() {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ marginRight: 2 }}>From:</Typography>
        <TextField id="fromAirport" label="" variant="outlined" />
        <Typography sx={{ marginRight: 2 }}>To:</Typography>
        <TextField id="toAirport" label="" variant="outlined" />
        <Typography sx={{ marginRight: 2, marginLeft: 2 }}>Depart:</Typography>
        {/*<PickDate />*/}
      </Box>
    );
  }

  {
    /*  function PickDate() {
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          format="YYYY-MM-DD"
        />
      </LocalizationProvider>
    );
  }*/
  }

  return (
    <>
      <Box
        sx={{
          width: 800,
          height: 300,
          borderRadius: 4,
          margin: "auto",
          border: 3,
          padding: 10,
          marginTop: 10,

          overflow: "hidden",
          position: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ marginRight: 2 }}>Search By</Typography>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={selectedValue}
            onChange={handleChange}
          >
            <FormControlLabel
              value="round_trip"
              control={<Radio />}
              label="Round Trip"
            />
            <FormControlLabel
              value="one_way"
              control={<Radio />}
              label="One Way"
            />
          </RadioGroup>
        </Box>
        <Box sx={{ marginTop: 5 }}>
          {selectedValue === "round_trip" ? (
            <SearchByRoundTrip />
          ) : (
            <SearchByOneWay />
          )}
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={1}
              onChange={handledChange}
            >
              <MenuItem value={1}>Economy</MenuItem>
              <MenuItem value={2}>Premium Economy</MenuItem>
              <MenuItem value={3}>Business</MenuItem>
              <MenuItem value={4}>First</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          size="medium"
          //onClick={CallAviation}
          sx={{ marginTop: 10 }}
        >
          Search Flight
        </Button>
      </Box>
    </>
  );
};
