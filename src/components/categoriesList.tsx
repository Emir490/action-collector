import React, {useState} from "react";
import { getAllActions, IActions } from "@/helpers";
import ActionsList from "./actionsList";

// Array with all the categories and its actions
const actions: IActions[] = getAllActions();

// Get all the categories
const extractCategories = (actions: IActions[]): string[] => {
  const categories: string[] = actions.map(action => action.category);
  return categories;
}

const categories = extractCategories(actions);

const CategoriesList: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState(categories[0]);

  // Gets the categorie of the clicked item
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    console.log(event.target.value)
  };

  // Returns all the categories in a listbox
  return (
    <>
      <select className="p-2 bg-indigo-800 text-white m-3" value={selectedOption} onChange={handleOptionChange}>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      < ActionsList category={selectedOption}/>
    </>
  )
}

export default CategoriesList
