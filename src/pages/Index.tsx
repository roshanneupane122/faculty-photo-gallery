import { useState } from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import GalleryPage from '@/components/GalleryPage';
import FacultyPage from '@/components/FacultyPage';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface GalleryItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cloudinaryId: string;
  createdAt: string;
}

interface FacultyMember {
  id: string;
  name: string;
  position: string;
  qualification: string;
  experience: string;
  specializations: string;
  email: string;
  phone: string;
  department: string;
  photoUrl: string;
  cloudinaryId: string;
  createdAt: string;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'gallery' | 'faculty'>('dashboard');
  const [galleryItems, setGalleryItems] = useLocalStorage<GalleryItem[]>('gallery-items', []);
  const [facultyMembers, setFacultyMembers] = useLocalStorage<FacultyMember[]>('faculty-members', []);

  const handleAddGalleryItem = (item: Omit<GalleryItem, 'id' | 'createdAt'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setGalleryItems(prev => [newItem, ...prev]);
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddFacultyMember = (member: Omit<FacultyMember, 'id' | 'createdAt'>) => {
    const newMember: FacultyMember = {
      ...member,
      id: `faculty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setFacultyMembers(prev => [newMember, ...prev]);
  };

  const handleDeleteFacultyMember = (id: string) => {
    setFacultyMembers(prev => prev.filter(member => member.id !== id));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'gallery':
        return (
          <GalleryPage
            galleryItems={galleryItems}
            onAddItem={handleAddGalleryItem}
            onDeleteItem={handleDeleteGalleryItem}
          />
        );
      case 'faculty':
        return (
          <FacultyPage
            facultyMembers={facultyMembers}
            onAddMember={handleAddFacultyMember}
            onDeleteMember={handleDeleteFacultyMember}
          />
        );
      default:
        return (
          <Dashboard
            galleryCount={galleryItems.length}
            facultyCount={facultyMembers.length}
            onNavigate={setCurrentPage}
          />
        );
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
};

export default Index;
