import React, { useState } from "react";
import { getAllActions, IActions } from "@/helpers";
import ActionsList from "./actionsList";

// Array with all the categories and its actions
const actions: IActions[] = getAllActions();

// Get all the categories
const extractCategories = (actions: IActions[]): string[] => {
  const categories: string[] = actions.map(action => action.category);
  return categories;
}

// Array of categories
const categories = extractCategories(actions);

const CategoriesList: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState(categories[0]);

  // Gets the categorie of the clicked item
  const handleOptionChange = (category: string) => {
    setSelectedOption(category);
    console.log(`Category: ${category}`);
  };

  // TODO: Implement functionality for buttons
  // TODO: Better styling (Tailwind CSS)
  // Returns all the categories in buttons
  return (
    <div className="flex flex-row">
      <div className="basis-1/6 flex flex-col gap-y-2 bg-slate-900">
        {categories.map((category) => (
          <button className="p-2 bg-purple-900 hover:bg-purple-700 text-white ml-3 rounded w-full"
            onClick={() => { handleOptionChange(category) }} key={category}>
            {category}
          </button>
        ))}
      </div>
      <div className="basis-5/6">
        <ActionsList category={selectedOption}/>
      </div>
    </div>
  )
}

export default CategoriesList
