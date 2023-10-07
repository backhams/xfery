"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { AiOutlineRight } from "react-icons/ai";
import Headroom from "react-headroom";
import { useInView } from "react-intersection-observer";
import CjProduct from "../components/Actions";
import { Bars, ThreeDots } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../Redux/toggleSlice";
import { FaCartPlus } from "react-icons/fa6";
import { BiMenu } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../components/Toast";
import Link from "next/link";
import priceAdjustments from "../components/PriceAdjust";
import DiscountPrice from "../components/DiscountPrice";
import SideBar from "../components/SideBar";
export default function SearchBar({ products, error }) {
  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const { systemTheme } = useTheme();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [productLoading, setProductLoading] = useState({});
  const [menuToggle, setMenuToggle] = useState(true);
  const [query, setQuery] = useState("");
  const [ref, inView] = useInView();
  const [loadingMore, setLoadingMore] = useState(false);
  const [item, setItem] = useState([]);
  const api = process.env.NEXT_PUBLIC_SERVER_API;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get("query");

    if (queryParam) {
      setQuery(queryParam);
    }
  }, []);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = async () => {
    if (query && query.trim() !== "") {
      router.push(`/search?query=${query}`);
      setIsLoading(true);
      setLoadingMore(false);
    }
  };
  // useEffect to update item and scroll to top when products change
  useEffect(() => {
    setItem(products);
    setIsLoading(false);
    // window.scrollTo({ top: 0, behavior: "smooth" });
  }, [products]);
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
      handleSearchClick();
    }
  };
  useEffect(() => {
    if (inView && !loadingMore) {
      loadMoreProduct();
    }
  }, [inView]);

  async function loadMoreProduct() {
    if (loadingMore) return; // Return if already loading more products
    setLoadingMore(true); // Set loadingMore to true when starting to load more
    const next = page + 1;
    try {
      const product = await CjProduct(query, next);

      if (typeof product === "string") {
        // Check if the response from CjProduct is a string (indicating an error)
        showErrorToast(product); // Display the error message
      } else if (product && product.length) {
        setPage(next);
        setItem((prev) => [...(prev || []), ...product]);
      }
    } catch (error) {
      showErrorToast("An error occurred while loading more products.");
    } finally {
      setLoadingMore(false);
    }
  }

  const toggle = () => {
    setMenuToggle(!menuToggle);
    dispatch(toggleSidebar());
  };

  const addToCart = async (productId) => {
    try {
      setProductLoading((prevLoading) => ({
        ...prevLoading,
        [productId]: true,
      }));
      if (status !== "authenticated") {
        router.push("/Authenticate");
      } else {
        // Set loading state for the specific product
        setProductLoading((prevLoading) => ({
          ...prevLoading,
          [productId]: true,
        }));
        // Access the user's email from the session
        const userEmail = session.user.email;
        // Send a POST request to your backend API with the productId
        const response = await fetch(`${api}/addToCard`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, userEmail }),
        });
        const responseData = await response.json();
        // Reset loading state for the specific product
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
      showErrorToast("Error adding product to cart");
      setProductLoading((prevLoading) => ({
        ...prevLoading,
        [productId]: false,
      }));
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
  

  return (
    <>
      <div
        className={`flex justify-between items-center shadow-md py-3 px-2 pr-7 z-20 fixed top-0 ${
          systemTheme === "dark" ? "bg-black text-white" : "bg-white"
        } w-full top-0 md:pr-16`}
      >
        <div className={"flex justify-center items-center"}>
          <BiMenu
            onClick={toggle}
            className="hidden mr-10 cursor-pointer md:block"
            size={30}
          />
        </div>
        <SideBar />
        <Link className="px-5 py-2 md:hidden" href="/">
          <BiArrowBack size={25} />
        </Link>
        <div className="b w-4/5 flex justify-center items-center">
          <div className=" md:w-2/5 flex justify-center items-center border-2 bg-custom-black rounded-2xl text-black md:rounded-md">
            <input
              className=" outline-none pl-5 py-1 md:py-3 w-full bg-transparent ml-5"
              type="text"
              placeholder="search..."
              value={query}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
            />
            <button
              className=" px-1 md:px-5"
              onClick={handleSearchClick}
              disabled={isLoading}
            >
              <FiSearch size={20} />
            </button>
          </div>
        </div>
        <Link href="/addtocard" className="hidden md:block cursor-pointer">
          <FaCartPlus size={30} />
        </Link>
      </div>
      <Headroom className={isLoading ? "hidden" :"block"}>
        <div className={`mt-16 md:hidden flex gap-x-16 pl-5 z-30 ${systemTheme==="dark"? "bg-searchbox" : "bg-white"}`}>
          <div className="flex items-center gap-x-1 py-7">
            <p>{status === "authenticated" ? session?.user.name : "Login"}</p>
            <AiOutlineRight size={10} />
            <Link
              href={status === "authenticated" ? "/dashboard" : "/Authenticate"}
            >
              <FaUser size={20} />
            </Link>
          </div>
          <div className="py-7">
            <Link href="/addtocard" className="md:hidden cursor-pointer">
              <FaCartPlus size={25} />
            </Link>
          </div>
        </div>
      </Headroom>
      <div>
        {isLoading ? ( // Show loading text and spinner if isLoading is true
          <div className="flex justify-center items-center h-screen">
            <Bars
              height="50"
              width="50"
              color="red"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : !Array.isArray(item) || item.length === 0 ? (
          <div className="h-screen flex justify-center items-center">
            <p className="md:text-2xl">Not found</p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 z-0 mt-20 mx-3 md:mt-36 ${
              menuToggle ? "md:ml-64 duration-300" : "duration-200"
            }`}
          >
            {/* Render the product cards dynamically */}
            {item.map((product) => (
              <div
                key={product.pid}
                className="relative rounded-md overflow-hidden shadow-md"
              >
                <Link
                  href={{
                    pathname: "/productDetails",
                    query: { productId: product.pid },
                  }}
                >
                  <Image
                    src={product.productImage}
                    alt={"product"}
                    width={500}
                    height={500}
                    className="w-full h-64 object-center object-cover hover:cursor-pointer"
                  />
                </Link>

                <div className="px-4">
                  <div className="w-full flex justify-center items-center mb-5">
                    <button
                      onClick={() => addToCart(product.pid)}
                      className="bg-black hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md"
                      disabled={productLoading[product.pid]}
                    >
                      {productLoading[product.pid] ? (
                        <div className="spinner-cart mx-9"></div>
                      ) : (
                        "Add to Cart"
                      )}
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {product.productNameEn}
                  </h3>
                  <div className="flex gap-x-5">
              <p className="text-gray-600 mb-10  underline-text"  style={{ textDecoration: 'line-through' }}>
                ${adjustDiscountPrice(product.sellPrice)}
              </p>
              <p className=" mb-10">
                ${adjustPrice(product.sellPrice)}
              </p>
              </div>
                  {/* Add more product information as needed */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {!isLoading && item.length > 0 && (
        <div
          ref={ref}
          className={`col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4`}
        >
          <span>
            <ThreeDots
              height="50"
              width="50"
              radius="9"
              color="red"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </span>
        </div>
      )}
    </>
  );
}
