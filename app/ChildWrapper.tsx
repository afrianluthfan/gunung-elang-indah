"use client";

import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { FC, useEffect } from "react";

interface ChildWrapperProps {
  children: React.ReactNode;
}

const ChildWrapper: FC<ChildWrapperProps> = ({ children }) => {
  const username = useAppSelector((state) => state.auth.value.username);
  const router = useRouter();

  useEffect(() => {
    if (!username) {
      router.push("/login");
    }
  }, [username, router]);
  return <>{children}</>;
};

export default ChildWrapper;
