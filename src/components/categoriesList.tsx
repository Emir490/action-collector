// Import your custom hook here
import React, { useState } from "react";
import { getAllActions, IActions } from "@/helpers";
import ActionsList from "./actionsList";
import Link from "next/link";
import { useRouter } from "next/router";
import useMobile from "@/hooks/useMobile";

// Array with all the categories and its actions
const actions: IActions[] = getAllActions();

// Get all the categories
const extractCategories = (actions: IActions[]): string[] => {
  const categories: string[] = actions.map((action) => action.category);
  return categories;
};

// Array of categories
const categories = extractCategories(actions);

const CategoriesList: React.FC = () => {
  const router = useRouter();

  const categorySelected = categories.find(
    (category) => category === router.query.category
  );

  const [selectedOption, setSelectedOption] = useState(
    categorySelected ?? categories[0]
  );

  // Use your custom hook here
  const isMobile = useMobile();

  // Gets the categorie of the clicked item (Butttons)
  const handleClickButton = (category: string) => {
    setSelectedOption(category);
  };

  // Gets the category of selected item (DropList)
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  // Returns all the categories in buttons
  return (
    <div className="flex flex-col sm:flex-row px-3">
      {isMobile ? ( // Display for mobile
        <div className="m-3">
          <select
            className="font-semibold text- p-2 bg-purple-900 text-white rounded w-full transition-colors"
            value={selectedOption}
            onChange={handleOptionChange}
          >
            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      ) : (
        // Display for larger screens
        <div className="flex flex-col gap-y-2 m-3">
          {categories.map((category) => (
            <Link
              className="font-semibold hover:font-bold p-2 bg-purple-900 hover:bg-purple-700 text-white rounded w-full transition-colors"
              href={{
                pathname: `/menu/${category}`,
                query: { category: `${category}`, menu: true },
              }}
              onClick={() => {
                handleClickButton(category);
              }}
              key={category}
            >
              {category}
            </Link>
          ))}
        </div>
      )}
      <div className="m-3">
        <ActionsList category={selectedOption} />
      </div>
    </div>
  );
};

export default CategoriesList;
