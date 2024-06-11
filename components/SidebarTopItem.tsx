import { FC } from "react";

const SidebarTopItem: FC = () => {
  return (
    <div className="flex min-w-[110px] flex-col items-center justify-center">
      <div className="flex aspect-square w-[30%] items-center justify-center rounded-full border border-white" />
      <p className="mt-5">PT Dummy Untuk Indonesia</p>
    </div>
  );
};

export default SidebarTopItem;
