"use client";

import ContentTopSectionLayout from "@/components/layouts/TopSectionLayout";
import TopSectionLeftSide from "./TopSectionLeftSide";
import { Button, Divider, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { FC } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  total: string;
  price: string;
}

const MainContent: FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const onSubmit = async (data: FormData) => {
    if (!data.name || !data.total || !data.price) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/stock-barang/add`, data);
      console.log("Barang berhasil ditambahkan:", response.data);
      alert("Barang berhasil ditambahkan!");
      router.push("/stok-barang");
      reset(); // Reset form setelah submit berhasil
    } catch (error) {
      console.error("Error menambahkan barang:", error);
      alert("Error menambahkan barang!");
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6 p-8">
      <ContentTopSectionLayout>
        {/* cek profile customer and searchbar */}
        <TopSectionLeftSide />
      </ContentTopSectionLayout>
      <Divider />

      <form className="grid h-full w-full grid-cols-3 gap-3" onSubmit={handleSubmit(onSubmit)}>
        {/* first column */}
        <div className="flex flex-col gap-3">
          <Input
            {...register("name", { required: "Nama Barang wajib diisi" })}
            label="Nama Barang"
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name}
          />

          <Input
            {...register("total", { required: "Total Penambahan wajib diisi" })}
            label="Total Penambahan"
            type="number"
            errorMessage={errors.total?.message}
            isInvalid={!!errors.total}
          />
          <Input
            {...register("price", { required: "Harga Barang wajib diisi" })}
            label="Harga Barang"
            type="number"
            errorMessage={errors.price?.message}
            isInvalid={!!errors.price}
          />
        </div>

        <div className="flex col-span-3 justify-end mt-4">
          <Button type="submit" color="primary">Tambah Barang</Button>
        </div>
      </form>
    </div>
  );
};

export default MainContent;
