"use client" 

import React from 'react';
import { IoLogoWhatsapp } from 'react-icons/io';
import { FaInstagramSquare } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from 'next/navigation';

export default function Contact() {
    const router = useRouter();
    const handleGoBack = ()=>{
        router.back()
      }
  return (
    <div className='min-h-screen flex flex-col justify-center items-center'> 
     <button
        onClick={handleGoBack}
        className='fixed top-3 left-3 m-4'
      >
        <BiArrowBack size={30}/>
      </button>
      <div className='text-center'>
        <h1 className='text-4xl font-bold'>Contact us</h1>
        <p className='mt-2'>We're here to help</p>
      </div>
      <div className='flex flex-col md:flex-row mt-8 space-y-4 md:space-y-0 md:space-x-4'>
        <ContactOption
          icon={<IoLogoWhatsapp size={40} />}
          title='Contact us on WhatsApp'
          content='+91 87980 73782'
        />
         <a
          href='https://www.instagram.com/xfery.coms'
          target='_blank'
          rel='noopener noreferrer'
        >
          <ContactOption
            icon={<FaInstagramSquare size={40} />}
            title='Contact us on Instagram'
            content='@xfery.coms'
          />
        </a>
        <a
          href='mailto:contactxfery.com@gmail.com'
          target='_blank'
          rel='noopener noreferrer'
        >
          <ContactOption
            icon={<MdEmail size={40} />}
            title='Contact us via Email'
            content='contactxfery.com@gmail.com'
          />
        </a>
      </div>
    </div>
  );
}

function ContactOption({ icon, title, content }) {
  return (
    <div className='flex flex-col items-center bg-gray-500 p-4 text-white'>
      <div className='flex justify-center mb-4'>{icon}</div>
      <div className='text-center'>
        <p className='mb-2'>{title}</p>
        <p>{content}</p>
      </div>
    </div>
  );
}
