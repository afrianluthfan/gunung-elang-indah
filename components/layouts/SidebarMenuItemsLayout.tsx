import { ReactNode } from "react";

const SidebarMenuItemsLayout = ({
  children,
}: Readonly<{ children: ReactNode }>) => (
  <div className="flex w-full flex-col gap-3">{children}</div>
);

export default SidebarMenuItemsLayout;
