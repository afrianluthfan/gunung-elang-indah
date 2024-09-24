import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const TopSectionLeftSide = () => {
  const router = useRouter();
  const backButton = () => {
    router.push("/sales-order");
  };

  return (
    <div className="flex w-full justify-between">
      <h1 className="text-xl font-bold lg:text-[1.85vh]">Detail Sales Order</h1>
      <Button color="primary" onClick={backButton}>
        Kembali
      </Button>
    </div>
  );
};

export default TopSectionLeftSide;
