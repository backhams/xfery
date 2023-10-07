import Page from "./ProductDetails";

const getProductDetails = async (productId) => {
  const api = process.env.NEXT_PUBLIC_SERVER_API;
  try {
    const response = await fetch(`${api}/productDetails?productId=${productId}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

let metaDetail; // Define metaDetail in the module scope

export default async function page({ searchParams }) {
  const productId = searchParams.productId;
  try {
    const item = await getProductDetails(productId);
    metaDetail = item; // Assign item to metaDetail

    return (
      <>
        <Page products={item} />
      </>
    );
  } catch (error) {
  }
}

export async function generateMetadata() {
  if (metaDetail) {
    return {
      title: `${metaDetail.entryNameEn}`,
      description: `${metaDetail.productNameEn}`,
      openGraph: {
        images: [{ url: metaDetail.productImageSet[0] }],
      },
    };
  }
}
