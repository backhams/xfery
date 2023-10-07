import ClientHome from "./components/ClientHome";
import BottomMenu from "./components/BottomMenu";

const getProduct = async () => {
  const api = process.env.NEXT_PUBLIC_SERVER_API;
  try {
    const response = await fetch(`${api}/productList`, {
      method: "GET",
      cache: "no-store"
    });
    if (!response.ok) {
      // Create and throw a custom error message
      throw new Error("Failed to fetch product data. Please try again later.");
    }
    const data = await response.json(); // Parse the response JSON
    return data;
  } catch (error) {
    // Handle the custom error message
    throw new Error("An error occurred while processing your request. Please contact support.");
  }
};

export default async function Home() {
  try {
    const items = await getProduct();
    return (
      <>
        <ClientHome products={items} />
        <BottomMenu />
      </>
    );
  } catch (error) {
    // Handle the custom error message
    throw new Error("An error occurred while loading the page. Please refresh and try again.");
  }
}

export function generateMetadata() {
  return {
    title: "xfery",
    description:
      "Embark on a global shopping journey without boundaries at xfery, where you can access a world of premium products and exclusive offers, all with the added advantage of FREE worldwide shipping. Your ultimate e-commerce affiliate destination for seamless international shopping experiences.",
    keywords:
      "Online Shopping, E-commerce Deals, Best Products,Affiliate Marketing,Discount Offers,Quality Products,Fashion Trends,Electronics Deals,Shopping Guide,Trusted Retailers,Product Reviews,Top Brands,Home Essentials,Shopping Experience",
  };
}
