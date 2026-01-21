import React from 'react'
import Blog from '../component/vlog-page/Blog'
import Artical from '../component/vlog-page/Artical'
import Sidebar from '../component/vlog-page/Sidebar'
import { SectionWrapper } from "../component/generalComponent/SectionWrapper";
import BlogFooter from '../component/vlog-page/BlogFooter'
const vlogpage = () => {
    return (
        <div>
            <Blog />
            <SectionWrapper customClass='bg-[#1e1e1e]'>
                <div className="flex flex-col md:flex-row xl:gap-7 lg:gap-4 gap-2">
                    <Artical />
                    <Sidebar />
                </div>
                <BlogFooter/>
            </SectionWrapper>
        </div>
    )
}

export default vlogpage