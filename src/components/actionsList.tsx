import React, { ReactNode, useState } from "react";
import { getAllActions, IActions } from "@/helpers";

// Array with all the categories and its actions
const actions: IActions[] = getAllActions();

type ActionsListProps = {
    category: string
};

const ActionsList = ({ category }: ActionsListProps) => {
    // Gets the string[] of actions
    const actionsObj = actions.find((action) => action.category === category)
    const actionsArray = actionsObj ? actionsObj.actions : ["Sin opciones"];

    //Returns all the actions in buttons
    return (
        <div className="grid grid-cols-6 gap-2">
            {actionsArray.map((action) => (
                <button className="text-white p-3 bg-indigo-800 hover:bg-indigo-600 transition-colors rounded first-letter:uppercase"
                    onClick={() => { console.log(`Action: ${action}`); }} key={action}>
                    {action}
                </button>
            ))}
        </div>
    )
}

export default ActionsList