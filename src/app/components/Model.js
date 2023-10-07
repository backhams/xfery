"use client"
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
} from "next-share";
import React from "react";
import { useTheme } from "next-themes";

export default function Model({ isVisible, onClose }) {
  const { systemTheme } = useTheme();
  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target.id === "wrapper") onClose();
  };

  const currentPageUrl = window.location.href;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
        id="wrapper"
        onClick={handleClose}
      >
        <div className="w-8/12 md:w-7/12 lg:w-5/12 xl:w-4/12 flex flex-col">
          <button
            className="text-xl place-self-end"
            onClick={() => onClose()}
          >
            X
          </button>
          <div className="bg-white px-4 md:px-7">
            <div className="flex justify-center items-center mt-10 font-semibold">
              <h1 className={`${systemTheme==="dark"? "text-black" : "text-black"}`}>Share with</h1>
            </div>
            <div className="flex flex-wrap justify-center pb-7 md:pb-20 mt-9 gap-y-5 gap-x-5 md:gap-x-7">
              <FacebookShareButton url={currentPageUrl}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>

              <WhatsappShareButton url={currentPageUrl}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>

              <TelegramShareButton url={currentPageUrl}>
                <TelegramIcon size={32} round />
              </TelegramShareButton>

              <TwitterShareButton url={currentPageUrl}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>

              <FacebookMessengerShareButton url={currentPageUrl}>
                <FacebookMessengerIcon size={32} round />
              </FacebookMessengerShareButton>

              <EmailShareButton
                url={currentPageUrl}
                subject={"Stay Connected with xfery.com"}
              >
                <EmailIcon size={32} round />
              </EmailShareButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

