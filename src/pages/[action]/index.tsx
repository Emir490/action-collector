import Layout from "@/components/layout"
import List from "@/components/list";
import { ActionsProvider } from "@/context/ActionsProvider";
import useActions from "@/hooks/useActions";
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react";

const Actions = () => {
    const router = useRouter();
    const action = router.query.action;

    return (
        <ActionsProvider>
            <Layout>
                <Link href={`${action}/add`} className="p-3 ml-5 bg-indigo-800 hover:bg-indigo-700 transition-colors font-bold uppercase">Añadir Señas</Link>
                <List/>
            </Layout>
        </ActionsProvider>
    )
}

export default Actions