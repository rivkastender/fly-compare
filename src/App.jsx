import React, { useReducer } from "react";
import { Home } from "./components/home/home";
import { Compare } from "./components/compare/compare";
import { Status } from "./components/status/status";
import { Header } from "./components/header/header";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Divider } from "@mui/material";
import { compareReducer } from "./state/compare-reducer";
import { CompareContext } from "./state/compare-context";

function App() {
  const [compareState, compareDispatch] = useReducer(compareReducer, {
    compare: [],
  });

  return (
    <HashRouter>
      <Header />
      <Divider
        sx={{ marginTop: 1, borderColor: "#04628F", borderWidth: 1.5 }}
      />
      <CompareContext.Provider value={{ compareState, compareDispatch }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/status" element={<Status />} />
        </Routes>
      </CompareContext.Provider>
    </HashRouter>
  );
}

export default App;
