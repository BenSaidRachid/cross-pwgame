import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { urls } from "../../data";

export default function Home() {
  return (
    <Layout className="justify-center items-center">
      <div>
        <Link
          className="bg-dark-500 p-8 hover:shadow-lg hover:bg-dark-700 rounded-md text-white font-bold text-2xl"
          to={urls.rooms.base}
        >
          Enter a room
        </Link>
      </div>
    </Layout>
  );
}
