"use client";

import { useEffect } from "react";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { authCheck, logout } from "@/lib/reducer/authSlice";
import { redirect } from "next/navigation";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) return;
      await dispatch(authCheck());
    };
    fetchUser();
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    redirect("/login");
  };

  return (
    <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Chatty</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/setting"
              className="btn btn-sm gap-2 transition-colors"
            >
              <Settings className="size-5" />
              <span className="hidden sm:inline text-lg">Settings</span>
            </Link>

            {user && (
              <>
                <Link href="/profile" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline text-lg">Profile</span>
                </Link>

                <button
                  className="flex gap-2 items-center hover:cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline text-lg">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
