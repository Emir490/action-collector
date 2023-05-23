import React from "react";
import { getAllActions, IActions } from "@/helpers";
import Link from "next/link";

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {actionsArray.map((action) => (
                <Link className="text-white p-3 text-center bg-indigo-800 hover:bg-indigo-600 transition-colors rounded capitalize" href={{ pathname: `/menu/${action}`, query: { category, action } }} key={action}>
                    {action}
                </Link>
            ))}
        </div>
    )
}

export default ActionsList;