import { Action } from "@/interfaces/action";
import { ActionsContextProps } from "@/interfaces/actions";
import axios from "axios";
import { ReactNode, createContext, useState } from "react";

const ActionsContext = createContext<ActionsContextProps>({} as ActionsContextProps);

const ActionsProvider = ({ children }: {children: ReactNode}) => {
    const [actions, setActions] = useState<Action[]>([]);

    const getActions = async (action: string) => {
        try {
            const { data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/actions/${action}`);

            setActions(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ActionsContext.Provider value={{actions, setActions, getActions}}>
            {children}
        </ActionsContext.Provider>
    )
}

export { ActionsProvider }

export default ActionsContext;