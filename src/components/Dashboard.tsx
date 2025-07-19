import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Images, Users, Plus, Image } from 'lucide-react';

interface DashboardProps {
  galleryCount: number;
  facultyCount: number;
  onNavigate: (page: 'gallery' | 'faculty') => void;
}

export default function Dashboard({ galleryCount, facultyCount, onNavigate }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground">Welcome to Your Dashboard</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your gallery and faculty information with ease. Upload photos, add faculty members, and keep everything organized.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
            <Images className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{galleryCount}</div>
            <p className="text-xs text-muted-foreground">Photos uploaded</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{facultyCount}</div>
            <p className="text-xs text-muted-foreground">Faculty registered</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-200 cursor-pointer group"
                onClick={() => onNavigate('gallery')}>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Image className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">Manage Gallery</h4>
                <p className="text-muted-foreground">Upload new photos and manage existing ones</p>
              </div>
              <Button variant="gradient" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Go to Gallery
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-200 cursor-pointer group"
                onClick={() => onNavigate('faculty')}>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">Manage Faculty</h4>
                <p className="text-muted-foreground">Add new faculty members and view profiles</p>
              </div>
              <Button variant="gradient" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Go to Faculty
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}