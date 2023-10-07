"use client"

import React, { useState } from 'react';
import { useTheme } from "next-themes";
import { showErrorToast, showWarningToast } from '../components/Toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const { systemTheme } = useTheme();
  const api = process.env.NEXT_PUBLIC_SERVER_API;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tracking, setTracking] = useState([]);
  const [shippingDetails, setShippingDetails] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackingNumberChange = (e) => {
    setTrackingNumber(e.target.value);
  };

  const handleTrackButtonClick = async () => {
    try {
      setIsLoading(true);
      if(!trackingNumber){
        setIsLoading(false);
        showWarningToast("Please enter your tracking number.")
      } else if(status==="authenticated" && session?.user?.email){
        const email = await session.user.email;
        const response = await fetch(`${api}/orderTracking?email=${email}&trackingId=${trackingNumber}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        const data = await response.json();
        setIsLoading(false);
        if(data.data.length===0){
          showWarningToast("No tracking information was found with this ID.")
          setShowCart(false);
        } else{
          setShippingDetails(data);
          setTracking(data.data)
          setShowCart(true);
        }
      } else {
        router.push("/Authenticate")
      }
     
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Oops! please try again.")
    }
  };
  

  return (
    <>
    <div className={`min-h-screen flex flex-col justify-center items-center ${systemTheme==="dark"? "bg-searchbox" : "bg-gray-200"}`}>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Track Your Order</h1>
        <p>Enter your tracking number below:</p>
      </div>

      <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:items-center mb-4">
        <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-4">
          <input
            type="text"
            placeholder="Enter Tracking Number"
            className="border p-2"
            value={trackingNumber}
            onChange={handleTrackingNumberChange}
          />
          <button
            onClick={handleTrackButtonClick}
            className="bg-blue-500 text-white px-4 py-2 rounded md:mt-0 mt-2"
            disabled={isLoading}
          >
          {isLoading ? 'Loading...' : 'Track'}
          </button>
        </div>
      </div>

      <div className={`shipping-details ${systemTheme==="dark"?"bg-black" : "bg-white"} p-6 rounded-lg shadow-md  ${showCart ? '' : 'hidden'}`}>
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-12 md:mb-0 md:mr-24">
            <h2 className="text-2xl font-semibold">Shipping Address</h2>
            <p><strong>Name:</strong> {shippingDetails.shippingCustomerName}</p>
            <p><strong>Phone Number:</strong> {shippingDetails.mobile}</p>
            <p><strong>Country:</strong> {shippingDetails.shippingCountry}</p>
            <p><strong>State:</strong> {shippingDetails.shippingProvince}</p>
            <p><strong>City:</strong> {shippingDetails.shippingCity}</p>
            <p><strong>Address:</strong> {shippingDetails.shippingAddress}</p>
            <p><strong>ZipCode:</strong> {shippingDetails.shippingZip}</p>
          </div>
          <div className=''>
            <h2 className="text-2xl font-semibold">Delivery Status</h2>
            <p><strong>Status:</strong> {tracking.trackingStatus}</p>
              <p><strong>Expected Delivery Date:</strong> {tracking.deliveryTime}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

