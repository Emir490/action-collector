import React, {useState} from "react";
import { getAllActions, IActions } from "@/hooks/useCategories";

// Array with all the categories and its actions
const actions: IActions[] = getAllActions();

type ActionsListProps = {
    category: string
  };

const ActionsList: React.FC<ActionsListProps> = ({category}) => {
    const actionsObj = actions.find((action) => action.category === category)
    // Gets the string[] of actions
    const actionsArray = actionsObj? actionsObj.actions : ["Sin opciones"];

    const [selectedOption, setSelectedOption] = useState(actionsArray[0]);

    // Gets the categorie of the clicked item
    const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
        console.log(event.target.value)
    };

    //Returns all the actions in a listbox
    return (
        <select value={selectedOption} onChange={handleOptionChange}>{actionsArray.map((action) => (
            <option>
                {action}
            </option>
        ))}
        </select>
    )
}

export default ActionsList