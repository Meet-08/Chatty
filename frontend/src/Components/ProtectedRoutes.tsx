"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authCheck } from "@/lib/reducer/authSlice";
import LoadingSkeleton from "./skeletons/LoadingSkeleton";

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

  if (loading) return <LoadingSkeleton />;
  return <>{children}</>;
};

export default ProtectedRoutes;
