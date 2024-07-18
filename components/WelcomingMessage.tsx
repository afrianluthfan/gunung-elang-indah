"use client";

import { FC, useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import Image from "next/image";

const WelcomingMessage: FC = () => {
  const activeUser = useAppSelector((state) => state.auth.value.username);
  const [user, setUser] = useState("");

  useEffect(() => {
    switch (activeUser) {
      case "admin":
        setUser("Staff Admin");
        break;
      case "sales":
        setUser("Staff Sales");
        break;
      case "logistik":
        setUser("Staff Logistik");
        break;
      case "finance":
        setUser("Staff Finance");
        break;
      case "sa":
        setUser("Super Admin");
        break;
      default:
        setUser("Staff");
        break;
    }
  }, [activeUser]);

  return (
    <div className="relative flex h-[11.5vh] w-full bg-white px-10 py-7 text-black">
      <div className="h-full w-[3px] bg-black" />
      <div className="ml-1 flex h-full flex-col justify-between">
        <h1 className="text-[1.3em] font-bold">Selamat Datang</h1>
        <p>{user}</p>
      </div>
      <Image
        height={300}
        width={300}
        className="absolute right-20 top-0 w-[3vh]"
        alt="decoration"
        src="/deco.svg"
      />
    </div>
  );
};

export default WelcomingMessage;
