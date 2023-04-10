import HolisticComponent from "@/components/holisticComponent";
import Layout from "@/components/layout";
import { useState } from "react";
import CategoriesList from "@/components/categoriesList";
import ActionsList from "@/components/actionsList";

export default function Home() {
  const [toggle, setToggle] = useState(true);

  return (
    <Layout>
      <div> { <CategoriesList /> } </div>
      <div className="container mx-auto">
        {/* <Video /> */}
        {/* {toggle && <HolisticComponent />} */}
        <button className="bg-indigo-800 p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 transition-colors" onClick={() => setToggle(!toggle)}>Toggle</button>
      </div>
    </Layout>
  );
}