"use client";

import React, { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import axios from "axios";
import { logIn } from "../../redux/features/auth-slice";
import Swal from "sweetalert2";

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Define role-based passwords
  const roleBasedPasswords: Record<string, string> = {
    // test push
    sales: "@FismedSales2024",
    admin: "@AdminFismed24",
    finance: "@KeuanganFismed224",
    logistik: "@BagianGudan002024",
  };

  const handleLogin = async () => {
    if (!password || !username) {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian',
        text: !username ? "Username Masih Kosong!" : "Password Masih Kosong!",
        timerProgressBar: true,
        willClose: () => {
          setAlert({ visible: false, message: "" });
        }
      });
      return;
    }

    try {
      // Perform login request
      const response = await axios.post(`${apiUrl}/login`, {
        username,
        password,
      });

      console.log("API Response:", response.data); // Debug API response

      const { data, message, status } = response.data;

      if (status) {
        // Store token and user data
        localStorage.setItem("username", data[0].username);
        localStorage.setItem("token", data[0].token);
        localStorage.setItem("statusAccount", data[0].role_name);

        // Dispatch login action
        dispatch(
          logIn({ username, password, statusAccount: data[0].role_name }),
        );

        // Redirect based on user role
        switch (data[0].role_name.toLowerCase()) {
          case "sales":
            router.push("/proforma-invoice-dua");
            break;
          case "admin":
            router.push("/beranda");
            break;
          case "logistik":
            router.push("/stok-barang");
            break;
          case "keuangan":
            router.push("/beranda");
            break;
          case "super admin":
            router.push("/beranda");
            break;
          default:
            break;
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: 'Username atau Password Salah!',
          timerProgressBar: true,
          willClose: () => {
            setAlert({ visible: false, message: "" });
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: 'Terjadi kesalahan saat login!',
        timerProgressBar: true,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      handleLogin(); // Call the handleLogin function
    }
  };

  useEffect(() => {
    if (isAuth) {
      const storedUsername = localStorage.getItem("statusAccount");
      if (storedUsername) {
        switch (storedUsername) {
          case "SALES":
            router.push("/proforma-invoice");
            break;
          case "ADMIN":
            router.push("/profiling");
            break;
          case "LOGISTIK":
            router.push("/stok-barang");
            break;
          case "KEUANGAN":
            router.push("/piutang");
            break;
          case "SUPER ADMIN":
            router.push("/beranda");
            break;
          default:
            break;
        }
      }
    }
  }, [isAuth, router]);

  return (
    <div className="absolute flex h-full flex-col items-center justify-center p-8 lg:w-[50%]">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold">Hello Again!</h1>
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
          className="bg-[#0C295F] font-bold text-white"
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
