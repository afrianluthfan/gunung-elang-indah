import Link from "next/link";
import React, { FC } from "react";

interface SidebarMenuItemProps {
  pageName: String;
  pageRoute: String;
  active?: boolean;
}

const SidebarMenuItem: FC<SidebarMenuItemProps> = ({
  pageName,
  pageRoute,
  active,
}) => {
  const activeClass =
    "w-full rounded-xl bg-white p-2 min-w-[110px] pl-5 font-bold text-[#011869]";
  const nonActiveClass =
    "w-full rounded-xl bg-none p-2 min-w-[110px] pl-5 font-bold text-white";

  return (
    <Link
      href={`/${pageRoute}`}
      className={active ? activeClass : nonActiveClass}
    >
      {pageName}
    </Link>
  );
};

export default SidebarMenuItem;
