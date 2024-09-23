"use client";

import Image from "next/image";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <section>
      <div className="relative flex">
        {/* Banner hanya akan tampil di mode desktop (lg dan ke atas) */}
        <div className="hidden lg:flex relative w-[67.5vw]">
          <div className="absolute bottom-[25%] left-2 top-[25%] z-10 flex h-[50%] flex-col justify-center gap-5 lg:left-[13%] lg:gap-0">
            <h1 className="max-w-[200px] text-4xl font-bold lg:text-6xl">
              Smart Warehouse and Finance
            </h1>
            <p className="mt-3 max-w-48 text-sm lg:text-lg">
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
        </div>

        {/* Form login akan tampil di semua mode, termasuk mobile */}
        <div className="relative flex h-[100vh] w-full lg:w-[32.5vw] flex-col items-center justify-between bg-white text-black">
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
          <div className="flex h-full items-end pb-5 text-center">
            <p className="text-[10px] font-bold">
              Supported by PT Gunung Elang Indah
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
