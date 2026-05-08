


// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import React from "react";
// import { AuthProvider } from "@/AuthContext";
// import TanstackProvider from "../../providers/TankstackProvider";
// import { Toaster } from "./components/ui/toaster";
// import "./globals.css";

// // Load Monument Extended locally
// // const monument = localFont({
// //   src: [
// //     {
// //       path: "../public/fonts/MonumentExtended-Regular.otf",
// //       weight: "400",
// //       style: "normal",
// //     },
// //   ],
// //   variable: "--font-monument",
// // });

// export const metadata: Metadata = {
//   title: "Data Capturing",
//   description: "Data Capturing",
//   icons: {
//     icon: "/Group 1.png"
//   }

  
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" >
//       <body className="font-[var(--font-monument)]">
//         <AuthProvider>
//           <TanstackProvider>
           
//             <main>{children}</main>

//             <Toaster />
//           </TanstackProvider>
//         </AuthProvider>

//         <script
//           src="https://unpkg.com/flowbite@1.5.1/dist/flowbite.js"
//           async
//         ></script>
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import React from "react";
import { AuthProvider } from "@/AuthContext";
import TanstackProvider from "../../providers/TankstackProvider";
import { Toaster } from "./components/ui/toaster";
import "./globals.css";
import { NotificationProvider } from "@/contexts/NotificationContext";

export const metadata: Metadata = {
  title: "Data Capturing",
  description: "Data Capturing",
  icons: {
    icon: "/Group 1.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TanstackProvider>
            <NotificationProvider>
              <main>{children}</main>
              <Toaster />
            </NotificationProvider>
          </TanstackProvider>
        </AuthProvider>
        <script
          src="https://unpkg.com/flowbite@1.5.1/dist/flowbite.js"
          async
        ></script>
      </body>
    </html>
  );
}