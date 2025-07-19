import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Trash2, Image as ImageIcon, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GalleryItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cloudinaryId: string;
  createdAt: string;
}

interface GalleryPageProps {
  galleryItems: GalleryItem[];
  onAddItem: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => void;
  onDeleteItem: (id: string) => void;
}

export default function GalleryPage({ galleryItems, onAddItem, onDeleteItem }: GalleryPageProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
    // For now, we'll create a mock upload since Cloudinary needs configuration
    // Replace this with actual Cloudinary upload preset when configured
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          resolve({
            url: reader.result as string,
            publicId: `mock_${Date.now()}`
          });
        }, 1000);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !formData.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and select an image.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const { url, publicId } = await uploadToCloudinary(selectedFile);
      
      const newItem = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        imageUrl: url,
        cloudinaryId: publicId,
      };

      onAddItem(newItem);
      
      // Reset form
      setFormData({ name: '', description: '' });
      setSelectedFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({
        title: "Success!",
        description: "Image uploaded to gallery successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDeleteItem(id);
      toast({
        title: "Deleted",
        description: "Gallery item removed successfully.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Gallery Management</h2>
        <p className="text-muted-foreground">Upload and manage your photo gallery</p>
      </div>

      {/* Upload Form */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add New Image</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Image Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter image name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter image description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Select Image</Label>
                  <Input
                    id="image"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                {previewUrl ? (
                  <div className="border border-border rounded-lg p-4 bg-card">
                    <Label>Preview</Label>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg mt-2"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/30">
                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Select an image to see preview</p>
                  </div>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              variant="gradient" 
              disabled={isUploading}
              className="w-full"
              size="lg"
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      <div>
        <h3 className="text-2xl font-semibold text-foreground mb-6">Gallery ({galleryItems.length})</h3>
        {galleryItems.length === 0 ? (
          <Card className="bg-gradient-card shadow-medium">
            <CardContent className="p-12 text-center">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-foreground mb-2">No images yet</h4>
              <p className="text-muted-foreground">Upload your first image to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <Card key={item.id} className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-200 group">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => handleDelete(item.id, item.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground mb-2">{item.name}</h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}