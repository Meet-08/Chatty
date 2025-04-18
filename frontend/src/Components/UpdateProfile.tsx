"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateProfile } from "@/lib/reducer/authSlice";
import { Camera, Mail, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const UpdateProfile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | ArrayBuffer | null>();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files ? e.target.files[0] : null;
    if (!file) return;
    setIsUpdatingProfile(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
    };

    const formData = new FormData();
    formData.append("profilePic", file);
    await dispatch(updateProfile(formData));
    setIsUpdatingProfile(false);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Image
            src={
              typeof selectedImg === "string"
                ? selectedImg
                : user?.profilePic || "/avatar.png"
            }
            alt="Profile"
            width={128}
            height={128}
            className="size-32 rounded-full object-cover border-4 "
          />
          <label
            htmlFor="avatar-upload"
            className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
          >
            <Camera className="size-5 text-base-200" />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUpdatingProfile}
            />
          </label>
        </div>
        <p className="text-sm text-zinc-400">
          {isUpdatingProfile
            ? "Uploading..."
            : "Click the camera icon to update your photo"}
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-1.5">
          <div className="text-sm text-zinc-400 flex items-center gap-2">
            <User className="size-4" />
            Full Name
          </div>
          <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
            {user?.fullName}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="text-sm text-zinc-400 flex items-center gap-2">
            <Mail className="size-4" />
            Email Address
          </div>
          <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
            {user?.email}
          </p>
        </div>
      </div>

      <div className="mt-6 bg-base-300 rounded-xl p-6">
        <h2 className="text-lg font-medium  mb-4">Account Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-zinc-700">
            <span>Member Since</span>
            <span>{user?.createdAt?.split("T")[0]}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Account Status</span>
            <span className="text-green-500">Active</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default UpdateProfile;
