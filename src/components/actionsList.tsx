import React, { ReactNode, useState } from "react";
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
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {actionsArray.map((action) => (
                <Link href={{ pathname: `${action}`, query: { category, action } }} className="text-white p-3 bg-indigo-800 hover:bg-indigo-600 transition-colors rounded first-letter:uppercase"
                    key={action}>
                    {action}
                </Link>
            ))}
        </div>
    )
}

export default ActionsList