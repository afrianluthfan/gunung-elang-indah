"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";



import { useEffect, useState } from 'react';

const TopSectionRightSide = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const router = useRouter();
  return (
    <div className="flex justify-normal gap-2">

      <Button
        onClick={() => window.location.reload()}
        className="bg-blue-900 font-semibold text-white"
      >
        Segarkan
      </Button>

      {username === "sales" && (
        <Button
          onClick={() => router.push("/proforma-invoice-dua/form")}
          className="bg-[#00a110] font-semibold text-white"
        >
          Tambah
        </Button>
      )}


    </div>
  );
};

export default TopSectionRightSide;
