"use client"

import React, { useState } from 'react';
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";
import { useSession } from 'next-auth/react';
import { showErrorToast, showSuccessToast } from '../components/Toast';
import Link from 'next/link';

export default function Feedback() {
    const [selectedEmojiDescription, setSelectedEmojiDescription] = useState("");
  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const [textareaText, setTextareaText] = useState("");
  const [loading , setLoading] = useState(false);
  const isButtonDisabled = !(selectedEmojiDescription || selectedBoxes.length > 0 || textareaText);
  const router = useRouter();
  const { systemTheme } = useTheme();
  const {data:session , status} = useSession();
  const api = process.env.NEXT_PUBLIC_SERVER_API

  const emojisWithDescriptions = [
    { emoji: "😠", description: "Angry" },
    { emoji: "🙁", description: "Not Satisfied" },
    { emoji: "🙂", description: "Neutral" },
    { emoji: "😃", description: "Satisfied" },
    { emoji: "😍", description: "Very Satisfied" },
  ];

  const handleEmojiClick = (description) => {
    setSelectedEmojiDescription(description);
  };

  const handleBoxClick = (box) => {
    if (selectedBoxes.includes(box)) {
      setSelectedBoxes(selectedBoxes.filter(item => item !== box));
    } else {
      setSelectedBoxes([...selectedBoxes, box]);
    }
  };

  const handleTextareaChange = (event) => {
    setTextareaText(event.target.value); // Update the state with the textarea value
  };

  const handleGoBack = () => {
    router.back();
  };

  const buttonClasses = isButtonDisabled
    ? "bg-gray-400 cursor-not-allowed px-28 py-2 rounded-md text-white"
    : "bg-blue-500 hover:bg-blue-600 px-28 py-2 rounded-md text-white";
    
  const submitFeedback = async () =>{
    try{
        if(status === "authenticated" && session?.user?.email){
            const email = await session.user.email;
            const name = await session.user.name;
            setLoading(true)
            const response = await fetch(
                `${api}/feedback`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify({
                    selectedEmojiDescription,
                    selectedBoxes,
                    textareaText,
                    email
                }),
                }
              );
              const responseData = await response.json();
              setLoading(false)
              if(response.status===201){
                showSuccessToast(`${responseData} ${name} for your feedback`)
              } else {
                showErrorToast(responseData)
              }
        } else {
            router.push("/Authenticate")
        }
    }catch(error){
        showErrorToast(error.message)
        setLoading(false)
    }
  }

  return (
    <div className={`${systemTheme==="dark"?" " : "bg-feedback"} min-h-screen`}>
      <BiArrowBack className="hover:cursor-pointer ml-3 pt-3" onClick={handleGoBack} size={40} />
      <div className="flex justify-center items-center h-full">
        <div className={`${systemTheme==="dark"? " " : "bg-white"} mt-9 py-7 shadow-md rounded-md w-full max-w-md mx-4`}>
          <h1 className={`ml-5 text-2xl md:text-3xl lg:text-4xl ${systemTheme==="dark"? " " : "text-black"}`}>Feedback</h1>
          <div className="flex justify-center text-2xl md:text-3xl lg:text-4xl gap-x-4 my-6">
          {emojisWithDescriptions.map(({ emoji, description }) => (
              <h1
                key={emoji}
                onClick={() => handleEmojiClick(description)}
                className={`cursor-pointer ${
                  selectedEmojiDescription === description ? 'border border-blue-500 rounded-md p-1' : ''
                }`}
              >
                {emoji}
              </h1>
            ))}
          </div>
          <h2 className={`ml-5 text-lg md:text-xl lg:text-2xl my-5 ${systemTheme==="dark"? " " : "text-black"}`}>
            Tell us what can be improved?
          </h2>
          <div className="flex flex-wrap ml-5 mb-5">
            {[
              { text: "Overall services", key: "overall" },
              { text: "Customer support", key: "support" },
              { text: "Pickup & Delivery service", key: "delivery" },
              { text: "Service & Efficiency", key: "efficiency" },
              { text: "Transparency", key: "transparency" },
            ].map((box) => (
              <p
                key={box.key}
                onClick={() => handleBoxClick(box.key)}
                className={` text-black rounded-md px-3 py-2 mb-2 mr-2 cursor-pointer ${
                  selectedBoxes.includes(box.key) ? 'bg-blue-500 text-white' : 'bg-feedback-box'
                }`}
              >
                {box.text}
              </p>
            ))}
          </div>
          <textarea
            cols="30"
            rows="4"
            className="rounded-md pt-2 px-3 ml-5 my-5 bg-feedback-box w-10/12 md:w-11/12 text-black"
            style={{ resize: 'none' }}
            placeholder="Other suggestions..."
            value={textareaText}
            onChange={handleTextareaChange} 
          />
          <div className="flex justify-center items-center my-5">
            <button disabled={isButtonDisabled} onClick={submitFeedback} className={buttonClasses}>
              {loading? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
      {/* Footer with copyright information */}
      <footer className="text-center text-gray-500 mt-5">
        &copy; {new Date().getFullYear()} xfery.com. <Link className='border-b-2' href={"/Terms&Condition"}>Terms of use</Link>
      </footer>
    </div>
  );
}

