import { MenuDropdownProps } from "@/types/Menu";
import { createClient } from "@/utils/supabase/client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const MenuDropdown =  () => {  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

    // Handle clicking outside of menu
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsMenuOpen(false);
        }
      }
      
      // Add event listener when menu is open
      if (isMenuOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      
      // Cleanup event listener
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
    <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-purple-700 rounded-lg transition"
        >
          <Menu className="w-12 h-12 text-white" />
        </button>
        {isMenuOpen && (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 ring-1 ring-secondary">
      <div className="py-1">
      <Link
          href="/home"
          className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/profile"
          className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
        >
          Profile
        </Link>
        <Link
          href="/settings"
          className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
        >
          Settings
        </Link>
        <Link
          href="/friends"
          className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
        >
          Friends
        </Link>
        <button
          onClick={handleSignOut}
          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
    
)}
</div>
  );
};

export default MenuDropdown;