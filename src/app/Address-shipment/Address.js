"use client";

import React, { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast
} from "../components/Toast";
export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { systemTheme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_SERVER_API
  useEffect(()=>{
    if(status==="unauthenticated"){
      router.push("/Authenticate")
    }
  },[status])
  const countries = [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "IN", name: "India" },
    { code: "GB", name: "United Kingdom" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "AU", name: "Australia" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "BR", name: "Brazil" },
    { code: "RU", name: "Russia" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "MX", name: "Mexico" },
    { code: "ZA", name: "South Africa" },
    { code: "AR", name: "Argentina" },
    { code: "KR", name: "South Korea" },
    { code: "NL", name: "Netherlands" },
    { code: "SE", name: "Sweden" },
    { code: "CH", name: "Switzerland" },
    { code: "TR", name: "Turkey" },
    { code: "SG", name: "Singapore" },
    { code: "ID", name: "Indonesia" },
    { code: "TH", name: "Thailand" },
    { code: "MY", name: "Malaysia" },
    { code: "EG", name: "Egypt" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "IL", name: "Israel" },
    { code: "NZ", name: "New Zealand" },
    { code: "IE", name: "Ireland" },
    { code: "CL", name: "Chile" },
    { code: "CO", name: "Colombia" },
    { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" },
    { code: "VN", name: "Vietnam" },
    { code: "BE", name: "Belgium" },
    { code: "AT", name: "Austria" },
    { code: "NO", name: "Norway" },
    { code: "DK", name: "Denmark" },
    { code: "FI", name: "Finland" },
    { code: "UA", name: "Ukraine" },
    { code: "BD", name: "Bangladesh" },
    { code: "PK", name: "Pakistan" },
    { code: "PH", name: "Philippines" },
    { code: "MY", name: "Malaysia" },
    { code: "DZ", name: "Algeria" },
    { code: "VN", name: "Vietnam" },
    { code: "CL", name: "Chile" },
    { code: "MA", name: "Morocco" },
    { code: "EC", name: "Ecuador" },
    { code: "IQ", name: "Iraq" },
    { code: "DO", name: "Dominican Republic" },
    { code: "CZ", name: "Czech Republic" },
    { code: "HN", name: "Honduras" },
    { code: "VE", name: "Venezuela" },
    { code: "SN", name: "Senegal" },
    { code: "TZ", name: "Tanzania" },
    { code: "ET", name: "Ethiopia" },
    { code: "PE", name: "Peru" },
    { code: "AL", name: "Albania" },
    { code: "KH", name: "Cambodia" },
    { code: "CM", name: "Cameroon" },
    { code: "TN", name: "Tunisia" },
  ];

  const [formData, setFormData] = useState({
    email: "", // Initialize with an empty email
    shippingCustomerName: "",
    mobile: "",
    shippingCountry: "",
    shippingCountryCode: "",
    shippingProvince: "",
    shippingCity: "",
    shippingAddress: "",
    shippingZip: "",
    houseNumber: "",
    remark: "Please ensure careful packaging for fragile items. Thank you!",
  });

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prevData) => ({
        ...prevData,
        email: session.user.email,
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${api}/addressUpdate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setIsSubmitting(false);
      if (response.status === 200) {
        showSuccessToast(data)
        setTimeout(() => {
          router.back();
        }, 2000);
      } else if (response.status===400){
        showWarningToast(data)
      } else if (response.status===404){
        showErrorToast(data)
      } else {
        showErrorToast("Internal server error")
      }
    } catch (error) {
      setIsSubmitting(false);
      showErrorToast("Oops! something went wrong")
    }
  };
  const previous = ()=>{
    router.back();
  }

  const handleCountryChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      shippingCountry: selectedOption.value,
      shippingCountryCode: selectedOption.code,
    }));
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-10 flex justify-between items-center shadow-md py-3 px-2 pr-7 ${
          systemTheme === "dark" ? "bg-black text-white" : "bg-white"
        } md:pr-16`}
      >
        <div onClick={previous} className="px-5 py-2 hover:cursor-pointer">
          <BiArrowBack size={25} />
        </div>
      </div>
      <div className="container mx-auto p-4 w-4/5 md:w-2/5 mt-28">
        <h1 className="text-2xl font-semibold mb-4 w-full text-center">
          Shipping Address
        </h1>
        <div className="space-y-4 my-28">
          <div className="form-group">
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="shippingCustomerName"
              className="w-full border rounded p-2"
              value={formData.shippingCustomerName}
              placeholder="customer name"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="block font-semibold mb-1">Mobile</label>
            <input
              type="tel"
              name="mobile"
              className="w-full border rounded p-2"
              value={formData.mobile}
              placeholder="mobile number"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="block font-semibold mb-1">Country</label>
            <Select className="text-black"
              options={countries.map((country) => ({
                value: country.name,
                label: country.name,
                code: country.code,
              }))}
              value={{
                value: formData.shippingCountry,
                label: formData.shippingCountry,
              }}
              onChange={handleCountryChange}
              placeholder="Select a country..."
            />
          </div>
          <div className="form-group">
            <label className="block font-semibold mb-1">Country Code</label>
            <input
              type="text"
              name="shippingCountryCode"
              className="w-full border rounded p-2"
              value={formData.shippingCountryCode}
              placeholder="country code"
            />
          </div>

          <div className="form-group">
            <label className="block font-semibold mb-1">State</label>
            <input
              type="text"
              name="shippingProvince"
              className="w-full border rounded p-2"
              value={formData.shippingProvince}
              placeholder="state"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="block font-semibold mb-1">City</label>
            <input
              type="text"
              name="shippingCity"
              className="w-full border rounded p-2"
              value={formData.shippingCity}
              placeholder="city"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="block font-semibold mb-1">Shipping Address</label>
            <input
              type="text"
              name="shippingAddress"
              className="w-full border rounded p-2"
              value={formData.shippingAddress}
              placeholder="your colony street name area name"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="block font-semibold mb-1">Shipping Zip</label>
            <input
              type="text"
              name="shippingZip"
              className="w-full border rounded p-2"
              value={formData.shippingZip}
              placeholder="enter your address zip code"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="block font-semibold mb-1">House Number</label>
            <input
              type="text"
              name="houseNumber"
              className="w-full border rounded p-2"
              value={formData.houseNumber}
              placeholder="house number"
              onChange={handleChange}
            />
          </div>
          <div className="w-full flex justify-center items-center">
          <button
          onClick={handleSubmit}
          type="submit"
          className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md px-16 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting} // Disable the button when submitting
        >
          {isSubmitting ? "updating..." : "Submit"}
        </button>
          </div>
        </div>
      </div>
    </>
  );
}
