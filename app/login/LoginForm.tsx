"use client";

import React, { useState, useEffect, use } from "react";
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

  // Define role-based passwords
  const roleBasedPasswords: Record<string, string> = {
    sales: "@FismedSales2024",
    admin: "@AdminFismed24",
    finance: "@KeuanganFismed224",
    logistik: "@BagianGudan002024",
  };

  const handleLogin = async () => {
    // Check if the password field is empty
    if (!password && !username) {
      setAlert({
        visible: true,
        message: "Uername dan Password Masih Kosong!",
      });
      setTimeout(() => {
        setAlert({ visible: false, message: "" });
      }, 5000); // Hide alert after 3 seconds
      return;
    } else if (!username) {
      setAlert({
        visible: true,
        message: "Username Masih Kosong!",
      });
      setTimeout(() => {
        setAlert({ visible: false, message: "" });
      }, 5000); // Hide alert after 3 seconds
      return;
    } else if (!password) {
      setAlert({
        visible: true,
        message: "Password Masih Kosong!",
      });
      setTimeout(() => {
        setAlert({ visible: false, message: "" });
      }, 5000); // Hide alert after 3 seconds
      return;
    }


    // Validate password based on username
    const expectedPassword = roleBasedPasswords[username];
    if (expectedPassword && password !== expectedPassword) {
      setAlert({
        visible: true,
        message: "Username atau Password Salah!",
      });
      setTimeout(() => {
        setAlert({ visible: false, message: "" });
      }, 3000); // Hide alert after 3 seconds
      return;
    }

    // Proceed with login if password is correct
    const result = await dispatch(logIn({ username, password }));
    if (result.payload) {
      // Save username in localStorage
      localStorage.setItem('username', username);
      // Redirect based on user role
      switch (username) {
        case "sales":
          router.push("/proforma-invoice");
          break;
        case "admin":
          router.push("/profiling");
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
    } else {
      setAlert({ visible: true, message: "Incorrect username or password" });
      setTimeout(() => {
        setAlert({ visible: false, message: "" });
      }, 3000); // Hide alert after 3 seconds
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      handleLogin(); // Call the handleLogin function
    }
  };

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuth) {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        switch (storedUsername) {
          case "sales":
            router.push("/proforma-invoice");
            break;
          case "admin":
            router.push("/profiling");
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
    }
  }, [isAuth, router]);

  return (
    <div className="absolute flex h-full w-[50%] flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Hello Again!</h1>
        <p className="text-lg text-gray-600">Welcome Back</p>
      </div>
      <div className="mt-10 flex flex-col gap-5">
        <Input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          className="bg-[#00186D] font-bold text-white"
          onClick={handleLogin}
        >
          Login
        </Button>

      </div>
      {alert.visible && (
        <div
          style={{
            backgroundColor: "#ffeded",
            color: "#f44336",
            border: "1px solid #f44336",
            borderRadius: "4px",
            padding: "10px",
            marginTop: "10px",
            textAlign: "center",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <strong>Error:</strong> {alert.message}
        </div>
      )}

    </div>

  );
};

export default LoginForm;
