import { prisma } from "@/lib/db";

interface DashboardPageProps {
  params: { storeId: string };
}

const DasboardPage = async ({ params }: DashboardPageProps) => {
  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return <div>Active Store = {store?.name}</div>;
};

export default DasboardPage;
