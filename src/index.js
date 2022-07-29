import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51JzZuXHlJ57SdeJaeSzuMD7oHsPQa05OesccvVzDKFDsjpVVQWyQIT1EyrI4FfAQNWZNzWfkhc6cuiz5kk6NVqhP00EnouzOCE"
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
