import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeShop } from "@/components/home/HomeShop";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeBlog } from "@/components/home/HomeBlog";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeContact } from "@/components/home/HomeContact";
import { HomeFeedback } from "@/components/home/HomeFeedback";
import { getBlogs, getTrendingServices } from "@/lib/catalog";

export const revalidate = 300;

export const metadata: Metadata = {
  // Uses the layout's default title ("<brand> — Premium Digital Subscriptions in Bangladesh")
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [trending, blogs] = await Promise.all([
    getTrendingServices().catch(() => undefined),
    getBlogs().catch(() => undefined),
  ]);
  return (
    <div className="flex flex-col min-h-screen">
      {/* The layout already provides <main>; a second one is invalid HTML */}
      <div className="flex-grow">
        <HomeHero />
        <HomeShop initialServices={trending} />
        <HomeServices />
        <HomeBlog initialBlogs={blogs} />
        <HomeFaq />
        <HomeFeedback />
        <HomeContact />
      </div>
    </div>
  );
}
