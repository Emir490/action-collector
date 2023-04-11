import Layout from "@/components/layout"
import Link from "next/link"
import { useRouter } from "next/router"

const Actions = () => {
    const router = useRouter();
    const action = router.query.action 

  return (
    <Layout>
        <Link href={`${action}/add`} className="p-3 bg-indigo-800 hover:bg-indigo-700 transition-colors font-bold uppercase">Añadir Señas</Link>
    </Layout>
  )
}

export default Actions