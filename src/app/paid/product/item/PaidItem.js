"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BiMenu } from "react-icons/bi";
import Link from "next/link";
import { FaCartPlus } from "react-icons/fa6";
import { Vortex } from 'react-loader-spinner';
import { useDispatch } from "react-redux";
import { toggleSidebar } from "@/app/Redux/toggleSlice";
import BottomMenu from "@/app/components/BottomMenu";
import { setVariantData } from "@/app/Redux/Slice";
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import SideBar from "@/app/components/SideBar";
import { showErrorToast } from "@/app/components/Toast";
import { BiArrowBack } from "react-icons/bi";

export default function PaidItem() {
  const { systemTheme } = useTheme();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [responseData, setResponseData] = useState(null);
  const [menuToggle, setMenuToggle] = useState(true);
  const dispatch = useDispatch();
  const api = process.env.NEXT_PUBLIC_SERVER_API

  const toggle = () => {
    setMenuToggle(!menuToggle);
    dispatch(toggleSidebar());
  };
  const contineu = async (variantId) =>{
    router.push("/createOrder/paid");
    dispatch(setVariantData(variantId));
  }
  useEffect(()=>{
    if(status ==="unauthenticated"){
        router.push("/Authenticate")
    }
 },[status])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${api}/paidProductList?email=${session.user.email}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          setResponseData(data);
        } catch (error) {
          showErrorToast("Failed while fetching data");
        }
      };

      fetchData();
    }
  }, [session, status]);

  const handleGoBack = () => {
    router.back();
  };
  return (
    <>
      <div
        className={`flex justify-between items-center shadow-md py-3 md:py-5 px-2 pr-7 z-40 fixed ${
          systemTheme === "dark" ? "bg-black text-white" : "bg-white text-black"
        } w-full top-0 md:pr-16`}
      >
        <div className={"flex justify-center items-center"}>
          <BiMenu
            onClick={toggle}
            className="hidden mr-10 cursor-pointer md:block"
            size={30}
          />
         <button className="px-5 py-2" onClick={handleGoBack}>
            <BiArrowBack size={25} />
          </button>
          <h1 className="font-semibold">Your Paid Item</h1>
        </div>

        <Link href="/addtocard" className="hidden md:block cursor-pointer">
          <FaCartPlus size={30} />
        </Link>
      </div>
      <SideBar/>
      <div className="flex justify-center h-screen overflow-auto mb-16">
        <div className={`flex flex-col items-center mt-36 ${
              menuToggle ? "md:ml-64 duration-300" : "duration-200"}`}>
          <div className="xl:w-2/4 lg:w-3/4 ">
            {responseData ? (
              Array.isArray(responseData) && responseData.length > 0 ? (
                responseData.map((product, index) => (
                  <div
                    key={index}
                    className="border-gray-300 rounded-lg p-4 shadow-md flex items-center mb-4"
                  >
                    {/* Image (you can add an <img> tag here) */}
                    <div>
                      <div className="w-24 h-24 bg-gray-200 mr-4">
                        {/* Add your image here */}
                      </div>
                    </div>

                    {/* Product Information */}
                    <div className="flex-grow">
                      <p className="text-xl font-semibold line-clamp-2">
                        {product.productName}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-600">
                            Price: {product.price}
                          </p>
                          <p className="text-gray-600">
                            Quantity: {product.quantity}
                          </p>
                        </div>
                        {/* Buy Now Button */}
                        <div>
                          <button onClick={() => contineu(product.variantId)} className="bg-black text-white px-4 py-2 rounded">
                            continue...
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border-gray-300 rounded-lg p-4 shadow-md">
                  <p>No paid items</p>
                </div>
              )
            ) : (
              // Render loading state while waiting for data
              <div>
              <Vortex
        visible={true}
        height={60}
        width={60}
        ariaLabel="vortex-loading"
        wrapperStyle={{}}
        wrapperClass="vortex-wrapper"
        colors={['gray', 'black', 'gray', 'black', 'gray', 'black']}
      />
      <h5>Paid...</h5>
      </div>
            )}
          </div>
        </div>
      </div>
      <BottomMenu />
    </>
  );
}
