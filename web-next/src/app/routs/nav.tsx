"use client"; // Add this line to mark the file as a Client Component
import React, { useState } from "react";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/app/components/ui/navbar-menu";
import { cn } from "@/utils/cn";
import logoo from "@/app/assets/logo.svg";

export function Navbarr() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 mx-20 my-4 z-50 bg-black",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <a href="/">
            {" "}
            <img src={logoo.src} alt="Logo" className="h-16 w-auto" />
          </a>
        </div>
        <hr className="top-10 left-24 w-2/4 border-b border-gray-500" />
        {/* Navigation items on the right */}
        <Menu setActive={setActive}>
          <div className="p-2">
            <MenuItem setActive={setActive} active={active} item="About">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/">Web Development</HoveredLink>
                <HoveredLink href="/">Interface Design</HoveredLink>
                <HoveredLink href="/">Search Engine Optimization</HoveredLink>
                <HoveredLink href="/">Branding</HoveredLink>
              </div>
            </MenuItem>
          </div>
          <div className="p-2">
            <MenuItem setActive={setActive} active={active} item="Products">
              <div className="mr-96">
                <div className="text-sm grid grid-cols-2 gap-10 p-4">
                  <ProductItem
                    title="Algochurn"
                    href=""
                    src=""
                    description="Prepare for tech interviews like never before."
                  />
                  <ProductItem
                    title="Algochurn"
                    href=""
                    src=""
                    description="Prepare for tech interviews like never before."
                  />
                  <ProductItem
                    title="Algochurn"
                    href=""
                    src=""
                    description="Prepare for tech interviews like never before."
                  />
                  <ProductItem
                    title="Algochurn"
                    href=""
                    src=""
                    description="Prepare for tech interviews like never before."
                  />
                  {/* Add more ProductItems here */}
                </div>
              </div>
            </MenuItem>
          </div>
          <div className="p-2">
            <MenuItem setActive={setActive} active={active} item="Pricing">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/hobby">Hobby</HoveredLink>
                <HoveredLink href="/individual">Individual</HoveredLink>
                <HoveredLink href="/team">Team</HoveredLink>
                <HoveredLink href="/enterprise">Enterprise</HoveredLink>
              </div>
            </MenuItem>
          </div>
        </Menu>
      </div>
    </div>
  );
}

export default Navbar;
