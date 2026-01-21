"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import GreenStripImgRight from "../../../static/images/green-strip-logo.png";
import Image from "next/image";
import { getAllPosts } from "../../lib/post";

export default function BlogFooter({ slug }) {

  const blogs =getAllPosts()


  const currentIndex = blogs.findIndex((b) => b?.slug === slug);
  const prev = currentIndex > 0 ? blogs[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < blogs.length - 1
    ? blogs[currentIndex + 1]
    : null;

  return (
    <section className="mt-8">
      <div className="flex justify-between text-xs gap-4">
        <div>
          <p className="font-semibold">PREVIOUS POST</p>
          {prev ? (
            <Link href={`/blog-details/${prev?.slug}`}>
              <p className="text-themegreen">{prev?.heading?.slice(0, 50)}...</p>
            </Link>
          ) : (
            <p className="text-gray-400">None</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-semibold">NEXT POST</p>
          {next ? (
            <Link href={`/blog-details/${next?.slug}`}>
              <p className="text-themegreen">{next?.heading?.slice(0, 50)}...</p>
            </Link>
          ) : (
            <p className="text-gray-400">None</p>
          )}
        </div>
        {/* <div className="absolute left-0 bottom-[-200px] translate-y-1/2 hidden lg:block">
          <Image src={GreenStripImgRight} width={200} height={250} alt="Green strip bottom" />
        </div> */}
      </div>
    </section>
  );
}
