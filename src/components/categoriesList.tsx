import React, { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  // Gets the categorie of the clicked item (Butttons)
  const handleClickButton = (category: string) => {
    setSelectedOption(category);
    console.log(`Category: ${category}`);
  };

  // Gets the category of selected item (DropList)
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value)
  }

  // Determine screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Breakpoint for mobile screens
    };
    handleResize(); // Initial detection
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Returns all the categories in buttons
  return (
    <div className="flex flex-col md:flex-row px-3">
      {isMobile ? ( // Display for mobile
        <div className="m-3">
          <select className="font-semibold text- p-2 bg-purple-900 text-white rounded w-full transition-colors"
                  value={selectedOption} onChange={handleOptionChange}>
            {categories.map((category) => (
              <option value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      ) : ( // Display for larger screens
        <div className="basis-1/6 flex md:flex-col md:gap-y-2 m-3">
          {categories.map((category) => (
            <button className="font-semibold hover:font-bold p-2 bg-purple-900 hover:bg-purple-700 text-white rounded w-full transition-colors"
              onClick={() => { handleClickButton(category) }} key={category}>
              {category}
            </button>
          ))}
        </div>
      )}
      <div className="md:basis-5/6 m-3">
        <ActionsList category={selectedOption} />
      </div>
    </div>
  )
}

export default CategoriesList
