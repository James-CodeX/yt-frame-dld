"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { History, Home, User, LogOut, Menu, X } from "lucide-react";
import ButtonSignOut from "@/app/(routes)/(auth)/components/button-signout";

export default function Navigation() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-xl font-bold text-blue-600">YT Frame Extractor</div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Extract
                </Button>
              </Link>
              
              {session && (
                <Link href="/history">
                  <Button variant="ghost" size="sm">
                    <History className="h-4 w-4 mr-2" />
                    History
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{session.user.name}</span>
                </div>
                <ButtonSignOut />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <Home className="h-4 w-4 mr-2" />
                  Extract
                </Button>
              </Link>
              
              {session && (
                <Link href="/history">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                    <History className="h-4 w-4 mr-2" />
                    History
                  </Button>
                </Link>
              )}
              
              {session ? (
                <div className="pt-2 border-t">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{session.user.name}</span>
                  </div>
                  <div className="px-3">
                    <ButtonSignOut />
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t space-y-2">
                  <Link href="/signin">
                    <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}