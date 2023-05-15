import * as React from "react";
import { Home } from "./components/home/home";
import { Compare } from "./components/compare/compare";
import { Status } from "./components/status/status";
import { Header } from "./components/header/header";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Divider } from "@mui/material";

function App() {
  return (
    <HashRouter>
      <Header />
      <Divider
        sx={{ marginTop: 1, borderColor: "#04628F", borderWidth: 1.5 }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
