import React from 'react'
import BackArrow from '../components/BackArrow';

export default function page() {
    return (
        <>
            <BackArrow/>
        <div className="max-w-2xl mx-auto p-4 mt-28">
          <h1 className="text-2xl font-semibold mb-4">Terms and Conditions</h1>
          <ol className="list-decimal list-inside mb-4">
            <li className="mb-2">
              <p className="mb-2">
                <strong>1. Acceptance of Terms</strong>
              </p>
              <p>
                By accessing or using the Xfery.com website (the "Site"), you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Site.
              </p>
            </li>
            <li className="mb-2">
              <p className="mb-2">
                <strong>2. Changes to Terms</strong>
              </p>
              <p>
                Xfery.com reserves the right to modify these Terms and Conditions at any time. You are responsible for regularly reviewing the terms. Continued use of the Site after any such changes constitutes your acceptance of the revised terms.
              </p>
            </li>
            <li className="mb-2">
              <p className="mb-2">
                <strong>3. Privacy Policy</strong>
              </p>
              <p>
                Please refer to our Privacy Policy for information on how we collect, use, and disclose your personal information.
              </p>
            </li>
            <li className="mb-2">
              <p className="mb-2">
                <strong>4. Intellectual Property</strong>
              </p>
              <p>
                All content on Xfery.com, including text, graphics, logos, images, and software, is the property of Xfery.com and is protected by copyright and other intellectual property laws. You may not use, reproduce, or distribute any content from the Site without our written permission.
              </p>
            </li>
            <li className="mb-2">
              <p className="mb-2">
                <strong>5. Products and Pricing</strong>
              </p>
              <p>
                Xfery.com offers a variety of products for sale. Prices are subject to change without notice. We make every effort to accurately display product descriptions and prices, but errors may occur. We reserve the right to correct any errors and cancel orders if necessary.
              </p>
            </li>
            <li>
              <p className="mb-2">
                <strong>6. Order Acceptance</strong>
              </p>
              <p>
                Your order is an offer to purchase a product, which is accepted by us when we confirm the order and ship the product. We reserve the right to refuse or cancel any order for any reason.
              </p>
            </li>
            <li>
              <p className="mb-2">
                <strong>7. Accepted Payment Methods</strong>
              </p>
              <p>
              Xfery.com accepts payments via the following methods: credit/debit cards, PayPal, and bank transfers. For bank transfers, please contact us via social media, WhatsApp, Instagram, etc. Currently, you can't make payments through the website for bank transfers.
              </p>
            </li>
            <li>
              <p className="mb-2">
                <strong>8. Payment Authorization</strong>
              </p>
              <p>
              By placing an order on Xfery.com, you authorize us to charge your selected payment method for the total amount of your order, including applicable taxes and shipping fees.
              </p>
            </li>
            <li>
              <p className="mb-2">
                <strong>9. Billing Information</strong>
              </p>
              <p>
              You are responsible for providing accurate and current billing information, including your name, billing address, and payment details. Providing false or inaccurate information may result in order cancellation.
              </p>
            </li>
            <li>
              <p className="mb-2">
                <strong>10. Payment Processing</strong>
              </p>
              <p>
              Payments on Xfery.com are processed in real-time, ensuring swift order confirmation and processing.
              </p>
            </li>
            <li>
              <p className="mb-2">
                <strong>11. Currency and Pricing</strong>
              </p>
              <p>
              All prices on Xfery.com are displayed in USD (United States Dollars) and do not include taxes. Customers are responsible for any currency conversion fees that may apply.
              </p>
            </li>
            <li>
              <p className="mb-2">
                <strong>12. Payment Security</strong>
              </p>
              <p>
              Xfery.com employs advanced security measures to protect your payment information. We use encryption and secure payment gateways to ensure the confidentiality and integrity of your data.
              </p>
            </li>
            <li>
              <p className="mb-2">
                <strong>13. Order Confirmation</strong>
              </p>
              <p>
              Upon successful payment processing, you will receive an order confirmation email or notification, providing details of your purchase.
              </p>
            </li>
            <li>
              <p className="mb-2">
                <strong>14. Payment Disputes</strong>
              </p>
              <p>
              In case of payment disputes or chargebacks, please contact our customer support team for resolution assistance. We are committed to addressing any payment-related concerns promptly.
              </p>
            </li>
            <li>
              <p className="mb-2">
                <strong>15. Refusal of Payment</strong>
              </p>
              <p>
              Xfery.com reserves the right to refuse payment if there are reasonable grounds to suspect fraudulent activity or a violation of our terms and conditions.
              </p>
            </li>
          </ol>
           {/* Copyright Notice */}
      <footer className="text-center text-gray-500 text-sm mt-4">
        &copy; {new Date().getFullYear()} Xfery.com. All rights reserved.
      </footer>
        </div>
        </>
      );
    }
    export function generateMetadata(){
      return{
        title:"xfery | Terms of use"
      }
    }