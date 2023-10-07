"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setVariantData  } from "../Redux/Slice";
import { useSearchParams, useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import { useTheme } from "next-themes";
import { FiChevronDown,FiSearch } from "react-icons/fi";
import { BsShare } from "react-icons/bs";
import Image from "next/image";
import { useSession } from "next-auth/react";
import jwtDecode from "jwt-decode";
import { Vortex } from "react-loader-spinner";
import Slider from "react-slick";
import priceAdjustments from "../components/PriceAdjust";
import DiscountPrice from "../components/DiscountPrice";
import { loadStripe } from "@stripe/stripe-js";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
} from "../components/Toast";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Model from "../components/Model";

export default function ProductDetails({products}) {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("productId");
  const [showModel,setShowModel] = useState(false);
  const [productData, setProductData] = useState([]);
  const [productResponse, setProductResponse] = useState({});
  const [productVariants, setProductVariants] = useState([]);
  const [userShipmentData, setUserShipmentData] = useState("");
  const [productLoading, setProductLoading] = useState({});
  const [finalPrice, setFinalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [priceKey, setPriceKey] = useState(0);
  const [query, setQuery] = useState("");
  const api = process.env.NEXT_PUBLIC_SERVER_API
  const [selectedValues, setSelectedValues] = useState({
    firstValue: "",
    secondValue: "",
  });
  const getVariantId = () => {
    const matchingVariant = productVariants.find((variant) => {
      const [key, keyTwo] = variant.variantKey.split("-");
      return (
        key === selectedValues.firstValue &&
        (!keyTwo || keyTwo === selectedValues.secondValue)
      );
    });

    if (matchingVariant) {
      return matchingVariant.vid;
    }

    return null;
  };

  const variantId = getVariantId();

  useEffect(() => {
    if (variantId) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${api}/variantPrice?variantId=${variantId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const responseData = await response.json();
          // Calculate the adjusted price using the adjustPrice function
          const adjustedPrice = adjustPrice(responseData);
          setFinalPrice(adjustedPrice);
          // Handle responseData as needed
        } catch (error) {
          showErrorToast("An error occurred:",error.message);
        }
      };
      fetchData();
    }
  }, [variantId]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check for JWT token in localStorage
        const Token = await localStorage.getItem("jwt");

        // Fetch additional data using JWT token if it exists
        if (Token) {
          const decoded = jwtDecode(Token);
          const response = await fetch(`${api}/user/${decoded._id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          });
          const responseData = await response.json();
          setUserShipmentData(responseData);
        }
        // Fetch product data
        router.push(`/productDetails?productId=${productId}`)
        setProductResponse(products)
        const productResponse = products || {};
        setProductData(productResponse);
        setProductVariants(productResponse.variants);

        // Check if productData.sellPrice contains a hyphen "-"
        if (productResponse.sellPrice.includes("-")) {
          setPriceKey(1);
        } else {
          setPriceKey(0);
        }

        setLoading(false);
      } catch (error) {
        showErrorToast("Oops! something went wrong.");
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId, products]);


  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  
  

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Function to decrease the number by 1 (with a minimum of 0)
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const { systemTheme } = useTheme();

  const handleGoBack = () => {
    router.back();
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows:true
  };

  if (loading) {
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
  const addToCart = async (productId) => {
    try {
      setProductLoading((prevLoading) => ({
        ...prevLoading,
        [productId]: true,
      }));
      if (status !== "authenticated") {
        router.push("/Authenticate");
      } else {
        setProductLoading((prevLoading) => ({
          ...prevLoading,
          [productId]: true,
        }));
        const userEmail = session.user.email;
        const response = await fetch(`${api}/addToCard`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, userEmail }),
        });
        const responseData = await response.json();
        setProductLoading((prevLoading) => ({
          ...prevLoading,
          [productId]: false,
        }));
        if (response.status === 200) {
          showSuccessToast(responseData);
        } else if (response.status === 404) {
          showErrorToast(responseData);
        } else if (response.status === 400) {
          showWarningToast(responseData);
        } else {
          showErrorToast(responseData);
        }
      }
    } catch (error) {
      showErrorToast("Failed to save item");
      setProductLoading((prevLoading) => ({
        ...prevLoading,
        [productId]: false,
      }));
    }
  };

  // Create an array to store unique color options
  const uniqueKey = [];

  // Iterate through productVariants to get unique color options
  productVariants.forEach((item) => {
    const [key, keyTwo] = item.variantKey.split("-");
    if (!uniqueKey.includes(key)) {
      uniqueKey.push(key);
    }
  });
  const uniqueKeyTwo = [];

  // Iterate through productVariants to get unique color options
  productVariants.forEach((item) => {
    const [key, keyTwo] = item.variantKey.split("-");
    if (!uniqueKeyTwo.includes(keyTwo)) {
      uniqueKeyTwo.push(keyTwo);
    }
  });

  //orderPlace
  const orderPlace = async () => {
    try {
      if (!variantId) {
        showInfoToast("please select your variant");
      } else if (finalPrice === 0) {
        showInfoToast("Loading price...");
      } else if (status !== "authenticated") {
        setBuyNowLoading(true);
        await router.push("/Authenticate");
      } else if (status === "authenticated") {
        setBuyNowLoading(true);
        try {
          const response = await fetch(
            `${api}/addressInfo?email=${encodeURIComponent(session?.user?.email)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const addressResponse = await response.json();
          setBuyNowLoading(false);
           if (response.status === 400) {
            setBuyNowLoading(true);
            router.push("/Address-shipment");
          } else if (response.status === 200) {
            setBuyNowLoading(true);
            const response = await fetch(
              `${api}/checkOrderCreate`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userShipmentData,
                  variantId,
                  quantity,
                }),
              }
            );
  
            const responseData = await response.json();
            const orderNum = await responseData.data;
            if (response.status=== 404){
              setBuyNowLoading(false);
              showErrorToast(`This product is not available for shipping to ${userShipmentData.shippingCountry}.Please try a different variant or quantity.`);
            } else if (responseData.message === "Order create fail, null") {
              setBuyNowLoading(false);
              showErrorToast(`This product is not available for shipping to ${userShipmentData.shippingCountry}.Please try a different variant or quantity.`);
            } else if (responseData.message !== "Order create fail, null" && responseData.message !== "Success") {
              setBuyNowLoading(false);
              showErrorToast("Something went wrong please try again.")
            } else if(response.status===500 || response.status===400){
              setBuyNowLoading(false);
              showErrorToast(responseData)
            } else {
              // Code that should run if order creation is successful
              if (response.status === 200) {
                const userEmail = session.user.email;
                setBuyNowLoading(true);
                const response = await fetch(
                  `${api}/paymentValidation?email=${encodeURIComponent(
                    session?.user?.email
                  )}&variantId=${encodeURIComponent(variantId)}&quantity=${encodeURIComponent(quantity)}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
                const responseData = await response.json();
                if (response.status === 200) {
                  setBuyNowLoading(false);
                  router.push("/createOrder/paid");
                  dispatch(setVariantData(variantId));
                } else if (response.status === 400) {
                  showErrorToast(responseData);
                  setBuyNowLoading(false);
                } else if (response.status === 404) {
                  setBuyNowLoading(true);
                  const stripeApiKey = await process.env.NEXT_PUBLIC_STRIPE_KEY;
                  const stripe = await loadStripe(stripeApiKey);
                  try {
                    const response = await fetch(
                      `${api}/checkoutPayment`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          variantId,
                          finalPrice,
                          quantity,
                          userEmail,
                          productNameEn: productData.productNameEn,
                          orderNum: orderNum
                        }),
                      }
                    );
                    const responseData = await response.json();
                    showErrorToast(responseData);
                    setBuyNowLoading(false);
                    if (response.status === 200) {
                      sessionStorage.setItem("vid", variantId);
                    }
                    const result = await stripe.redirectToCheckout({
                      sessionId: responseData.id,
                    });
                    if (result.err) {
                      showErrorToast(result.err);
                    }
                  } catch (err) {
                    showErrorToast(err.message);
                  }
                }
              } else {
                router.push("Authenticate");
              }
            }
          }
        } catch (error) {
          showErrorToast(error.message);
          setBuyNowLoading(false);
        }
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };
  

  const adjustPrice = (price) => {
    let adjustedPrice = parseFloat(price);

    for (const adjustment of priceAdjustments) {
      if (adjustedPrice <= adjustment.condition) {
        adjustedPrice += adjustment.adjustment;
        break; // No need to continue checking once a condition is met
      }
    }

    return adjustedPrice.toFixed(2);
  };
  const adjustDiscountPrice = (price) => {
    let discountAdjusted = parseFloat(price);

    for (const adjustDiscount of DiscountPrice) {
      if (discountAdjusted <= adjustDiscount.condition) {
        discountAdjusted += adjustDiscount.adjustDiscount;
        break; // No need to continue checking once a condition is met
      }
    }

    return discountAdjusted.toFixed(2);
  };
  const secoundVariantkey = !productData.productKeyEn.split("-")[1]? "hidden" : "block";
  return (
    <>
      {/* Top navigation */}
      <div
  className={`fixed top-0 left-0 right-0 z-10 flex justify-between items-center md:shadow-md py-3 px-2 pr-7 ${
    systemTheme === "dark" ? "md:bg-black md:text-white" : "md:bg-white"
  } md:pr-16`}
>
  <div onClick={handleGoBack} className={`px-5 ${systemTheme==="dark"? "bg-black" : "bg-white"} rounded-md md:rounded-none shadow-md md:shadow-none py-2 hover:cursor-pointer`}>
    <BiArrowBack size={25} />
  </div>
  <div className="hidden md:block w-full md:flex justify-center items-center">
          <div className=" md:w-2/5 flex justify-center items-center border-2 bg-custom-black rounded-2xl text-black md:rounded-md">
            <input
              className=" outline-none pl-5 py-1 md:py-3 w-full bg-transparent ml-5"
              type="text"
              placeholder="search..."
              value={query}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
            />
            <Link href={{
                    pathname: "/search",
                    query: { query: query },
                  }}
              className=" px-1 md:px-5"
            >
              <FiSearch size={20} />
            </Link>
          </div>
        </div>
        <div className={`${systemTheme==="dark"? "bg-black" : "bg-white"} rounded-md md:rounded-none shadow-md md:shadow-none py-1 px-5 flex justify-center items-center`}>
        <button onClick={()=>{setShowModel(true)}}>
          <BsShare size={25}/>
        </button>
        </div>
        </div>
       


      {/* Padding for the fixed navigation */}
      <div className="md:h-20" />

      {/* Product details */}
      <div className=" md:hidden">
        {productData && productData.productName && (
          <div className="max-w-xl w-full mx-auto rounded overflow-hidden shadow-lg">
            <Slider {...settings}>
              {productData.productImageSet.map((imageUrl, index) => (
                <div key={index}>
                  <Image
                  width={500}
                  height={500}
                    src={imageUrl}
                    alt={`Image ${index}`}
                    className="w-full h-full"
                  />
                </div>
              ))}
            </Slider>
            <div className="px-6 py-4 mt-9">
              <div className="font-bold text-xl">
                {productData.productNameEn}
              </div>
              <div className="mt-12 flex ">
                <h3 className="text-2xl">Price: $
                {`${adjustPrice(productData.sellPrice.split("-")[priceKey])}`}
                </h3>
                <h3 className="text-2xl text-gray-600 ml-14" style={{ textDecoration: 'line-through' }}>$
                {`${adjustDiscountPrice(productData.sellPrice.split("-")[priceKey])}`}
                </h3>
              </div>
              <div className="mt-12">
                <div className="flex justify-between items-center pr-5 mb-5">
                  <h3>Variant selection</h3>
                  <FiChevronDown
                    className="hover:cursor-pointer bg-slate-400"
                    size={20}
                  />
                </div>
                <div className={`${systemTheme==="dark"? "bg-searchbox" : "bg-custom-black"} h-fit py-3 rounded-md`}>
                  <div className=" flex justify-between items-center px-5">
                    <p>Unit price</p>
                    <p>quantity</p>
                    <p>Total price</p>
                  </div>
                  <div className="flex justify-between items-center px-5">
                  <p>${`${adjustPrice(productData.sellPrice.split("-")[priceKey])}`}</p>
                    <div className="flex items-center gap-x-5">
                      <button
                        onClick={decreaseQuantity}
                        className="bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 rounded-l-full w-8 h-8"
                      >
                        -
                      </button>
                      <h2 className="text-xl lg:text-2xl mx-2">{quantity}</h2>
                      <button
                        onClick={increaseQuantity}
                        className="bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 rounded-r-full w-8 h-8"
                      >
                        +
                      </button>
                    </div>
                    <p>${(finalPrice * quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center px-5 mt-5">
                    <p>{`${productData.productKeyEn.split("-")[0]}`}</p>
                    <select
                      value={selectedValues.firstValue}
                      onChange={(e) =>
                        setSelectedValues({
                          ...selectedValues,
                          firstValue: e.target.value,
                        })
                      }
                    >
                      <option></option>
                      {uniqueKey.map((key, index) => (
                        <option key={index} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>

                    <p className={`${secoundVariantkey}`}>{`${productData.productKeyEn.split("-")[1]}`}</p>
                    <select
                    className={`${secoundVariantkey}`}
                      value={selectedValues.secondValue}
                      onChange={(e) =>
                        setSelectedValues({
                          ...selectedValues,
                          secondValue: e.target.value,
                        })
                      }
                    >
                      <option></option>
                      {uniqueKeyTwo.map((keyTwo, index) => (
                        <option key={index} value={keyTwo}>
                          {keyTwo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div
                className="mt-12 mb-44"
                dangerouslySetInnerHTML={{ __html: productData.description }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className={`flex justify-end shadow-top bottom-0 fixed ${systemTheme==="dark"? "bg-black" : "bg-white"} md:hidden text-white py-5 w-full`}>
        <button
          className="bg-searchbox hover:bg-gray-800 text-white font-bold py-2 px-16 mr-5 rounded-md"
          onClick={orderPlace}
          disabled={buyNowLoading}
        >
          {buyNowLoading ? "Loading..." : "Buy now"}
        </button>

        <button
          onClick={() => addToCart(productData.pid)}
          className="bg-searchbox hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md mr-2 md:mr-4"
          disabled={productLoading[productData.pid]}
        >
          {productLoading[productData.pid] ? (
            <div className="spinner-cart mx-2 md:mx-4"></div>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>

      {/* pc version code */}
      <div className="hidden md:block">
        <div className="flex flex-col lg:flex-row justify-around mt-16">
          {productData && productData.productName && (
            <div className="max-w-xl ml-32 rounded-md overflow-hidden">
              <Slider {...settings}>
                {productData.productImageSet.map((imageUrl, index) => (
                  <div key={index}>
                    <img
                      src={imageUrl}
                      alt={`Image ${index}`}
                      className="w-full"
                    />
                  </div>
                ))}
              </Slider>
              <div
                className="mt mt-36"
                dangerouslySetInnerHTML={{ __html: productData.description }}
              />
            </div>
          )}
          <div className="px-6 py-4 w-full lg:w-2/3">
            <div className="font-bold text-xl">{productData.productNameEn}</div>
            <div className="mt-12 flex">
              <h3 className="text-2xl">Price: 
                ${`${adjustPrice(productData.sellPrice.split("-")[priceKey])}`}
              </h3>
              <h3 className="text-2xl text-gray-600 ml-20"style={{ textDecoration: 'line-through' }}>
                ${`${adjustDiscountPrice(productData.sellPrice.split("-")[priceKey])}`}
              </h3>
            </div>
            <div className="mt-6 lg:mt-28">
              <div className="flex justify-between items-center pr-5 mb-5">
                <h3>Variant selection</h3>
                <FiChevronDown
                  className="hover:cursor-pointer bg-slate-400"
                  size={20}
                />
              </div>
              <div className={`${systemTheme==="dark"? "bg-searchbox" :"bg-custom-black "}  h-fit py-3 rounded-md`}>
                <div className="flex justify-between items-center px-5">
                  <p>Unit price</p>
                  <p>quantity</p>
                  <p>Total price</p>
                </div>
                <div className="flex justify-between items-center px-5">
                <p>${`${adjustPrice(productData.sellPrice.split("-")[priceKey])}`}</p>

                  <div className=" flex items-center gap-x-5">
                    <button
                      onClick={decreaseQuantity}
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 rounded-l-full w-8 h-8"
                    >
                      -
                    </button>
                    <h2 className="text-xl lg:text-2xl mx-2">{quantity}</h2>
                    <button
                      onClick={increaseQuantity}
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 rounded-r-full w-8 h-8"
                    >
                      +
                    </button>
                  </div>
                  <p>{(finalPrice * quantity).toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center px-5 mt-5">
                  <p>${`${productData.productKeyEn.split("-")[0]}`}</p>
                  <select
                    value={selectedValues.firstValue}
                    onChange={(e) =>
                      setSelectedValues({
                        ...selectedValues,
                        firstValue: e.target.value,
                      })
                    }
                  >
                    <option></option>
                    {uniqueKey.map((key, index) => (
                      <option key={index} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                  <p className={`${secoundVariantkey}`}>{`${productData.productKeyEn.split("-")[1]}`}</p>
                  <select
                  className={`${secoundVariantkey}`}
                    value={selectedValues.secondValue}
                    onChange={(e) =>
                      setSelectedValues({
                        ...selectedValues,
                        secondValue: e.target.value,
                      })
                    }
                  >
                    <option></option>
                    {uniqueKeyTwo.map((keyTwo, index) => (
                      <option key={index} value={keyTwo}>
                        {keyTwo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-center mt-6 lg:mt-10">
              <button
                onClick={() => addToCart(productData.pid)}
                className="bg-black hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md mb-2 lg:mb-0 lg:mr-2"
                disabled={productLoading[productData.pid]}
              >
                {productLoading[productData.pid] ? (
                  <div className="spinner-cart mx-9"></div>
                ) : (
                  "Add to Cart"
                )}
              </button>

              <button
                className="bg-black hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md"
                onClick={orderPlace}
                 disabled={buyNowLoading}
              >
                 {buyNowLoading ? "Loading..." : "Buy now"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Model isVisible={showModel} onClose={()=>{
        setShowModel(false)
      }}/>
    </>
  );
}
