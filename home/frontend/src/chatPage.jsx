import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  PanelLeft,
  BarChart3,
  Database,
  UserRound,
} from "lucide-react";

export default function ChatPage() {
  const [activeHeaderButton, setActiveHeaderButton] = useState("Myself");
  const [sidebarActive, setSidebarActive] = useState(false);

  const headerButtons = ["Myself", "More Information", "Contact"];

  return (
    <div className="chat-page-shell">
      {/* Top Header */}
      <motion.header
        className="chat-top-header"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="header-left">
          <motion.div
            className="header-brand-icon"
            whileHover={{ scale: 1.08, rotate: 4 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 360, damping: 18 }}
          >
            <Sparkles size={13} />
          </motion.div>

          <span className="header-brand-text">Bhavik&apos;s Profile</span>
        </div>

        <nav className="header-center">
          {headerButtons.map((item) => (
            <motion.div
              key={item}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveHeaderButton(item)}
                className={`top-nav-btn ${
                  activeHeaderButton === item ? "top-nav-btn-active" : ""
                }`}
              >
                {item}
              </Button>
            </motion.div>
          ))}
        </nav>

        <div className="header-right">
          <Badge variant="secondary" className="ai-badge">
            AI Tool
          </Badge>

          <Button variant="ghost" size="icon" className="header-user-btn">
            <UserRound size={14} />
          </Button>
        </div>
      </motion.header>

      {/* Body Area */}
      <section className="chat-body-area">
        {/* Left Sidebar */}
        <motion.aside
          className="left-mini-sidebar"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.45, ease: "easeOut" }}
        >
          <motion.div
            className="sidebar-inner"
            animate={{
              boxShadow: sidebarActive
                ? "0 0 30px rgba(56, 189, 248, 0.28)"
                : "10px 0 35px rgba(15, 23, 42, 0.08)",
            }}
            transition={{ duration: 0.25 }}
          >
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className={`sidebar-icon-btn ${
                  sidebarActive ? "sidebar-icon-btn-active" : ""
                }`}
                onClick={() => setSidebarActive(!sidebarActive)}
              >
                <PanelLeft size={15} />
              </Button>
            </motion.div>

            <Separator className="sidebar-separator" />

            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="sidebar-icon-btn">
                <BarChart3 size={14} />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="sidebar-icon-btn">
                <Database size={14} />
              </Button>
            </motion.div>
          </motion.div>
        </motion.aside>

        {/* Main Workspace */}
        <motion.main
          className="chat-main-workspace"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.45, ease: "easeOut" }}
        >
          <div className="workspace-placeholder">
            <span>Chat workspace will be added here next.</span>
          </div>
        </motion.main>
      </section>
    </div>
  );
}