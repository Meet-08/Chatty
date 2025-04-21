"use client";

import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  if (!user) router.push("/login");
  return <>{children}</>;
};
export default ProtectedRoutes;
