import Layout from '@/components/layout'
import dynamic from "next/dynamic";

// only load this component on the client, in its own chunk
const MobileActionRecognition = dynamic(
  () => import("@/components/MobileActionRecognition"),
  { ssr: false }
);

const Mobile = () => {
  return (
    <Layout>
        <MobileActionRecognition />
    </Layout>
  )
}

export default Mobile