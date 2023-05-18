import { GridView } from "@mui/icons-material";
import {
  Box,
  Divider,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import React from "react";
import logo from "./../../png.png";
import { useState } from "react";
import { Button } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

export const Compare = () => {
  const [checked, setChecked] = useState(false);
  const [flightData, setFlightData] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const handleExpand = (event, isExpanded) => {
    setExpanded(isExpanded);
  };
  console.log("flightData");
  console.log(flightData);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const CallAPI = async () => {
    const url =
      "https://priceline-com-provider.p.rapidapi.com/v2/flight/roundTrip?sid=iSiX639&adults=1&departure_date=2023-12-21%2C2023-12-25&destination_airport_code=JFK%2CYWG&origin_airport_code=YWG%2CJFK";

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Host": "priceline-com-provider.p.rapidapi.com",
        "X-RapidAPI-Key": "91bd8cf149msh10c65b76df66871p1185a2jsnd808611734d1",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
      setFlightData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Button onClick={CallAPI} variant="contained"></Button>

      <Box
        boxShadow={15}
        sx={{
          width: "50%",
          height: "250px",
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
        <div style={{ marginLeft: "2%", marginBottom: "-1%" }}>
          <div style={{ marginLeft: "-1%" }}>
            <img
              src={logo}
              alt="airline"
              style={{
                width: "9%",
                marginTop: "1%",
                border: "1px solid",
                borderColor: "black",
                borderRadius: "10%",
              }}
            />
            <Box sx={{ marginTop: "4%" }}>
              <Typography
                sx={{
                  marginLeft: "14%",
                  marginTop: "-14%",
                  marginBottom: "-4.5%",
                  fontSize: 25,
                }}
              >
                Time Depart
              </Typography>
              <Typography
                sx={{
                  marginLeft: "43%",
                  marginTop: "-3%",
                  marginBottom: "-3.5%",
                  fontSize: 18,
                }}
              >
                Total Time
              </Typography>
              <Typography
                sx={{ marginLeft: "66%", marginTop: "-3%", fontSize: 25 }}
              >
                Time Depart
              </Typography>
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
            <span
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
            <Typography
              sx={{ marginLeft: "16%", fontSize: 25, marginTop: ".15%" }}
            >
              Airport
            </Typography>
            <Typography
              sx={{
                marginLeft: "43%",
                marginTop: "-4%",
                marginBottom: "-3.5%",
                fontSize: 18,
              }}
            >
              Direct / Stop
            </Typography>
            <Typography
              sx={{ marginLeft: "70%", fontSize: 25, marginTop: "-4%" }}
            >
              Airport
            </Typography>
          </div>
          <div
            style={{ marginTop: "5%", marginBottom: "1%", marginLeft: "-1%" }}
          >
            <img
              src={logo}
              alt="airline"
              style={{
                width: "9%",
                marginTop: "4%",
                border: "1px solid",
                borderColor: "black",
                borderRadius: "10%",
              }}
            />
            <Box sx={{ marginTop: "1%" }}>
              <Typography
                sx={{
                  marginLeft: "14%",
                  marginTop: "-10.5%",
                  marginBottom: "-4.5%",
                  fontSize: 25,
                }}
              >
                Time Depart
              </Typography>
              <Typography
                sx={{
                  marginLeft: "43%",
                  marginTop: "-3%",
                  marginBottom: "-3.5%",
                  fontSize: 18,
                }}
              >
                Total Time
              </Typography>
              <Typography
                sx={{ marginLeft: "66%", marginTop: "-4%", fontSize: 25 }}
              >
                Time Depart
              </Typography>
              <Divider
                style={{
                  width: "55%",
                  borderWidth: 1,
                  background: "black",
                  marginLeft: "20%",
                  marginTop: ".25%",
                }}
              />
              <span
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
              <Typography
                sx={{ marginLeft: "16%", fontSize: 25, marginTop: ".15%" }}
              >
                Airport
              </Typography>
              <Typography
                sx={{
                  marginLeft: "43%",
                  marginTop: "-4%",
                  marginBottom: "-3.5%",
                  fontSize: 18,
                }}
              >
                Direct / Stop
              </Typography>
              <Typography
                sx={{ marginLeft: "70%", fontSize: 25, marginTop: "-4.25%" }}
              >
                Airport
              </Typography>
            </Box>
            <Box
              style={{
                marginLeft: "90%",
                fontSize: 25,
                marginTop: "-185px",
                marginBottom: "90px",
              }}
            >
              Price
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "85%",
                fontSize: 25,
                marginTop: "-8%",
                marginBottom: "8%",
              }}
            >
              <Checkbox checked={checked} onChange={handleChange} />
              <Typography
                style={{ fontSize: 20, marginTop: "4.5%", marginLeft: "-5%" }}
              >
                Compare
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "85%",
                fontSize: 25,
                marginTop: "-4%",
              }}
              sx={{ minWidth: "180px" }}
            >
              <Typography
                style={{
                  fontSize: 20,
                  marginTop: "-1.5%",
                  marginLeft: "15%",
                }}
              >
                View Info
              </Typography>
              <LaunchIcon />
            </Box>
          </div>
        </div>
      </Box>

      <Box
        sx={{
          border: 3,
          borderRadius: 0,
          marginTop: "50px",
          marginBottom: "50px",
          marginLeft: "375px",
          marginRight: "375px",
          height: "auto",
        }}
      >
        <div>
          <Typography>Outbound</Typography>
          <Accordion expanded={expanded} onChange={handleExpand}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                border: 3,
                margin: 3,
                borderBottomLeftRadius: expanded ? 0 : 30,
                borderBottomRightRadius: expanded ? 0 : 30,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}
            >
              <div style={{ marginLeft: "5%" }}>
                <img
                  src={logo}
                  alt="airline"
                  style={{
                    width: "10%",
                    marginTop: "2.5%",
                    marginBottom: "-2.5%",
                    marginLeft: "-3%",
                    border: "1px solid",
                    borderColor: "black",
                    borderRadius: "10%",
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      marginLeft: "12%",
                      marginTop: "-8%",
                      marginBottom: "-5%",
                      fontSize: 25,
                    }}
                  >
                    Time Depart
                  </Typography>
                  <Typography
                    sx={{
                      marginLeft: "43%",
                      marginTop: "-3%",
                      marginBottom: "-5.5%",
                      fontSize: 18,
                    }}
                  >
                    Total Time
                  </Typography>
                  <Typography
                    sx={{ marginLeft: "66%", marginTop: "-4%", fontSize: 25 }}
                  >
                    Time Depart
                  </Typography>
                  <Divider
                    style={{
                      width: "60%",
                      borderWidth: 1,
                      background: "black",
                      marginLeft: "20%",
                      marginTop: ".25%",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "black",
                    }}
                  />
                  <Typography
                    sx={{ marginLeft: "16%", fontSize: 25, marginTop: ".15%" }}
                  >
                    Airport
                  </Typography>
                  <Typography
                    sx={{
                      marginLeft: "43%",
                      marginTop: "-4.75%",
                      marginBottom: "-5.5%",
                      fontSize: 18,
                    }}
                  >
                    Direct / Stop
                  </Typography>
                  <Typography
                    sx={{
                      marginLeft: "70%",
                      fontSize: 25,
                      marginTop: "-4",
                    }}
                  >
                    Airport
                  </Typography>
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
                marginTop: -3,
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
              }}
            >
              <Typography>Airline - Flight Number</Typography>
              <Box
                sx={{ marginLeft: "5%", marginTop: "2%", marginBottom: "2%" }}
              >
                <CircleOutlinedIcon />
                <Divider
                  orientation="vertical"
                  sx={{
                    background: "black",
                    width: "21%",
                    transform: "rotate(90deg)",
                    border: 1,
                    marginLeft: "-8.90%",
                    marginTop: "9.5%",
                    marginBottom: "10%",
                  }}
                />
                <CircleOutlinedIcon />
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Accordion 2</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </Box>
    </>
  );
};
