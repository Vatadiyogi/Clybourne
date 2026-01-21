"use client";

import { motion } from "framer-motion";

export default function Animatedline() {
    return (
        <div className="px-6 sm:px-8  md:px-12 lg:px-16  xl:px-28  2xl:px-32">
            <motion.hr
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="border-t-2 border-gray-200"
            />
        </div>
    );
};