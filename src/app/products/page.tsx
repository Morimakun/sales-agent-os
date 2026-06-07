import { prisma } from "@/lib/db";
import ProductsManager from "./ProductsManager";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <div>
      <h1 className="text-xl font-bold mb-1">商品メニュー設定</h1>
      <p className="text-sm text-slate-500 mb-4">
        あなたが売る小型商品を登録します。ここに登録した内容を AI が分析・文面生成に使います。
      </p>
      <ProductsManager initial={products} />
    </div>
  );
}
