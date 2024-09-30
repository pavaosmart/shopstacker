import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const UserProfileEditor = () => {
  const { session } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatarUrl: '',
  });
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    position: '',
    industry: '',
  });
  const [bankInfo, setBankInfo] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: '',
  });
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
        .maybeSingle();

      if (error) throw error;

      if (profile) {
        setPersonalInfo({
          fullName: profile.full_name || '',
          email: session.user.email || '',
          phone: profile.phone || '',
          avatarUrl: profile.avatar_url || '',
        });
        setCompanyInfo({
          companyName: profile.company_name || '',
          position: profile.position || '',
          industry: profile.industry || '',
        });
        setBankInfo({
          bankName: profile.bank_name || '',
          accountNumber: profile.account_number || '',
          routingNumber: profile.routing_number || '',
        });
      } else {
        // If no profile exists, we'll create one with default values
        const defaultProfile = {
          id: session.user.id,
          full_name: '',
          phone: '',
          avatar_url: '',
          company_name: '',
          position: '',
          industry: '',
          bank_name: '',
          account_number: '',
          routing_number: '',
        };
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfile);
        
        if (insertError) throw insertError;
        
        // Set state with default values
        setPersonalInfo({
          fullName: '',
          email: session.user.email || '',
          phone: '',
          avatarUrl: '',
        });
        setCompanyInfo({
          companyName: '',
          position: '',
          industry: '',
        });
        setBankInfo({
          bankName: '',
          accountNumber: '',
          routingNumber: '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const updates = {
        id: session.user.id,
        full_name: personalInfo.fullName,
        phone: personalInfo.phone,
        avatar_url: personalInfo.avatarUrl,
        company_name: companyInfo.companyName,
        position: companyInfo.position,
        industry: companyInfo.industry,
        bank_name: bankInfo.bankName,
        account_number: bankInfo.accountNumber,
        routing_number: bankInfo.routingNumber,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
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

      setPersonalInfo(prev => ({ ...prev, avatarUrl: data.publicUrl }));
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Error uploading avatar: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="bank">Bank</TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <div className="space-y-4">
              <div className="flex justify-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={personalInfo.avatarUrl} />
                  <AvatarFallback>{personalInfo.fullName.charAt(0)}</AvatarFallback>
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
                value={personalInfo.fullName}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                disabled={isLoading}
              />
              <Input
                placeholder="Email"
                value={personalInfo.email}
                disabled={true}
              />
              <Input
                placeholder="Phone"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                disabled={isLoading}
              />
            </div>
          </TabsContent>
          <TabsContent value="company">
            <div className="space-y-4">
              <Input
                placeholder="Company Name"
                value={companyInfo.companyName}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, companyName: e.target.value }))}
                disabled={isLoading}
              />
              <Input
                placeholder="Position"
                value={companyInfo.position}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, position: e.target.value }))}
                disabled={isLoading}
              />
              <Input
                placeholder="Industry"
                value={companyInfo.industry}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, industry: e.target.value }))}
                disabled={isLoading}
              />
            </div>
          </TabsContent>
          <TabsContent value="bank">
            <div className="space-y-4">
              <Input
                placeholder="Bank Name"
                value={bankInfo.bankName}
                onChange={(e) => setBankInfo(prev => ({ ...prev, bankName: e.target.value }))}
                disabled={isLoading}
              />
              <Input
                placeholder="Account Number"
                value={bankInfo.accountNumber}
                onChange={(e) => setBankInfo(prev => ({ ...prev, accountNumber: e.target.value }))}
                disabled={isLoading}
              />
              <Input
                placeholder="Routing Number"
                value={bankInfo.routingNumber}
                onChange={(e) => setBankInfo(prev => ({ ...prev, routingNumber: e.target.value }))}
                disabled={isLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
        <Button onClick={handleUpdateProfile} disabled={isLoading} className="mt-4">
          {isLoading ? 'Updating...' : 'Update Profile'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfileEditor;