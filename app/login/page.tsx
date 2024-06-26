"use client";

import Image from "next/image";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <section>
      <div className="relative flex">
        <div className="absolute bottom-[25%] left-[13%] top-[25%] z-10 flex h-[50%] flex-col justify-center">
          <h1 className="max-w-[200px] text-6xl font-bold">
            Smart Warehouse and Finance
          </h1>
          <p className="mt-3 text-lg">
            Create Ease for Your Business with ERP Technology
          </p>
        </div>
        <Image
          width={2000}
          height={2000}
          alt="foto"
          src="/login_image.jpg"
          className="absolute h-screen w-[67.5vw] object-cover"
          priority
        />
        <div className="h-screen w-[67.5vw] bg-gradient-to-br from-[#0035EF] to-[#000F41] opacity-50" />
        <div className="relative flex h-[100vh] w-[32.5vw] flex-col items-center justify-between bg-white text-black">
          <div className="flex h-full items-start">
            <Image
              width={300}
              height={300}
              alt="foto"
              src="/deco.svg"
              className="w-[4vh]"
              priority
            />
          </div>
          <LoginForm />
          <div className="flex h-full items-end pb-5">
            <p className="text-xs font-bold">
              Supported by PT Gunung Elang Indah
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
