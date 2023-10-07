"use client";

import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Vortex } from "react-loader-spinner";
import Link from "next/link";
import Typewriter from "typewriter-effect";
import { BiArrowBack } from "react-icons/bi";
import { showErrorToast } from "../components/Toast";

export default function Authenticate() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const api = process.env.NEXT_PUBLIC_SERVER_API

  useEffect(() => {
    // Only execute this code if the user is authenticated
    if (status === "authenticated" && session?.user?.email) {
      // Send user data to the backend using Axios
      const sendData = async () => {
        try {
          const email = session.user.email;
          const name = session.user.name;
          const response = await fetch(`${api}/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
            }),
          });

          const responseData = await response.json();

          if (response.status === 201) {
            const token = responseData; // Assuming the token is returned directly in the response
            await localStorage.setItem("jwt", token);
            await router.back();
          } else {
            showErrorToast("Failed to authenticate");
          }
        } catch (error) {
          showErrorToast("An error occurred:");
        }
      };

      sendData();
    }
  }, [session,status]);
  const handleGoBack = () => {
    router.back();
  };
  return (
    <>
      <div className="ml-5 mt-2 ">
          <BiArrowBack className="hover:cursor-pointer" onClick={handleGoBack} size={25} />
        </div>
    {/* small screen */}
   <div className=" h-screen flex flex-col justify-between items-center md:hidden">
        <div className="flex flex-col items-center justify-center mt-72">
          <h2 className="mb-8 text-2xl font-semibold">Welcome to Xfery.com</h2>
          <p>Login/Register</p>
          <div className={`rounded-2xl ${status !== "authenticated" ? "shadow-md" : ""} mt-28`}>
            {status === "authenticated" ? (
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
                <h5>Verifying...</h5>
              </div>
            ) : (
              <button onClick={() => signIn("google")} className="px-7 py-3 flex justify-center items-center">
                <img className="h-9 mr-2" src="/google.png" alt="Google logo" />
                Continue with Google
              </button>
            )}
          </div>
        </div>
        <footer className="text-gray-500 text-sm py-4 md:hidden">
          <Link href={"/Terms&Condition"}>
          <h5>Xfery | Terms of services</h5>
          </Link>
          &copy; {new Date().getFullYear()} Xfery.com. All rights reserved.
        </footer>
      </div>

      {/* pc version */}
     <div className="hidden md:flex h-screen justify-between items-center mx-28">
  <div className="w w-2/5 bg-rged-700">
    <h3 className="text-3xl font-semibold">Welcome to Xfery.com</h3>
    <h3 className="mt-4 text-lg whitespace-pre-line">
    <Typewriter
                options={{
                  strings: ["Why don't scientists trust atoms?","Because they make up everything! haha haha","The more you take,","the more you leave behind.","What am I?","Answer: Footsteps.","haha!😂","I'm tall when I'm young and short when I'm old. What am I?","Answer: A candle.","You see a boat filled with people.","It has not sunk, but when you look again,","you don't see a single person on the boat. Why?","Answer:Because all the people on the boat are married.","What did one ocean say to the other ocean?","Nothing, they just waved."],
                  autoStart: true,
                  loop: true,
                  delay: 10,
                  deleteSpeed: 10,
                  cursor: "",
                }}
              />
    </h3>
  </div>
  <div className="w-2/5 flex flex-col justify-center items-center">
    <h3 className="text-xl font-semibold">Login/Register</h3>
    <div className={`rounded-2xl ${status !== "authenticated" ? "shadow-md" : ""} mt-16`}>
      {status === "authenticated" ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Vortex
            visible={true}
            height={60}
            width={60}
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={["gray", "black", "gray", "black", "gray", "black"]}
          />
          <h5 className="mt-2">Verifying...</h5>
        </div>
      ) : (
        <button onClick={() => signIn("google")} className="w-full px-16 py-3 flex justify-center items-center">
          <img className="h-9 mr-2" src="/google.png" alt="Google logo" />
          Continue with Google
        </button>
      )}
    </div>
  </div>
</div>
<footer className="fixed bottom-0 left-0 w-full bg-white text-gray-500 text-sm py-4 flex justify-center items-center">
  <Link href="/Terms&Condition">
    <h5 className="cursor-pointer">Xfery | Terms of Services</h5>
  </Link>
  &copy; {new Date().getFullYear()} Xfery.com. All rights reserved.
</footer>



  </>
  
  );
}
