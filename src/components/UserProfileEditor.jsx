import React, { useState } from 'react';
import { useProfileData } from '../hooks/useProfileData';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from '../integrations/supabase/supabase';

const UserProfileEditor = () => {
  const { profileData, setProfileData, isLoading, updateProfile } = useProfileData();
  const [activeTab, setActiveTab] = useState("personal");
  const [localChanges, setLocalChanges] = useState({});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalChanges(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    await updateProfile(localChanges);
    setLocalChanges({});
  };

  const handleAvatarUpload = async (event) => {
    try {
      setIsLoading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You need to select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      setProfileData(prev => ({ ...prev, avatarUrl: data.publicUrl }));
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Error uploading avatar: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCEPChange = (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    setProfileData(prev => ({ ...prev, cep }));
    if (cep.length === 8) {
      fetchAddressFromCEP(cep);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Avatar className="w-24 h-24">
          <AvatarImage src={profileData?.avatarUrl} />
          <AvatarFallback>{profileData?.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <Input
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        disabled={isLoading}
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
  );
};

export default UserProfileEditor;
