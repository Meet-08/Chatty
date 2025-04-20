"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSelectedUser } from "@/lib/reducer/userChatSlice";
import { X } from "lucide-react";
import Image from "next/image";

const ChatHeader = () => {
  const { selectedUser } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <Image
                src={selectedUser?.profilePic || "/avatar.png"}
                alt={selectedUser?.fullName || ""}
                width={48}
                height={48}
                className="size-10 rounded-full object-cover"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
          </div>
        </div>

        <button
          onClick={() => dispatch(setSelectedUser(null))}
          className="cursor-pointer"
        >
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
