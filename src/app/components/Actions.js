export default async function cjProduct(query, next) {
  try {
    // Define the API endpoint URL using your environment variable
    const api = process.env.NEXT_PUBLIC_SERVER_API;

    // Create a timeout promise that rejects after the specified duration
    const timeout = 50000; // 30 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out'));
      }, timeout);
    });

    // Make an HTTP GET request to the API endpoint
    const response = await Promise.race([
      fetch(`${api}/querySearch?product=${query}&page=${next}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Ensure that the response is not cached
      }),
      timeoutPromise, // Include the timeout promise in the race
    ]);

    // Check if the HTTP response status is not OK (status code 200)
    if (!response.ok) {
      const errorResponse = await response.json(); // Parse the JSON error response
      return (JSON.stringify(errorResponse)); // Throw an error with the error response JSON
    }

    // Parse the JSON response and return it
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle different error scenarios

    if (error.message === 'Request timed out') {
      // Handle request timeout error
      return 'Request timeout';
    }  {
      // Other errors (including server errors)
      return error.message ;
    }
  }
}
