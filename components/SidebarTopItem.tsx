import { FC } from "react";

const SidebarTopItem: FC = () => {
  return (
    <div className="flex min-w-[110px] flex-col items-center justify-center">
      <div className="flex aspect-square w-[35%] items-center justify-center rounded-full border border-white overflow-hidden">
        <img
          src="/logo.jpg" // Perhatikan bahwa src seharusnya menggunakan path relatif dari public folder, bukan "../public/logo.jpg"
          alt="Logo"
          className="w-full h-full object-cover" // Mengatur gambar untuk menutupi elemen
        />
      </div>
      <p className="mt-5 text-center">PT Fismed Global Indonesia</p>
    </div>
  );
};

export default SidebarTopItem;
