import React, { useState, useCallback } from 'react';
import { useProfileData } from '../hooks/useProfileData';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from '../integrations/supabase/supabase';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const UserProfileEditor = () => {
  const { profileData, setProfileData, isLoading, updateProfile } = useProfileData();
  const [activeTab, setActiveTab] = useState("personal");
  const [localChanges, setLocalChanges] = useState({});
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalChanges(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    await updateProfile({ ...profileData, ...localChanges });
    setLocalChanges({});
  };

  const handleAvatarUpload = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setAvatarFile(URL.createObjectURL(file));
      setIsAvatarDialogOpen(true);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveAvatar = async () => {
    try {
      const croppedImage = await getCroppedImg(avatarFile, croppedAreaPixels);
      const file = await fetch(croppedImage).then(r => r.blob());
      const fileName = `avatar-${Date.now()}.png`;
      const filePath = `${profileData.id}/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      setProfileData(prev => ({ ...prev, avatarUrl: data.publicUrl }));
      setLocalChanges(prev => ({ ...prev, avatarUrl: data.publicUrl }));
      toast.success('Avatar updated successfully');
      setIsAvatarDialogOpen(false);
    } catch (error) {
      toast.error('Error uploading avatar: ' + error.message);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Avatar className="w-24 h-24 cursor-pointer" onClick={() => document.getElementById('avatar-upload').click()}>
          <AvatarImage src={localChanges.avatarUrl || profileData?.avatarUrl} />
          <AvatarFallback>{profileData?.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <Input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />
      <Input
        name="fullName"
        placeholder="Full Name"
        value={localChanges.fullName || profileData?.fullName || ''}
        onChange={handleInputChange}
        disabled={isLoading}
      />
      <Input
        name="email"
        placeholder="Email"
        value={profileData?.email || ''}
        disabled={true}
      />
      <Input
        name="phone"
        placeholder="Phone"
        value={localChanges.phone || profileData?.phone || ''}
        onChange={handleInputChange}
        disabled={isLoading}
      />
    </div>
  );

  const renderNotifications = () => (
    <div>
      {/* Add notification settings here */}
      <p>Notification settings coming soon...</p>
    </div>
  );

  const renderSecurity = () => (
    <div>
      {/* Add security settings here */}
      <p>Security settings coming soon...</p>
    </div>
  );

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="personal">Personal Data</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">{renderPersonalInfo()}</TabsContent>
            <TabsContent value="notifications">{renderNotifications()}</TabsContent>
            <TabsContent value="security">{renderSecurity()}</TabsContent>
          </Tabs>
          <Button onClick={handleUpdateProfile} disabled={isLoading} className="mt-4">
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop Avatar</DialogTitle>
          </DialogHeader>
          <div className="relative h-64 w-full">
            <Cropper
              image={avatarFile}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <Button onClick={handleSaveAvatar}>Save Avatar</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfileEditor;

// Função auxiliar para recortar a imagem
async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, 'image/png');
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}