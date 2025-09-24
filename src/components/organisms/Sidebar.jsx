import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ className }) => {
const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "FileText" },
    { name: "Grades", href: "/grades", icon: "BarChart3" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Calendar", href: "/calendar", icon: "Calendar" }
  ];

  return (
    <div className={cn("bg-white border-r border-slate-200 w-64 flex-shrink-0 overflow-y-auto", className)}>
      <div className="flex flex-col h-full">
        <div className="px-6 py-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg">
              <ApperIcon name="GraduationCap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Scholar Hub</h1>
              <p className="text-sm text-slate-500">Academic Progress</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon
                    name={item.icon}
                    size={20}
                    className={cn(
                      "mr-3 transition-colors duration-200",
                      isActive ? "text-primary-600" : "text-slate-500 group-hover:text-slate-700"
                    )}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name="Target" size={16} />
              <span className="text-sm font-medium">Study Goal</span>
            </div>
            <p className="text-xs opacity-90">Stay focused on your academic goals!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;