import ActionsContext from "@/context/ActionsProvider";
import { useContext } from "react"

const useActions = () => {
    return useContext(ActionsContext);
}

export default useActions;