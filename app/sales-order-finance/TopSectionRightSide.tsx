"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const TopSectionRightSide = () => {

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("statusAccount");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const router = useRouter();
  return (
    <div className="flex justify-normal gap-2">

      <Button
        onClick={() => window.location.reload()}
        className="bg-[#0C295F] font-semibold text-white"
      >
        Segarkan
      </Button>

      {username === "ADMIN" && (
        <Button
          onClick={() => router.push("/purchase-order/form")}
          className="bg-[#00a110] font-semibold text-white"
        >
          Tambah
        </Button>
      )}
    </div>
  );


};

export default TopSectionRightSide;
