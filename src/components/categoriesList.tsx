import React, {useState} from "react";
import { getAllActions, IActions } from "@/hooks/useCategories";
import ActionsList from "./actionsList";

// Array with all the categories and its actions
const actions: IActions[] = getAllActions();

// Get all the categories
const extractCategories = (actions: IActions[]): string[] => {
  const categories: string[] = actions.map(action => action.category);
  return categories;
}

const CategoriesList: React.FC = () => {
  const categories = extractCategories(actions);
  const [selectedOption, setSelectedOption] = useState(categories[0]);

  // Gets the categorie of the clicked item
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    console.log(event.target.value)
  };

  // Returns all the categories in a listbox
  return (
    <>
      <select value={selectedOption} onChange={handleOptionChange}>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <div>< ActionsList category={selectedOption}/></div>
    </>
  )
}

export default CategoriesList
