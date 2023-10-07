import Search from "./Search";
import CjProduct from "../components/Actions";
import { v4 as uuid } from "uuid";

const getProduct = async (query) => {
  const next = 1;

  try {
    const response = await CjProduct(query, next);
    return response;
  } catch (error) {
  }
};

export default async function Page({ searchParams }) {
  const query = searchParams.query;

  const uniqueKey = uuid();

  // Check if query is available before making the API request
  let items = [];
  let error = null; // Initialize error as null
  if (query) {
    try {
      items = await getProduct(query);
      if (typeof items === "string") {
        console.error(items); // Log the error
        error = items; // Assign the error message to the error variable
      }
    } catch (err) {
      console.error('Error:', err);
      error = err; // Assign the caught error object to the error variable
    }
    
  }

  return (
    <>
      {/* Include the unique key as a "key" prop */}
      <Search key={uniqueKey} products={items} error={error} /> {/* Pass error as a prop */}
    </>
  );
}

export function generateMetadata() {
  return {
    title: "xfery | Discover your desired product here"
  };
}
