import CategoriesList from '@/components/categoriesList';
import Layout from '@/components/layout';
import List from '@/components/list';
import { ActionsProvider } from '@/context/ActionsProvider';
import useActions from '@/hooks/useActions';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaPlusCircle } from 'react-icons/fa';

const Actions = () => {
    const router = useRouter();
    const category = router.query.category;
    const action = router.query.action;
    const menu = router.query.menu;

    return (
        <Layout>
            {menu ? (
                <CategoriesList />
            ) : (
                <>
                    <div className="flex justify-end">
                        <Link href={{ pathname: `${action}/add`, query: { action, category } }} className="p-3 ml-5 bg-indigo-800 hover:bg-indigo-700 transition-colors font-bold uppercase text-white inline-flex items-center gap-x-2 rounded-lg">
                            <FaPlusCircle className="inline" color="#FFF" />
                            <p>Añadir Señas</p>
                        </Link>
                    </div>
                    <List />
                </>
            )}
        </Layout>
    );
};

export default Actions;
