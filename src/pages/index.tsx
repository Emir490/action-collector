import Layout from "@/components/layout";
import CategoriesList from "@/components/categoriesList";
import GestureRecognition from "@/components/gestureRecognition";
import Game from "@/components/game";

export default function Home() {
  return (
    <Layout>
      {/* <GestureRecognition/> */}
      <Game/>
    </Layout>
  );
}