import React from "react";
import { getAllActions, IActions } from "@/hooks/useCategories";

const actions: IActions[] = await getAllActions();

const extractCategories = (actions: IActions[]): string[] => {
  const categories: string[] = actions.map(action => action.category);
  return categories;
}

const CategoriesList: React.FC = () => {
  const categories = extractCategories(actions);
  return (
    <select>
      {categories.map((categorie) => (
        <option>{categorie}</option>
      ))}
    </select>
  )
}

export default CategoriesList
