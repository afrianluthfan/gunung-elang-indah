import Image from "next/image";
import { FC } from "react";

const SidebarTopItem: FC = () => {
  return (
    <div className="flex min-w-[110px] flex-col items-center justify-center">
      <div className="flex aspect-square w-[35%] items-center justify-center overflow-hidden rounded-full border border-white">
        <Image
          src="/logo.jpg" // Perhatikan bahwa src seharusnya menggunakan path relatif dari public folder, bukan "../public/logo.jpg"
          alt="Logo"
          width={0}
          height={0}
          className="h-full w-full object-cover" // Mengatur gambar untuk menutupi elemen
        />
      </div>
      <p className="mt-5 text-center text-sm text-white lg:text-sm">
        PT Fismed Global Indonesia
      </p>
    </div>
  );
};

export default SidebarTopItem;
