"use client"

import React from 'react'
import { useSession,signOut } from 'next-auth/react'
import Link from 'next/link'
import { useTheme } from "next-themes";
import { BiSolidShoppingBags, BiSupport } from "react-icons/bi";
import { LuLogOut, LuHelpCircle } from "react-icons/lu"
import { FcPaid } from "react-icons/fc";
import { MdFeedback } from "react-icons/md";
import { useSelector } from "react-redux";
import { Bars } from 'react-loader-spinner';
import { MdVerified } from "react-icons/md";
import {
  FaHouse,
  FaMapLocationDot,
  FaNewspaper,
} from "react-icons/fa6";
import { showErrorToast } from './Toast';

export default function SideBar() {
    const {data:session,status} = useSession();
    const { systemTheme } = useTheme();
    const isOpen = useSelector((state) => state.toggle.isOpen);

    const logout = async () => {
        try {
          await localStorage.removeItem("jwt");
          await signOut("google");
        } catch (error) {
          showErrorToast("An error occurred during navigation:");
        }
      };
      
  return (
    <>
     <div
        className={`hidden md:block ${
            isOpen  ? "w-60 border-r-2 " : "w-1 bg-transparent"
        } duration-300 h-screen overflow-y-auto custom-scrollbar fixed z-30 top-20 pt-7 px-5 gap-9 ${
          systemTheme === "dark" ? "bg-side-bar-dark" : " bg-side-bar"
        }`}
      >
        <div className={`${isOpen  ? "block" : "hidden"}`}>
        {status === 'loading' ? (
  // Display loading text while loading
  <div className="flex justify-center mb-20 mt-2">
    <Bars
  height="30"
  width="30"
  color="red"
  ariaLabel="bars-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
/>
  </div>
) : status === 'authenticated' ? (
  // Render user information when authenticated
  <>
    <div className="flex justify-center">
      <img
        className="rounded-full h-12 w-12"
        src={session?.user?.image}
        alt="profile"
      />
    </div>
    <div className=" mt-5 text-md flex justify-center items-center">
      <h3 className="pl-3">@{session?.user?.name}</h3>
      <MdVerified size={17} color='blue' className='ml-1'/>
    </div>
    <div className=" mt-2 text-sm border-b-2 pb-7 mb-5">
      <h3 className="pl-3">{session?.user?.email}</h3>
    </div>
  </>
) : (
  // Render sign-in button when not authenticated
  <Link
    href={'/Authenticate'}
    className=" mt-5 text-md flex justify-center bg-slate-700 hover:bg-slate-200 cursor-pointer gap-x-2 mb-16"
  >
    <div className="py-2">
      <LuLogOut size={20} />
    </div>
    <h3 className="py-2">Signin</h3>
  </Link>
)}


          <div className="border-b-2">
            <Link href="/">
              <div
                className={`flex cursor-pointer mb-6 hover:bg-white hover:text-black rounded-xl px-3`}
              >
                <FaHouse size={20} />
                <p className="pl-3">Home</p>
              </div>
            </Link>
            <Link
              href={
                status === "unauthenticated"
                  ? "/Authenticate"
                  : "/paid/product/item"
              }
            >
              <div
                className={`flex cursor-pointer mb-6 hover:bg-white hover:text-black rounded-xl px-3`}
              >
                <FcPaid size={20} />
                <p className="pl-3">Paid item</p>
              </div>
            </Link>
            <Link
              href={
                status === "unauthenticated" ? "/Authenticate" : "/orders-item"
              }
            >
              <div
                className={`flex cursor-pointer mb-6 hover:bg-white hover:text-black rounded-xl px-3`}
              >
                <BiSolidShoppingBags size={20} />
                <p className="pl-3">Orders</p>
              </div>
            </Link>
            <Link
              href={
                status === "unauthenticated" ? "/Authenticate" : "/tracking"
              }
            >
              <div
                className={`flex cursor-pointer mb-6 hover:bg-white hover:text-black rounded-xl px-3`}
              >
                <FaHouse size={20} />
                <p className="pl-3">Tracking</p>
              </div>
            </Link>
            <Link
              href={status === "unauthenticated" ? "/Authenticate" : "/savedAddress"}
            >
              <div
                className={`flex cursor-pointer mb-6 hover:bg-white hover:text-black rounded-xl px-3`}
              >
                <FaMapLocationDot size={20} />
                <p className="pl-3">Address</p>
              </div>
            </Link>
            <div
              onClick={logout}
              className={`flex cursor-pointer mb-6 hover:bg-white hover:text-black rounded-xl px-3`}
            >
              <LuLogOut
                className={`${status === "authenticated" ? "" : "hidden"}`}
                size={20}
              />
              <p
                className={`pl-3 ${
                  status === "authenticated" ? "" : "hidden"
                }`}
              >
                Logout
              </p>
            </div>
          </div>
          <div className="border-b-2 mt-5">
            <Link href="/contact-us">
              <div
                className={`flex cursor-pointer mb-6 hover:bg-white hover:text-black rounded-xl px-3`}
              >
                <BiSupport size={20} />
                <p className="pl-3">Contact us</p>
              </div>
            </Link>
            <Link href="/">
              <div
                className={`flex cursor-pointer mb-6 hover:bg-white hover:text-black rounded-xl px-3`}
              >
                <LuHelpCircle size={20} />
                <p className="pl-3">Get help</p>
              </div>
            </Link>
            <Link href="/Terms&Condition">
              <div
                className={`flex cursor-pointer mb-6 hover:bg-white hover:text-black rounded-xl px-3`}
              >
                <FaNewspaper size={20} />
                <p className="pl-3">Terms of use</p>
              </div>
            </Link>
            <Link href="/feedback">
              <div
                className={`flex cursor-pointer mb-6 hover:bg-white hover:text-black rounded-xl px-3`}
              >
                <MdFeedback size={20} />
                <p className="pl-3">Feedback</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
