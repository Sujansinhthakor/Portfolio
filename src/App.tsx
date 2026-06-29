import { useState } from "react";

import "./App.css";
import Portfolio from "./components/portfolio";
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <>
      <Toaster />
      <Portfolio />

    </>
  );
}

export default App;
