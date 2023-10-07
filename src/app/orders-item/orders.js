"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { BiMenu } from "react-icons/bi";
import Link from "next/link";
import {FaCartPlus} from "react-icons/fa6";
import { Vortex } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../Redux/toggleSlice";
import { BiArrowBack } from "react-icons/bi";
import {
  showErrorToast,
} from "../components/Toast";
import SideBar from "../components/SideBar";

export default function Orders() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_SERVER_API;
  const { systemTheme } = useTheme();
  const [menuToggle, setMenuToggle] = useState(true);
  const [order, setOrder] = useState(null);
  useEffect(() => {
    try {
      if (status === "unauthenticated") {
        router.push("/Authenticate");
      } else if(session?.user?.email) {
        const fetchData = async () => {
          try {
            const email = await session.user.email;

            const ordersItem = await fetch(
              `${api}/getOrders?email=${encodeURIComponent(email)}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const ordersItemResponse = await ordersItem.json();
            setOrder(ordersItemResponse);

            if (ordersItem.status === 500) {
              showErrorToast(ordersItemResponse);
            } else if (ordersItem.status === 400) {
              showInfoToast(ordersItemResponse);
            }
          } catch (error) {
            showErrorToast("failed to fetch try again");
            console.log(error)
          }
        };

        fetchData();
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  }, [session]);

  const toggle = () => {
    setMenuToggle(!menuToggle);
    dispatch(toggleSidebar());
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <div className="h-screen">
        <div
          className={`flex justify-between items-center shadow-md py-3 md:py-5 px-2 pr-7 z-40 fixed ${
            systemTheme === "dark"
              ? "bg-black text-white"
              : "bg-white text-black"
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
          <h1 className="font-semibold">Your Orders {order ? order.length : 0}</h1>
          </div>

          <Link href="/addtocard" className="hidden md:block cursor-pointer">
            <FaCartPlus size={30} />
          </Link>
        </div>

       <SideBar/>

        <div className="flex justify-center h-screen overflow-auto mb-16">
          <div
            className={`flex flex-col items-center mt-36 ${
              menuToggle ? "md:ml-64 duration-300" : "duration-200"
            }`}
          >
            <div className="xl:w-2/4 lg:w-3/4 ">
              {order ? (
                Array.isArray(order) && order.length > 0 ? (
                  // Map through responseData and render each product as a card
                  order.map((orderItems, index) => (
                    <div
                      key={index}
                      className="border-gray-300 rounded-lg p-4 shadow-md flex items-center mb-4"
                    >
                      {/* Image (you can add an <img> tag here) */}
                      <div>
                        <div className="w-28 h-28 bg-gray-200 mr-4 relative">
                          {/* Add your image here */}
                          <img
                            src={orderItems.variantImage}
                            alt=""
                            className="w-full h-full object-cover object-center"
                            style={{
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                          />
                        </div>
                      </div>

                      {/* Product Information */}
                      <div className="flex-grow">
                        <p className="text-xl font-semibold line-clamp-2">
                          {orderItems.productName}
                        </p>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-600">
                              Price: ${orderItems.data.productAmount}
                            </p>
                            {orderItems.data.productList.map(
                              (product, productIndex) => (
                                <p className="text-gray-600" key={productIndex}>
                                  Quantity: {product.quantity}
                                </p>
                              )
                            )}
                            <p className="text-gray-600">
                              trackingNum:{" "}
                              {orderItems.data.trackNumber
                                ? orderItems.data.trackNumber
                                : "Under process..."}
                            </p>
                          </div>
                          {/* Buy Now Button */}
                          <div>
                            <Link
                              href={"/tracking"}
                              className="bg-black text-white text-sm px-2 md:px-4 py-2 rounded"
                            >
                              Track
                            </Link>
                          </div>
                          <div className="ml-5 md:ml-0">
                            <button
                              onClick={() => contineu(orderItems.variantId)}
                              className="bg-black text-white text-sm px-2 md:px-4 py-2 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border-gray-300 rounded-lg p-4 shadow-md">
                    <p>No order yet</p>
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
                    colors={["gray", "black", "gray", "black", "gray", "black"]}
                  />
                  <h5>Orders...</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
