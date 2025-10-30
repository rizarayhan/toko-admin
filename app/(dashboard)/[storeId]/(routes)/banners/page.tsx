import { prisma } from "@/lib/db";
import { BannerClient } from "./components/client";
import { BannerColumn } from "./components/columns";
import { format } from "date-fns";

const BannersPage = async ({ params }: { params: { storeId: string } }) => {
  const banners = await prisma.banner.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBanners: BannerColumn[] = banners.map((banner) => ({
    id: banner.id,
    label: banner.label,
    createdAt: format(banner.createdAt, "MMM, do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BannerClient data={formattedBanners} />
      </div>
    </div>
  );
};

export default BannersPage;
