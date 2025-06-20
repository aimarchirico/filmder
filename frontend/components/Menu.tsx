import { MenuDropdownProps } from "@/types/Menu";
import { createClient } from "@/utils/supabase/client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InstallPWAButton from "./InstallPWAButton";

const MenuDropdown = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside of menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="absolute top-4 right-4 z-50" ref={menuRef}>
      <div className="flex items-center gap-2">
        <InstallPWAButton />
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-purple-700 rounded-lg transition"
        >
          <Menu className="w-12 h-12 text-white" />
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 ring-1 ring-secondary z-50">
          <div className="py-1">
            <Link
              href="/home"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/movies"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
            >
              My Movies
            </Link>
            <Link
              href="/friends"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
            >
              Friends
            </Link>
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;
