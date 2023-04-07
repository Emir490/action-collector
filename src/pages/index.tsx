import HolisticComponent from "@/components/holisticComponent";
import Layout from "@/components/layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex justify-center mt-10 flex-col">
        {/* <Video /> */}
        <HolisticComponent />
        <button className="bg-indigo-800 p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 transition-colors">Collect Data</button>
      </div>
    </Layout>
  );
}
