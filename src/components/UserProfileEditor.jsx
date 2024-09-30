import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const UserProfileEditor = () => {
  const { session } = useSupabaseAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile not found, create a new one
          await createProfile();
        } else {
          throw error;
        }
      } else {
        setFullName(profile.full_name || '');
        setAvatarUrl(profile.avatar_url || '');
      }
      
      setEmail(session.user.email || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const createProfile = async () => {
    try {
      const { error } = await supabase.from('profiles').insert({
        id: session.user.id,
        full_name: session.user.user_metadata.full_name || '',
        avatar_url: null,
      });

      if (error) throw error;

      await fetchUserProfile(); // Fetch the newly created profile
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const updates = {
        id: session.user.id,
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createBucketIfNotExists = async () => {
    try {
      const { data, error } = await supabase.storage.getBucket('avatars');
      if (error && error.message.includes('not found')) {
        const { data, error: createError } = await supabase.storage.createBucket('avatars', {
          public: true
        });
        if (createError) {
          throw createError;
        }
        console.log('Bucket "avatars" created successfully');
      } else if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error checking/creating bucket:', error);
      throw error;
    }
  };

  const handleAvatarUpload = async (event) => {
    try {
      setIsLoading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You need to select an image to upload.');
      }

      await createBucketIfNotExists();

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

      setAvatarUrl(data.publicUrl);
      await handleUpdateProfile(); // Update the profile with the new avatar URL
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Error uploading avatar: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={isLoading}
          />
          <Input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />
          <Input
            placeholder="Email"
            value={email}
            disabled={true}
          />
          <Button onClick={handleUpdateProfile} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileEditor;