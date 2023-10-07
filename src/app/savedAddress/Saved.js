"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { showErrorToast } from '../components/Toast';
import { BiArrowBack } from "react-icons/bi";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Vortex } from "react-loader-spinner";

export default function Saved() {
  const [address, setAddress] = useState({});
  const { data: session, status } = useSession();
  const {systemTheme} = useTheme();
  const api = process.env.NEXT_PUBLIC_SERVER_API;
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Authenticate");
    } else if (session?.user?.email) {
      const sendData = async () => {
        try {
          const email = await session.user.email;
          const response = await fetch(`${api}/saveAddress?email=${email}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const responseData = await response.json();
          setLoading(false);
          if(!responseData){
            setLoading(true);
            router.push("/Address-shipment")
          } else {
            setAddress(responseData);
          }
        } catch (error) {
          showErrorToast("An error occurred:");
          console.log(error)
        }
      };
      sendData();
    }
  }, [status]);

  const handleBackClick = () => {
    router.back();
  };
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div>
          <Vortex
            visible={true}
            height={60}
            width={60}
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={["gray", "black", "gray", "black", "gray", "black"]}
          />
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  if (address.length===0) {
    return (
      <div className="h-screen flex justify-center items-center">
       <h1>Oops! Something went wrong. Unable to fetch address.</h1>
      </div>
    );
  }
  return (
    <>
     <button
        className=" font-bold text-left mb-2 ml-4 absolute top-5 left-5"
        onClick={handleBackClick}
      >
        <BiArrowBack size={25}/>
      </button>
      <div className="flex justify-center items-center h-screen">
        <div className={`${systemTheme==="dark"? "bg-searchbox text-white" : "bg-white texrt-black"} p-4 rounded shadow-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center mx-9`}>
          <h1 className="text-2xl font-bold mb-7">Saved Address</h1>

          <div className="mb-4 text-left">
            <div className=" flex justify-center items-center">
              <span className="font-bold mr-2">Name:</span>
              <span>{address.name}</span>
            </div>
            <div className=" flex justify-center items-center mt-3">
              <span className="font-bold mr-2">Mobile Num:</span>
              <span>{address.mobile}</span>
            </div>
            <div className=" flex justify-center items-center mt-3">
              <span className="font-bold mr-2">Country:</span>
              <span>{address.country}</span>
            </div>
            <div className=" flex justify-center items-center mt-3">
              <span className="font-bold mr-2">State:</span>
              <span>{address.state}</span>
            </div>
            <div className=" flex justify-center items-center mt-3">
              <span className="font-bold mr-2">City:</span>
              <span>{address.city}</span>
            </div>
            <div className=" flex justify-center items-center mt-3">
              <span className="font-bold mr-2">Address:</span>
              <span>{address.address}</span>
            </div>
            <div className=" flex justify-center items-center mt-3">
              <span className="font-bold mr-2">Zip Code:</span>
              <span>{address.zipCode}</span>
            </div>
            <div className=" flex justify-center items-center">
              <span className="font-bold mr-2">House Num:</span>
              <span>{address.houseNumber}</span>
            </div>
          </div>

          <Link href={"/Address-shipment"}
            className="bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold py-2 px-4 rounded"
          >
            Change
          </Link>
        </div>
      </div>
    </>
  );
}


