import Layout from "@/components/layout";
import GestureRecognition from "@/components/gestureRecognition";
import Carousel from "@/components/carousel";

export default function Home() {
  return (
    <Layout>
      <GestureRecognition/>
      <Carousel />
    </Layout>
  );
}