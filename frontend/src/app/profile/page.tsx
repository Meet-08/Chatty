import UpdateProfile from "@/Components/UpdateProfile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Profile = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information </p>
          </div>

          <UpdateProfile />
        </div>
      </div>
    </div>
  );
};
export default Profile;
