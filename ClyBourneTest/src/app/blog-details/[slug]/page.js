// pages/blog/[slug].js
import Image from "next/image";
import { SectionWrapper } from "../../component/generalComponent/SectionWrapper";
import { getAllPosts, getPostBySlug, postDetails } from "../../lib/post";
import GreenStripImg from "../../../static/images/green-strip-logo.png";
import BlogFooter from "../../component/vlog-page/BlogFooter";
import Sidebar from "../../component/vlog-page/Sidebar";
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import GeneralButton from "../../component/GeneralButton";
import Link from "next/link";
import ContactForm from "../../component/home-page/ContactForm";
import Animatedline from "../../component/Global-file/Animetedline";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogDetail({ params }) {
  const post = getPostBySlug(params.slug);
  const detail = postDetails.find(p => p.slug === params.slug);
  const content = detail?.content || "<p>No content found.</p>";

  return (
    <div className="relative w-full">
      <SectionWrapper customClass="bg-themeblue !pb-48 ">
        <div className="text-center max-w-4xl mx-auto lg:pt-10 md:pt-5">
          <h2 className="text-themegreen text-3xl md:text-4xl lg:text-6xl mb-4">
            Blog<br /><span className="text-[#F9F9F9]">{post?.heading}</span>
          </h2>
          <p className="text-xs md:text-sm lg:text-xl text-white">
            Author - {post?.author}
          </p>
        </div>
      </SectionWrapper>
      {/* Cards Overlapping Both Sections */}
      <div className="text-themeblack relative z-10 -mt-36 px-8 sm:px-12 md:px-16 lg:px-24 xl:px-28 2xl:px-36 bg-transparent">
        <div className="absolute right-0 top-[-40px] -translate-y-1/2 hidden lg:block" >
          <Image src={GreenStripImg} width={"200"} height={250} alt='log-strip' />
        </div>
        <Image
          src={`/${(post?.bannerImage)}`}
          width={1600}
          height={300}
          alt="blog-banner"
        />

        <div className="flex flex-col gap-8 md:flex-row">
          <div className='md:w-[70%]  pt-5'>
            <div className="blog-details">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
            {/* //keywords */}
            <div className="flex flex-wrap gap-2 mt-8">
              {post?.keywords?.split(',').map((tag, idx) => (
                <span key={idx} className="bg-gray-300 text-black text-xs px-3 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
            {/* Author Row */}
            <div className="flex  md:flex-row justify-between items-center border-t border-b border-gray-600 py-8 gap-4 mt-12">
              {/* <p className="font-medium">{post?.author}</p> */}
              <div className="flex gap-4">
                <a href="" className="">
                  <FaXTwitter size={26} />
                </a>
                <a href="" className="">
                  <FaLinkedinIn size={26} />
                </a>
              </div>
              <p className="text-gray-400 text-sm">{post?.publishDate}</p>
            </div>
            <BlogFooter slug={post?.slug} />
          </div>
          <div className='md:w-[30%]'>
            <Sidebar />
          </div>

        </div>
        <section className="bg-white pt-16 md:pt-20 lg:pt-24 px-5 md:px-20 relative flex justify-center pb-12">
        <Link href={"/blogs"}>
          <GeneralButton
            content="See All Blogs"
            className="bg-themegreen text-white"
          />
        </Link>
      </section>
      </div>
      <div>
        <Animatedline />
      </div>
      <ContactForm />
    </div>
  );
}