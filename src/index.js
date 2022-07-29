import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51JNtd5EEWahky04aXtU0xPztXhqL1Mhh3DkpornhvXZMEMNSSizYwx2LqsGDpmVcRmcRgntP9dC5oeCAJNxsb6zm00ICxZ3Nzm"
);

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <Elements stripe={stripePromise}>
//       <App />
//     </Elements>
//   </React.StrictMode>
// );
const Base = () => {
  return (
    <React.StrictMode>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </React.StrictMode>
  );
};

const rootElement = document.getElementById("root");

ReactDOM.render(<Base />, rootElement);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
