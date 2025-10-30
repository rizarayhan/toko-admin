import { prisma } from "@/lib/db";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({ params }: { params: { categoryId: string; storeId: string } }) => {
  const category = await prisma.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const banners = await prisma.banner.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm
          initialData={category}
          banners={banners}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
