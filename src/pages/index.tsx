import HolisticComponent from "@/components/holisticComponent";
import Layout from "@/components/layout";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import CategoriesList from "@/components/categoriesList";
import { ActionsProvider } from "@/context/ActionsProvider";

export default function Home() {
  return (
    <Layout>
      <ActionsProvider>
        <CategoriesList />
      </ActionsProvider>
    </Layout>
  );
}