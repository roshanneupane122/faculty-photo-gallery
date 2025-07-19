import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Trash2, User, Mail, Phone, GraduationCap, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface FacultyPageProps {
  facultyMembers: FacultyMember[];
  onAddMember: (member: Omit<FacultyMember, 'id' | 'createdAt'>) => void;
  onDeleteMember: (id: string) => void;
}

export default function FacultyPage({ facultyMembers, onAddMember, onDeleteMember }: FacultyPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    qualification: '',
    experience: '',
    specializations: '',
    email: '',
    phone: '',
    department: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const departments = [
    'Computer Science',
    'Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Literature',
    'History',
    'Psychology',
    'Business Administration',
  ];

  const positions = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Senior Lecturer',
    'Department Head',
    'Dean',
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
    // Mock upload for now - replace with actual Cloudinary implementation
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          resolve({
            url: reader.result as string,
            publicId: `faculty_${Date.now()}`
          });
        }, 1000);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      let photoUrl = '';
      let cloudinaryId = '';

      if (selectedFile) {
        const uploadResult = await uploadToCloudinary(selectedFile);
        photoUrl = uploadResult.url;
        cloudinaryId = uploadResult.publicId;
      }

      const newMember = {
        ...formData,
        photoUrl,
        cloudinaryId,
      };

      onAddMember(newMember);
      
      // Reset form
      setFormData({
        name: '',
        position: '',
        qualification: '',
        experience: '',
        specializations: '',
        email: '',
        phone: '',
        department: '',
      });
      setSelectedFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({
        title: "Success!",
        description: "Faculty member added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add faculty member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the faculty list?`)) {
      onDeleteMember(id);
      toast({
        title: "Removed",
        description: "Faculty member removed successfully.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Faculty Management</h2>
        <p className="text-muted-foreground">Add and manage faculty member profiles</p>
      </div>

      {/* Add Faculty Form */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add New Faculty Member</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((position) => (
                          <SelectItem key={position} value={position}>{position}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      placeholder="e.g., 5 years"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={formData.qualification}
                    onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                    placeholder="e.g., PhD in Computer Science"
                  />
                </div>

                <div>
                  <Label htmlFor="specializations">Specializations</Label>
                  <Textarea
                    id="specializations"
                    value={formData.specializations}
                    onChange={(e) => setFormData(prev => ({ ...prev, specializations: e.target.value }))}
                    placeholder="Enter areas of specialization (separated by commas)"
                    rows={3}
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="photo">Profile Photo</Label>
                  <Input
                    id="photo"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                  />
                </div>

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
                    <User className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">Select a photo</p>
                  </div>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              variant="gradient" 
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <UserPlus className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Faculty Member
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Faculty List */}
      <div>
        <h3 className="text-2xl font-semibold text-foreground mb-6">Faculty Members ({facultyMembers.length})</h3>
        {facultyMembers.length === 0 ? (
          <Card className="bg-gradient-card shadow-medium">
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-foreground mb-2">No faculty members yet</h4>
              <p className="text-muted-foreground">Add your first faculty member to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultyMembers.map((member) => (
              <Card key={member.id} className="bg-gradient-card shadow-medium hover:shadow-large transition-all duration-200 group">
                <CardContent className="p-0">
                  <div className="relative">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t-lg">
                        <User className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => handleDelete(member.id, member.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">{member.name}</h4>
                      {member.position && (
                        <p className="text-sm text-primary font-medium">{member.position}</p>
                      )}
                    </div>

                    {member.department && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4" />
                        <span>{member.department}</span>
                      </div>
                    )}

                    {member.email && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}

                    {member.phone && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}

                    {member.qualification && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Qualification:</span> {member.qualification}
                      </p>
                    )}

                    {member.experience && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Experience:</span> {member.experience}
                      </p>
                    )}

                    {member.specializations && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Specializations:</span> {member.specializations}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                      Added {new Date(member.createdAt).toLocaleDateString()}
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