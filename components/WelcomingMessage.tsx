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
    <div className="relative flex items-center justify-between h-[11.5vh] w-full bg-white px-10 py-5 text-black">
      <div className="flex-grow border-l-2 border-black pl-4">
        <p className="text-l font-semibold">Selamat Datang</p>
        <p className="text-m">{user}</p>
      </div>

      <div className="absolute right-20 top-0">
        <Image
          height={200}
          width={200}
          className="w-[3vh]"
          alt="decoration"
          src="/deco.svg"
        />
      </div>
    </div>
  );
};

export default WelcomingMessage;
