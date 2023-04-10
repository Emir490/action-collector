import React, { ReactNode, useState } from "react";
import { getAllActions, IActions } from "@/helpers";

// Array with all the categories and its actions
const actions: IActions[] = getAllActions();

type ActionsListProps = {
    category: string
};

const ActionsList = ({category}: ActionsListProps) => {
    const actionsObj = actions.find((action) => action.category === category)
    // Gets the string[] of actions
    const actionsArray = actionsObj ? actionsObj.actions : ["Sin opciones"];

    const [selectedOption, setSelectedOption] = useState(actionsArray[0]);

    // Gets the categorie of the clicked item

    //Returns all the actions in a listbox
    return (
        <div>
            {actionsArray.map((action) => (
                <button className="text-white m-2 p-3 bg-indigo-800 hover:bg-indigo-700 transition-colors rounded" onClick={() => {
                    console.log(action);
                }}>
                    {action}
                </button>))}
        </div>
    )
}

export default ActionsList