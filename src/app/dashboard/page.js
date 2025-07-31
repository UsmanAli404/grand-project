'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">NextHire</h2>
        <nav className="flex flex-col gap-3">
          <Button variant="ghost" className="justify-start">Overview</Button>
          <Button variant="ghost" className="justify-start">Applications</Button>
          <Button variant="ghost" className="justify-start">Profile</Button>
          <Button variant="ghost" className="justify-start">Settings</Button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Button variant="outline">Logout</Button>
        </header>
        
        <Separator className="mb-6" />

        {/* Example content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Applications</p>
              <p className="text-xl font-bold">134</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Pending Reviews</p>
              <p className="text-xl font-bold">8</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">New Messages</p>
              <p className="text-xl font-bold">23</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}