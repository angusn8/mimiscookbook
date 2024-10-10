import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { connectSupabase } from "./utils/supabase";
import { useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function RootComponent() {
  useEffect(() => {
    connectSupabase();
  }, []);

  return (
    <div>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x"
          crossOrigin="anonymous"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
          crossOrigin="anonymous"
        />
        <title>Mimi's Cookbook | Home</title>
      </head>
      <App />
      <script src="/static/js/index.js"></script>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4"
        crossOrigin="anonymous"
      ></script>
    </div>
  );
}

root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
