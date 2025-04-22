"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authCheck } from "@/lib/reducer/authSlice";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      dispatch(authCheck());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <div>loading</div>;
  return <>{children}</>;
};

export default ProtectedRoutes;
