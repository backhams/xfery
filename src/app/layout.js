import "./globals.css";
import { Inter } from "next/font/google";

import Session from "./components/Session";
import Provder from "./Redux/Provder";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Session>
          <Provder>{children}</Provder>
        </Session>
      </body>
    </html>
  );
}
