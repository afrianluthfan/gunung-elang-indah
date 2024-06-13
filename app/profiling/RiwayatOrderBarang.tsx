import { Card } from "@nextui-org/react";

const RiwayatOrderBarang = () => (
  <section className="flex h-full flex-col">
    <h1 className="text-[1.5vh] font-bold">Riwayat Order Barang</h1>
    <div className="mt-2 flex h-full w-full justify-between gap-3">
      <Card className="h-full w-full" />
      <Card className="h-full w-full" />
      <Card className="h-full w-full" />
      <Card className="h-full w-full" />
    </div>
  </section>
);

export default RiwayatOrderBarang;
