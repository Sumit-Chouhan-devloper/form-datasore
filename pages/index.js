import { Inter } from "next/font/google";
import Test from "@/components/Test";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Test />
    </>
  );
}
