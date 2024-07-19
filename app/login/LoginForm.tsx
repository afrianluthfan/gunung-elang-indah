"use client";

import React, { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { logIn } from "@/redux/features/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

const LoginForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useSelector((state: RootState) => state.auth.value.isAuth);
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.value.username
  );

  const handleLogin = async () => {
    const result = await dispatch(logIn({ username, password }));
    if (!result.payload) {
      setAlert({ visible: true, message: "Incorrect username or password" });
      setTimeout(() => {
        setAlert({ visible: false, message: "" });
      }, 3000); // Hide alert after 3 seconds
    }
  };

  useEffect(() => {
    if (isAuth) {
      switch (loggedInUser) {
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
          break;
        default:
          break;
      }
    }
  }, [isAuth, loggedInUser, router]);

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
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
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
