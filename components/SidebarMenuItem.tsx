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
    "w-full rounded-xl bg-white p-2 lg:min-w-[110px] lg:pl-5 lg:text-xs text-xs font-bold text-[#011869] lg:text-left text-center";
  const nonActiveClass =
    "w-full rounded-xl bg-none p-2 lg:min-w-[110px] lg:pl-5 lg:text-xs text-xs font-bold text-white lg:text-left text-center";

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
