"use client";

import React from "react";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  // the function below acts as a router to switch between pages
  const router = useRouter();
  return (
    <div className="flex w-[50%] flex-col">
      <div>
        <h1 className="text-3xl font-bold">Hello Again!</h1>
        <p>Welcome Back</p>
      </div>
      <div className="mt-10 flex flex-col gap-5">
        <Input type="text" placeholder="Username" />
        <Input type="password" placeholder="Password" />
        <Button
          className="bg-[#00186D] font-bold text-white"
          onClick={() => router.push("/profiling")}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
