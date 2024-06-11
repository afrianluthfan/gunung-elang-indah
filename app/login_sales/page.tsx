import Image from "next/image";
import { Button, Input } from "@nextui-org/react";
import { Providers } from "../providers";

const LoginPage = () => (
  <section>
    <div className="relative flex">
      <div className="absolute bottom-[25%] left-[13%] top-[25%] z-10 flex h-[50%] flex-col justify-center">
        <h1 className="max-w-[200px] text-6xl font-bold">
          Smart Warehouse and Finance
        </h1>
        <p>Create Ease for Your Business with ERP Technology</p>
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
      <div className="relative flex h-[100vh] w-[32.5vw] flex-col items-center justify-center bg-white text-black">
        <div className="flex w-[50%] flex-col">
          <div>
            <h1 className="text-3xl font-bold">Hello Again!</h1>
            <p>Welcome Back</p>
          </div>
          <div className="mt-10 flex flex-col gap-5">
            <Input type="text" placeholder="Username" />
            <Input type="password" placeholder="Password" />
            <Button className="bg-[#00186D] font-bold text-white">Login</Button>
          </div>
        </div>
        <div className="absolute bottom-3">
          <p className="text-xs font-bold">
            Supported by PT Gunung Elang Indah
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default LoginPage;
