"use client";

import React, { useState } from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { HiTrendingUp } from "react-icons/hi";
import {
  FaCartPlus,
} from "react-icons/fa6";
import { BiMenu } from "react-icons/bi";
import BottomMenu from "./BottomMenu";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import priceAdjustments from "./PriceAdjust";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../components/Toast";
import SideBar from "./SideBar";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../Redux/toggleSlice";
import DiscountPrice from "./DiscountPrice";

export default function ClientHome({ products }) {
  const [productLoading, setProductLoading] = useState({});
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [menuToggle, setMenuToggle] = useState(true);
  const { systemTheme } = useTheme();
  const [query, setQuery] = useState();
  const api = process.env.NEXT_PUBLIC_SERVER_API;

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    if (query && query.trim() !== "") {
       router.push(`/search?query=${query}`)
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
      handleSearchClick();
    }
  };


  const toggle = () => {
    setMenuToggle(!menuToggle);
    dispatch(toggleSidebar());
  };

  const openSearchBar = () => {
    setShowSearchBar(true);
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
        console.log(responseData);
        // Reset loading state for the specific product g
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
      // Reset loading state for the specific product
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
        className={`flex justify-between items-center shadow-md py-3 px-2 pr-7 z-40 fixed ${
          systemTheme === "dark" ? "bg-black text-white" : "bg-white text-black"
        } w-full top-0 md:pr-16`}
      >
        <div className={"flex justify-center items-center"}>
          <BiMenu
            onClick={toggle}
            className="hidden mr-10 cursor-pointer md:block"
            size={30}
          />
          <img className="h-10 lg:h-16" src="/x.png" alt="xfery logo" />
        </div>
        {showSearchBar ? (
          <input
            className="outline-gray-700 py-1 pl-3" 
            type="text"
            placeholder="Search..."
            onBlur={() => setShowSearchBar(false)}
            autoFocus
            value={query}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
        ) : (
          <HiMiniMagnifyingGlass
            className="md:hidden"
            size={20}
            onClick={openSearchBar}
          />
        )}
        <input
          className="outline-gray-700 py-3 hidden md:block w-2/5 outline-none border-gray-950 rounded-sm pl-5 text-lg"
          type="text"
          placeholder="Search product here..."
          value={query}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
        />

        <Link href="/addtocard" className="hidden md:block cursor-pointer">
          <FaCartPlus size={30} />
        </Link>
      </div>
      <SideBar/>
      <div
        className={`flex md:hidden gap-x-5 overflow-x-auto fixed ${
          systemTheme === "dark" ? "bg-black text-white" : "bg-white text-black"
        } top-14 py-6 w-full z-10 px-5`}
      >
        <Link
          href={{
            pathname: "/search",
            query: { query: "Skincare" },
          }}
          className={`p-1 rounded-lg ${systemTheme==="dark"? "bg-searchbox text-white" : "bg-black text-white"}`}
        >
          &nbsp;&nbsp;Skincare&nbsp;&nbsp;
        </Link>
        <Link
          href={{
            pathname: "/search",
            query: { query: "Electronics" },
          }}
          className={`p-1 rounded-lg ${systemTheme==="dark"? "bg-searchbox text-white" : "bg-black text-white"}`}
        >
          &nbsp;&nbsp;Electronics&nbsp;&nbsp;
        </Link>
        <Link
          href={{
            pathname: "/search",
            query: { query: "Shoes" },
          }}
          className={`p-1 rounded-lg ${systemTheme==="dark"? "bg-searchbox text-white" : "bg-black text-white"}`}
        >
          &nbsp;&nbsp;Shoes&nbsp;&nbsp;
        </Link>
        <Link
          href={{
            pathname: "/search",
            query: { query: "pant" },
          }}
          className={`p-1 rounded-lg ${systemTheme==="dark"? "bg-searchbox text-white" : "bg-black text-white"}`}
        >
          &nbsp;&nbsp;pant&nbsp;&nbsp;
        </Link>
        <Link
          href={{
            pathname: "/search",
            query: { query: "tshirt" },
          }}
          className={`p-1 rounded-lg ${systemTheme==="dark"? "bg-searchbox text-white" : "bg-black text-white"}`}
        >
          &nbsp;&nbsp;tshirt&nbsp;&nbsp;
        </Link>
        <Link
          href={{
            pathname: "/search",
            query: { query: "books" },
          }}
          className={`p-1 rounded-lg ${systemTheme==="dark"? "bg-searchbox text-white" : "bg-black text-white"}`}
        >
          &nbsp;&nbsp;books&nbsp;&nbsp;
        </Link>
        <Link
          href={{
            pathname: "/search",
            query: { query: "mobile" },
          }}
          className={`p-1 rounded-lg ${systemTheme==="dark"? "bg-searchbox text-white" : "bg-black text-white"}`}
        >
          &nbsp;&nbsp;mobile&nbsp;&nbsp;
        </Link>
        <Link
          href={{
            pathname: "/search",
            query: { query: "laptop" },
          }}
          className={`p-1 rounded-lg ${systemTheme==="dark"? "bg-searchbox text-white" : "bg-black text-white"}`}
        >
          &nbsp;&nbsp;laptop&nbsp;&nbsp;
        </Link>
      </div>
      <div className="w-full flex justify-center items-center mt-44 gap-x-5">
        <HiTrendingUp size={35}/>
        <h1 className="font-semibold text-lg md:text-2xl">Trending Products</h1>
      </div>

      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 z-0 mt-24 mx-3 mb-16 ${
          menuToggle ? "md:ml-64 duration-300" : "duration-200"
        }`}
      >
        {/* Render the product cards dynamically */}
        {products.map((product) => (
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
                width={500}
                height={500}
                src={product.productImage}
                alt={"product"}
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
              <p className="text-gray-600 mb-3  underline-text"  style={{ textDecoration: 'line-through' }}>
                ${adjustDiscountPrice(product.sellPrice)}
              </p>
              <p className=" mb-3">
                ${adjustPrice(product.sellPrice)}
              </p>
              </div>
              <p className="text-green-600 text-sm mb-7">Free shipping</p>
              {/* Add more product information as needed */}
            </div>
          </div>
        ))}
      </div>
      <BottomMenu />
    </>
  );
}
