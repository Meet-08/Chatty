import MainSection from "@/Components/MainSection";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Home = async () => {
  const token = (await cookies()).get("auth_token");
  console.log(token);
  if (!token) {
    redirect("/");
  }

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-current w-full max-w-6xl h-[calc(100vh-8rem)]">
          <MainSection />
        </div>
      </div>
    </div>
  );
};
export default Home;
