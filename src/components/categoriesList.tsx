import React, { useState } from "react";
import { getAllActions, IActions } from "@/helpers";
import ActionsList from "./actionsList";
import Link from "next/link";
import { useRouter } from "next/router";

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
  const router = useRouter();

  const categorySelected = categories.find(category => category === router.query.category);

  const [selectedOption, setSelectedOption] = useState(categorySelected ?? categories[0]);

  // Gets the categorie of the clicked item
  const handleOptionChange = (category: string) => {
    setSelectedOption(category);
  }

  // TODO: Implement functionality for buttons
  // TODO: Better styling (Tailwind CSS)
  // Returns all the categories in buttons
  return (
    <div className="container mx-auto flex gap-x-6 mt-5">
      <div className="flex flex-col">
        {categories.map((category) => (
          <Link href={{ pathname: `${category}`, query: { category: `${category}`, menu: true } }} className="p-2 bg-purple-900 hover:bg-purple-700 text-white ml-3 rounded w-full mb-2 transition-colors"
            onClick={() => { handleOptionChange(category) }} key={category}>
            {category}
          </Link>
        ))}
      </div>
      <ActionsList category={selectedOption}/>
    </div>
  )
}

export default CategoriesList
