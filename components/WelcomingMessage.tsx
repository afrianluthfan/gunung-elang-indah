import { FC } from "react";

interface WelcomingMessageProps {
  user: String;
}

const WelcomingMessage: FC<WelcomingMessageProps> = ({ user }) => (
  <div className="flex h-[11.5vh] w-full bg-white px-10 py-7 text-black">
    <div className="h-full w-[3px] bg-black" />
    <div className="ml-1 flex h-full flex-col justify-between">
      <h1 className="text-[1.3em] font-bold">Selamat Datang</h1>
      <p>{user}</p>
    </div>
  </div>
);

export default WelcomingMessage;
