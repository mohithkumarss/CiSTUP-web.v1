// import Nav from "@/app/components/nav";
import { Navbarr } from "@/app/routs/nav";
import { GoogleGeminiEffectt } from "@/app/routs/gemini";
import { Sparkles } from "@/app/routs/sparkles";
import { EvervaultCard } from "@/app/routs/EvervaultCard";

export default function Home() {
  return (
    <main>
      {/* <Navbarr /> */}
      <Sparkles />
      <GoogleGeminiEffectt />
      <EvervaultCard />
    </main>
  );
}
