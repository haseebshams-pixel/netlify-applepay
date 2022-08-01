import React, { useState, useEffect } from "react";
import {
  PaymentRequestButtonElement,
  useStripe,
} from "@stripe/react-stripe-js";

const App = () => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [totalPrice, setPrice] = useState(100);
  const handleButtonClicked = (event) => {
    paymentRequest.on("paymentmethod", handlePaymentMethodReceived);
    paymentRequest.on("cancel", () => {
      paymentRequest.off("paymentmethod");
    });
    return;
  };
  const handlePaymentMethodReceived = async (event) => {
    // Send the payment details to our function.
    const paymentDetails = {
      payment_method: event.paymentMethod.id,
      shipping: {
        name: event.shippingAddress.recipient,
        phone: event.shippingAddress.phone,
        address: {
          line1: event.shippingAddress.addressLine[0],
          city: event.shippingAddress.city,
          postal_code: event.shippingAddress.postalCode,
          state: event.shippingAddress.region,
          country: event.shippingAddress.country,
        },
      },
    };
    const response = await fetch("/.netlify/functions/create-payment-intent", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentDetails }),
    }).then((res) => {
      return res.json();
    });
    if (response.error) {
      // Report to the browser that the payment failed.
      console.log(response.error);
      event.complete("fail");
    } else {
      // Report to the browser that the confirmation was successful, prompting
      // it to close the browser payment method collection interface.
      event.complete("success");
      // Let Stripe.js handle the rest of the payment flow, including 3D Secure if needed.
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        response.paymentIntent.client_secret
      );
      if (error) {
        console.log(error);
        return;
      }
      if (paymentIntent.status === "succeeded") {
        console.log("/success");
      } else {
        console.warn(
          `Unexpected status: ${paymentIntent.status} for ${paymentIntent}`
        );
      }
    }
  };

  useEffect(() => {
    if (stripe && paymentRequest === null) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Demo total",
          amount: totalPrice + 350,
          pending: true,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: true,
        shippingOptions: [
          {
            id: "standard-global",
            label: "Global shipping",
            detail: "Handling and delivery fee",
            amount: 350,
          },
        ],
      });
      // Check the availability of the Payment Request API first.
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, paymentRequest, totalPrice]);

  useEffect(() => {
    if (paymentRequest) {
      paymentRequest.update({
        total: {
          label: "Demo total",
          amount: totalPrice + 350,
          pending: false,
        },
      });
    }
  }, [totalPrice, paymentRequest]);

  if (paymentRequest) {
    return (
      <PaymentRequestButtonElement
        options={{ paymentRequest }}
        onClick={handleButtonClicked}
      />
    );
  }

  // Use a traditional checkout form.
  return "Not Supported";
};

export default App;

// import React, { useMemo, useState, useEffect } from "react";
// import {
//   useStripe,
//   PaymentRequestButtonElement,
// } from "@stripe/react-stripe-js";

// const useOptions = (paymentRequest) => {
//   const options = useMemo(
//     () => ({
//       paymentRequest,
//       style: {
//         paymentRequestButton: {
//           theme: "dark",
//           height: "48px",
//           type: "donate",
//         },
//       },
//     }),
//     [paymentRequest]
//   );

//   return options;
// };

// const usePaymentRequest = ({ options, onPaymentMethod }) => {
//   const stripe = useStripe();
//   const [paymentRequest, setPaymentRequest] = useState(null);
//   const [canMakePayment, setCanMakePayment] = useState(false);

//   useEffect(() => {
//     if (stripe && paymentRequest === null) {
//       const pr = stripe.paymentRequest(options);
//       setPaymentRequest(pr);
//     }
//   }, [stripe, options, paymentRequest]);

//   useEffect(() => {
//     let subscribed = true;
//     if (paymentRequest) {
//       paymentRequest.canMakePayment().then((res) => {
//         if (res && subscribed) {
//           setCanMakePayment(true);
//         }
//       });
//     }

//     return () => {
//       subscribed = false;
//     };
//   }, [paymentRequest]);

//   useEffect(() => {
//     if (paymentRequest) {
//       paymentRequest.on("paymentmethod", onPaymentMethod);
//     }
//     return () => {
//       if (paymentRequest) {
//         paymentRequest.off("paymentmethod", onPaymentMethod);
//       }
//     };
//   }, [paymentRequest, onPaymentMethod]);

//   return canMakePayment ? paymentRequest : null;
// };

// const PaymentRequestForm = () => {
//   const paymentRequest = usePaymentRequest({
//     options: {
//       country: "US",
//       currency: "usd",
//       total: {
//         label: "Demo total",
//         amount: 1000,
//       },
//     },
//     onPaymentMethod: ({ complete, paymentMethod, ...data }) => {
//       console.log("[PaymentMethod]", paymentMethod);
//       console.log("[Customer Data]", data);
//       complete("success");
//     },
//   });
//   const options = useOptions(paymentRequest);

//   if (!paymentRequest) {
//     return null;
//   }

//   return (
//     <PaymentRequestButtonElement
//       className="PaymentRequestButton"
//       options={options}
//       onReady={() => {
//         console.log("PaymentRequestButton [ready]");
//       }}
//       onClick={(event) => {
//         console.log("PaymentRequestButton [click]", event);
//       }}
//       onBlur={() => {
//         console.log("PaymentRequestButton [blur]");
//       }}
//       onFocus={() => {
//         console.log("PaymentRequestButton [focus]");
//       }}
//     />
//   );
// };

// export default PaymentRequestForm;
