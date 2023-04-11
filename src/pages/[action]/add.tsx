import HolisticComponent from "@/components/holisticComponent";
import Layout from "@/components/layout"
import { useState } from "react";

const Add = () => {
    const [toggle, setToggle] = useState(true);

  return (
    <Layout>
        {toggle && <HolisticComponent />}
        <button className="bg-indigo-800 p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 transition-colors" onClick={() => setToggle(!toggle)}>Toggle</button>
    </Layout>
  )
}

export default Add