"use client";

import { useAppSelector } from "@/lib/hooks";
import Sidebar from "./Sidebar";
import NoChatSelected from "./NoChatSelected";
import ChatContainer from "./ChatContainer";

const MainSection = () => {
  const { selectedUser } = useAppSelector((state) => state.chat);

  return (
    <div className="flex h-full rounded-lg overflow-hidden">
      <Sidebar />
      {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
    </div>
  );
};
export default MainSection;
