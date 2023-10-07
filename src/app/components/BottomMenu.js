"use client"
import React from 'react'
import { FaHouse, FaCartPlus } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { useSession } from 'next-auth/react'
import Link from "next/link"

export default function BottomMenu() {
  const {status}=useSession();
  return (
    <div className="w-full flex justify-center">
      <div className="flex justify-around bottom-3 fixed bg-black md:hidden text-white py-5 rounded-2xl w-4/5">
        <Link href="/">
          <FaHouse size={20} />
        </Link>
        <Link href="/addtocard">
          <FaCartPlus size={20} />
        </Link>
        <Link href={status==="unauthenticated"? "/Authenticate" : "/dashboard"}>
          <FaUser size={20} />
        </Link>
      </div>
    </div>
  )
}