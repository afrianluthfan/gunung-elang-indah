"use client";

import { FC, useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";

import { Button } from "@nextui-org/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logOut } from "@/redux/features/auth-slice";

const WelcomingMessage: FC = () => {
  const activeUser = useAppSelector((state) => state.auth.value.statusAcount);
  const [user, setUser] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    switch (activeUser) {
      case "ADMIN":
        setUser("Staff Admin");
        break;
      case "SALES":
        setUser("Staff Sales");
        break;
      case "LOGISTIK":
        setUser("Staff Logistik");
        break;
      case "KEUANGAN":
        setUser("Staff Finance");
        break;
      case "SUPER ADMIN":
        setUser("Super Admin");
        break;
      default:
        setUser("Staff");
        break;
    }
  }, [activeUser]);

  const validateToken = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${apiUrl}/token-validate`, {
        token
      },
      );

      if (response.data.status) {
      } else {
        handleLogout(); 
        localStorage.clear();
      } 
    } catch (error) {
      console.error("Error validating token:", error);
      handleLogout();
      localStorage.clear();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    dispatch(logOut());    
    setUser("");
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <div className="relative flex h-[11.5vh]  w-full items-center justify-between bg-white px-2 py-5 text-black">
      <div
        className={`fixed left-0 top-0 z-[40] h-full w-full transition-transform duration-300 ease-in-out lg:z-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } w-[60vw] md:w-[15vw] md:translate-x-0`}
      >
        <Sidebar />
      </div>

      <Button
        className={`z-[100] mr-2 h-[40px] w-[40px] min-w-0 rounded-xl px-0 transition-all ease-in-out md:hidden ${isSidebarOpen ? "bg-white" : "bg-[#1e3a8a]"}`}
        onClick={toggleSidebar}
      >
        <svg
          width="800px"
          height="800px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          className={`transition-all ${isSidebarOpen ? "rotate-90 transform" : ""}`}
        >
          <path
            fill={isSidebarOpen ? "#2563EB" : "#fff"}
            fill-rule="evenodd"
            d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
          />
        </svg>
      </Button>
      <div className="flex-grow border-l-2 border-black pl-4">
        <p className="text-l font-semibold">Selamat Datang</p>
        <p className="text-m">{user}</p>
      </div>

      <div className="absolute right-10 top-0 md:right-20">
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
