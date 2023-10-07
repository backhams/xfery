"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "next-themes";
import jwtDecode from "jwt-decode";
import { useSession } from "next-auth/react";
import { Vortex } from "react-loader-spinner";
import { BiArrowBack } from "react-icons/bi";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "@/app/components/Toast";

export default function CreateOrder() {
  const vid = useSelector((state) => state.variant);
  const { systemTheme } = useTheme();
  const { data: session, status } = useSession();
  const [paidProduct, setPaidProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [userShipmentData, setUserShipmentData] = useState("");
  const [paymentValidationData, setPaymentValidationData] = useState([]);
  const quantityNum = paymentValidationData.quantity;
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_SERVER_API

  useEffect(() => {
    if (vid) {
      sessionStorage.setItem("vid", vid);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === "authenticated" && session?.user?.email) {
          const variantId = await sessionStorage.getItem("vid");
          if (variantId) {
            const responsePayment = await fetch(
              `${api}/paymentValidationCreateOrder?email=${encodeURIComponent(
                session.user.email
              )}&variantId=${encodeURIComponent(variantId)}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const responseDataPayment = await responsePayment.json();
            setPaymentValidationData(responseDataPayment);

            if (responsePayment.status === 200) {
              const responseProduct = await fetch(
                `${api}/variantIdPaid?variantId=${variantId}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (responseProduct.status === 500) {
                showErrorToast("Unable to load product please try again");
              } else {
                const responseDataProduct = await responseProduct.json();
                setPaidProduct(responseDataProduct);
                setLoading(false);
              }
            }
          }
        }
      } catch (error) {
        showErrorToast("Oops! something went");

      }
    };

    fetchData();
  }, [vid, status]);

  const handleGoBack = () => {
    router.back();
  };

  const completeOrder = async () => {
    try {
      setLoadingButton(true);
      const Token = await localStorage.getItem("jwt");
      const decoded = jwtDecode(Token);
      if (Token) {
        const response = await fetch(
          `${api}/user/${decoded._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        const responseData = await response.json();
        setUserShipmentData(responseData);

        if (response.status === 200) {
          try {
            const variantId = await sessionStorage.getItem("vid");
            const response = await fetch(
              `${api}/createOrder`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userShipmentData,
                  variantId,
                  quantityNum,
                  variantImage: paidProduct.variantImage,
                  productName: paidProduct.variantNameEn
                }),
              }
            );

            const responseData = await response.json();
            setLoadingButton(false);
            if (response.status === 200) {
              showSuccessToast(responseData);
              setLoadingButton(true);
              router.push("/")
            } else if (response.status === 400) {
              showWarningToast(responseData);
            } else if (response.status === 404) {
              showWarningToast(responseData);
            } else {
              showErrorToast(responseData);
            }
          } catch (error) {
            showErrorToast("Oops! something went wrong");
          }
        }
      }
    } catch (error) {
      setLoadingButton(false);
      showErrorToast("something went wrong")
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        {loading ? (
          <div>
              <Vortex
        visible={true}
        height={60}
        width={60}
        ariaLabel="vortex-loading"
        wrapperStyle={{}}
        wrapperClass="vortex-wrapper"
        colors={['gray', 'black', 'gray', 'black', 'gray', 'black']}
      />
      <h5>Loading...</h5>
      </div>
        ) : (
          paidProduct &&
          paymentValidationData && (
            <>
            <div className={`${systemTheme==="dark"? "bg-searchbox" : "bg-white"} p-4 rounded shadow-md text-center bg`}>
            <div className="flex justify-start mb-7">
            <BiArrowBack className="hover:cursor-pointer" onClick={handleGoBack} size={25} />
          </div>
              <img
                src={paidProduct.variantImage}
                alt="Product Image"
                className="max-w-full"
              />
              <h1 className="text-2xl font-bold mt-4">
                {paidProduct.variantNameEn}
              </h1>
              <p className="text-green-600 mt-2">
                Paid $ {paymentValidationData.price}
              </p>
              <p className="text-base mt-2">
                Quantity: {paymentValidationData.quantity}
              </p>
              <p className="text-base mt-2">
                Variant: {paidProduct.variantKey}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => completeOrder()}
                  className="bg-black text-white px-4 py-2 rounded"
                  disabled={loadingButton}
                >
                  {loadingButton ? (
                    <div className="spinner-cart mx-12"> </div>
                  ) : (
                    "Complete Order"
                  )}
                </button>
              </div>
            </div>
            </>
          )
        )}
      </div>
    </>
  );
}
