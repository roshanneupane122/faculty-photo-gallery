import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Images, Users, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'gallery' | 'faculty';
  onNavigate: (page: 'dashboard' | 'gallery' | 'faculty') => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Gallery & Faculty Management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 py-2">
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
            <Button
              variant={currentPage === 'gallery' ? 'default' : 'ghost'}
              onClick={() => onNavigate('gallery')}
              className="flex items-center space-x-2"
            >
              <Images className="w-4 h-4" />
              <span>Gallery</span>
            </Button>
            <Button
              variant={currentPage === 'faculty' ? 'default' : 'ghost'}
              onClick={() => onNavigate('faculty')}
              className="flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Faculty</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}