import { ReactNode } from "react";

const ContentTopSectionLayout = ({
  children,
}: Readonly<{ children: ReactNode }>) => (
  <section className="flex flex-col gap-4 lg:flex-row">{children}</section>
);

export default ContentTopSectionLayout;
