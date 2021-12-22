/* eslint-disable @next/next/no-sync-scripts */
import React from "react";
import Head from "next/head";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>React Node Send</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto">
          <Header/>
          <main className="mt-20">{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;
