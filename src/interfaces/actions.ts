import { Dispatch, SetStateAction } from "react";
import { Action } from "./action";

export interface ActionsContextProps {
    actions: Action[];
    setActions: Dispatch<SetStateAction<Action[]>>;
    getActions: (action: string) => Promise<void>;
}