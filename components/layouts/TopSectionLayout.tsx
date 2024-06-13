import { ReactNode } from "react";

const ContentTopSectionLayout = ({
  children,
}: Readonly<{ children: ReactNode }>) => (
  <section className="flex gap-4">{children}</section>
);

export default ContentTopSectionLayout;
