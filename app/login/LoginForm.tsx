"use client";

import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { logIn } from "@/redux/features/auth-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

const WarningDialog = () => <dialog open>username salah!</dialog>;

const LoginForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = () => {
    dispatch(logIn(username));
    switch (username) {
      case "":
        break;
      case "sales":
        router.push("/profiling");
        break;
      case "admin":
        router.push("/proforma-invoice");
        break;
      case "logistik":
        router.push("/stok-barang");
        break;
      case "finance":
        router.push("/piutang");
      default:
        WarningDialog();
        break;
    }
  };

  return (
    <div className="flex h-full w-[50%] flex-col">
      <div>
        <h1 className="text-3xl font-bold">Hello Again!</h1>
        <p>Welcome Back</p>
      </div>
      <div className="mt-10 flex flex-col gap-5">
        <Input
          type="text"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <Input type="password" placeholder="Password" />
        <Button
          className="bg-[#00186D] font-bold text-white"
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
