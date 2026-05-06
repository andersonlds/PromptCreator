import ThreeBackground from "@/components/common/ThreeBackground";
import PromptGenerator from "@/components/common/PromptGenerator";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <ThreeBackground />
      <PromptGenerator />
    </main>
  );
}
