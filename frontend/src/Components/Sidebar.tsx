"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getUser, setSelectedUser } from "@/lib/reducer/userChatSlice";
import { useEffect } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeletons";
import { User } from "lucide-react";
import Image from "next/image";

const Sidebar = () => {
  const { users, selectedUser, isUserLoading } = useAppSelector(
    (state) => state.chat
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      if (users.length === 0) {
        await dispatch(getUser());
      }
    };
    fetchUsers();
  }, [dispatch, users]);

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <User className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => dispatch(setSelectedUser(user))}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : "cursor-pointer"
            }`}
            disabled={selectedUser?._id === user?._id}
          >
            <div className="relative mx-auto lg:mx-0">
              <Image
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 rounded-full object-cover"
                width={48}
                height={48}
              />
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};
export default Sidebar;
