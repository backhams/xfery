"use client"
import React from 'react'
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from 'next/navigation';

export default function BackArrow() {
    const router = useRouter();
    const back = async () =>{
        router.back()
    }
  return (
    <>
     {/* Back Arrow Icon */}
     <div onClick={back} className="md:fixed top-0 left-0 p-4 hover:cursor-pointer ml-3 mt-2">
      <BiArrowBack size={25} />
      </div>
    </>
  )
}
