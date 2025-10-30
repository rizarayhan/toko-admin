import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name, images, price, categoryId, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name perlu diinput", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Image perlu diinput", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Harga perlu diinput", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category id perlu diinput", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id url dibutuhkan", { status: 400 });
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        categoryId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("PRODUCT_POST", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store id url dibutuhkan", { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("PRODUCTS_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
