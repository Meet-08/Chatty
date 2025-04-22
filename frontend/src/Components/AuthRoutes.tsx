"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { authCheck } from "@/lib/reducer/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSkeleton from "./skeletons/LoadingSkeleton";

const AuthRoutes = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      dispatch(authCheck());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading) return <LoadingSkeleton />;
  return <>{children}</>;
};
export default AuthRoutes;
