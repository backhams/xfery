"use client";
import React, { useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import BottomMenu from "../components/BottomMenu";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LuLogOut, LuHelpCircle } from "react-icons/lu";
import { BiSolidShoppingBags, BiSupport } from "react-icons/bi";
import { FcPaid } from "react-icons/fc";
import Link from "next/link";
import { Vortex } from "react-loader-spinner";
import { FaMapLocationDot, FaNewspaper } from "react-icons/fa6";
import { MdFeedback } from "react-icons/md";
import { showErrorToast } from "../components/Toast";
import { MdVerified } from "react-icons/md";


export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { systemTheme } = useTheme();
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Authenticate");
    }
  }, [status]);
  const logout = async () => {
    try {
      await localStorage.removeItem("jwt");
      await signOut("google");
    } catch (error) {
      showErrorToast("An error occurred during navigation:");
    }
  };

  // Check if the session data is still loading
  if (status === "loading") {
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
  // Check if the screen width is less than the medium breakpoint
  if (windowWidth > 768) {
    // Render a 404 page or any other appropriate action
    router.push("/");
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
      </div>
    );
  }
  const handleGoBack = ()=>{
    router.back()
  }

  return (
    <>
      <div className="h h-screen md:hiddefn">
        <div
          className={`flex justify-between items-center shadow-md py-3 px-2 pr-7 z-40 fixed ${
            systemTheme === "dark" ? "bg-black text-white" : "bg-white"
          } w-full top-0 md:pr-16`}
        >
          <button className="px-5 py-2" onClick={handleGoBack}>
            <BiArrowBack size={25} />
          </button>
          <h2 className="text-center flex-grow font-semibold text-lg">
            Dashboard
          </h2>
        </div>
        <div className="m mt-24 ml-7">
          <div className="">
            <img
              className="rounded-full h-16 w-16"
              src={session?.user?.image}
              alt="profile"
            />
          </div>
          <div className="flex items-center mt-2">
          <p className="text-sm">@{session?.user?.name}</p>
          <MdVerified size={15} color="blue" className="ml-1"/>
          </div>
          <p className="text-base mb-9">{session?.user?.email}</p>
          <div className="pb-5 mb-5 border-b-2">
            <div className="flex mb-5">
              <FcPaid size={20} />
              <Link href={"/paid/product/item"}>
                <p className="pl-3">Paid item</p>
              </Link>
            </div>
            <div className="flex mb-5">
              <BiSolidShoppingBags size={20} />
              <Link href={"/orders-item"}>
              <p className="pl-3">Orders</p>
              </Link>
            </div>
            <div className="flex mb-5">
              <BiSolidShoppingBags size={20} />
              <Link href={"/tracking"}>
              <p className="pl-3">Tracking</p>
              </Link>
            </div>
            <div className="flex mb-5">
              <FaMapLocationDot size={20} />
              <Link href={"/savedAddress"}>
              <p className="pl-3">Address</p>
              </Link>
            </div>
          </div>
          <div>
            <div className=" flex mb-5">
              <BiSupport size={20} />
              <Link href={"/contact-us"}>
              <p className="pl-3">Contact us</p>
              </Link>
            </div>
            <div className="flex mb-5">
              <LuHelpCircle size={20} />
              <Link href={"/getHelp"}>
              <p className="pl-3">Get help</p>
              </Link>
            </div>
            <div className="flex mb-5">
              <FaNewspaper size={20} />
              <Link href={"/Terms&Condition"}>
                <p className="pl-3">Terms of use</p>
              </Link>
            </div>
            <div className="flex mb-5">
              <MdFeedback size={20} />
              <Link href={"/feedback"}>
                <p className="pl-3">Feedback</p>
              </Link>
            </div>
            <div className="flex">
              <LuLogOut size={20} />
              <p onClick={logout} className="pl-3 hover:cursor-pointer">
                Logout
              </p>
            </div>
          </div>
          <div className="w-full flex justify-center mt-5">
            <Link href="/Terms&Condition">
              <h5 className="text-sm">Terms of service</h5>
            </Link>
          </div>
        </div>
        <BottomMenu />
      </div>
    </>
  );
}
