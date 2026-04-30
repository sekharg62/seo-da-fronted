import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeShop } from "@/components/home/HomeShop";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeBlog } from "@/components/home/HomeBlog";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeContact } from "@/components/home/HomeContact";
import { HomeFeedback } from "@/components/home/HomeFeedback";

export const metadata: Metadata = {
  title: "Home",
  description: "Digital subscription management platform - Netflix, CapCut, Grok and more.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HomeHero />
        <HomeShop />
        <HomeServices />
        <HomeBlog />
        <HomeFaq />
        <HomeFeedback />
        <HomeContact />
      </main>
    </div>
  );
}
