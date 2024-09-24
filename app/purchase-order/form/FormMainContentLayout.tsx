import { ReactNode } from "react";

const FormMainContentLayout = ({
  children,
}: Readonly<{ children: ReactNode }>) => (
  <div className="h-fit w-full rounded-xl bg-white">{children}</div>
);

export default FormMainContentLayout;
