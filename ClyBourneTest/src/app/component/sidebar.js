"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { GoHome } from "react-icons/go";
import { MdMailOutline } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { PiSquaresFourDuotone } from "react-icons/pi";
import { IoDocumentOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import{clearToken} from "../../redux/userSlice"
import { useSelector, useDispatch } from "react-redux";
import { BsBoxArrowLeft, BsBoxArrowRight } from "react-icons/bs";
// import { handleLogout } from "../../utils/verifyUserToken";
const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[2],
    fontSize: 12,
    borderRadius: "8px",
    padding: "6px 10px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white, // ✅ arrow color matches tooltip background
  },
}));

const Sidebar = () => {
   const router = useRouter();
   const dispatch = useDispatch();
    const handleLogout = () => {
       dispatch(clearToken());
       router.push("/auth/login");
     };
   
  // const logoutUser = () => {
  //   toast.info("👋 Logging out...");
  //   handleLogout(router);
  // };
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [screenWidth, setScreenWidth] = useState(1024);

  // ✅ Collapse automatically for smaller screens
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsCollapsed(width <= 1023);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Dynamic sidebar width
  const sidebarWidth = isCollapsed
    ? screenWidth < 758
      ? "50px"
      : "65px"
    : screenWidth < 758
      ? "140px"
      : "180px";

  // ✅ Sidebar link configuration
  const links = [
    { href: "/dashboard/newOrder", label: "New Order", content: "New Order", icon: <GoHome /> },
    { href: "/dashboard/order", label: "Order", content: "Order", icon: <MdMailOutline /> },
    { href: "/dashboard/plan&billing", label: "Plans & Billing", content: "Plans & Billing", icon: <FaRegUser /> },
    { href: "/dashboard/upgradePlan", label: "Upgrade Plan", content: "Upgrade Plan", icon: <AiOutlineDollarCircle /> },
    { href: "/dashboard/myProfile", label: "My Profile", content: "My Profile", icon: <PiSquaresFourDuotone /> },
    // { href: "/dashboard/support", label: "support", content: "Support", icon: <IoDocumentOutline /> },
  ];

  return (
    <aside
      style={{ width: sidebarWidth }}
      className={`bg-themeblue flex flex-col justify-between text-white pt-8 rounded-tr-lg rounded-br-lg relative transition-all duration-300 ${isCollapsed ? "px-2 items-center" : "px-4"
        }`}
    >
      {/* ----------- Navigation Links ----------- */}
      <nav className="flex flex-col gap-3 w-full">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const linkClasses = `
            flex items-center ${isCollapsed ? "justify-center" : "justify-start"} 
            gap-3 text-xs px-3 py-2 rounded-md transition-all duration-200
            ${isActive ? "bg-themegreen text-white font-semibold" : "hover:bg-[#1b3a5e] text-gray-200"}
          `;
          const iconColor = isActive ? "text-white" : "text-themegreen";

          return (
            <Link key={link.href} href={link.href} className={linkClasses}>
              {isCollapsed ? (
                <LightTooltip
                  title={link.content}
                  arrow
                  placement="right"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "zIndex",
                          enabled: true,
                          phase: "write",
                          fn: (data) => {
                            data.state.styles.popper.zIndex = 99999; // ✅ Always on top
                          },
                        },
                      ],
                    },
                  }}
                >
                  <span className={`text-[20px] ${iconColor}`}>{link.icon}</span>
                </LightTooltip>
              ) : (
                <>
                  <span className={`text-[20px] ${iconColor}`}>{link.icon}</span>
                  {link.label}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ----------- Logout Button ----------- */}
      {isCollapsed ? (
        <LightTooltip
          title="Logout"
          arrow
          placement="right"
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "zIndex",
                  enabled: true,
                  phase: "write",
                  fn: (data) => {
                    data.state.styles.popper.zIndex = 99999;
                  },
                },
              ],
            },
          }}
        >
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center text-xs px-3  py-2 rounded-md mt-20 mb-10 md:mb-16 transition-all duration-200 ${pathname === "/logout"
              ? "bg-themegreen text-white font-semibold"
              : "hover:bg-[#1b3a5e] text-gray-200"
              }`}
          >
            <BsBoxArrowLeft className="text-[20px] text-themegreen" />
          </button>
        </LightTooltip>
      ) : (
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 text-xs px-3 py-2 rounded-md mt-20 mb-10 md:mb-16 transition-all duration-200 ${pathname === "/logout"
            ? "bg-themegreen text-white font-semibold"
            : "hover:bg-[#1b3a5e] text-gray-200"
            }`}
        >
          <BsBoxArrowLeft className="text-[20px] text-themegreen" />
          Logout
        </button>
      )}

      {/* ----------- Collapse Toggle Button ----------- */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute hidden lg:block bottom-0 right-0 p-2 text-white"
      >
        {isCollapsed ? (
          <BsBoxArrowRight className="text-[20px]" />
        ) : (
          <BsBoxArrowLeft className="text-[20px]" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
