"use client";
import { useLocation } from "react-router-dom";
import { LogOut, Blocks } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const MainMenuOptions = [
    {
      icon: <Blocks className="w-6 h-6" />,
      label: "Courses",
      url: "/admin/courses",
      active: pathname.includes("/admin/course"),
    },
  ];

  return (
    <aside
      className={cn(
        `lg:w-64 lg:h-full w-full lg:bg-white text-black lg:flex lg:flex-col p-4 transition-all duration-300`
      )}
    >
      <div className="flex items-center justify-between gap-4 mt-2 mb-8">
        <div className="flex items-center gap-3">
          <a href={`/product-list`}>
            <h2 className="cursor-pointer text-2xl font-medium tracking-wider ">
              EduLite
            </h2>
          </a>
        </div>
      </div>
      <div
        className="flex-1 flex flex-col justify-between lg:overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="space-y-3">
          <nav className="flex flex-col gap-3">
            {MainMenuOptions.map((item) => (
              <a
                key={item.label}
                href={item.url}
                className={`flex items-center outline-none justify-between py-[10px] px-4 rounded-2xl transition cursor-pointer ${
                  item.active
                    ? "text-white bg-indigo-500"
                    : "cursor-pointer text-gray-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div>{item.icon}</div>
                  <span className="font-medium leading-none tracking-wide">
                    {item.label}
                  </span>
                </div>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="border-t border-gray-600" />
        <a
          href="/logout"
          className="flex items-center justify-between gap-2 text-gray-500 py-2 px-3 rounded-lg transition cursor-pointer"
        >
          <span className="font-medium">Log out</span>
          <LogOut />
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar;
