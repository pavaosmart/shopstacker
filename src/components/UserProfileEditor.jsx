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
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatarUrl: '',
    companyName: '',
    position: '',
    industry: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

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
          await createNewProfile();
          return;
        }
        throw error;
      }

      if (profile) {
        setProfileData({
          fullName: profile.full_name || '',
          email: session.user.email || '',
          phone: profile.phone || '',
          avatarUrl: profile.avatar_url || '',
          companyName: profile.company_name || '',
          position: profile.position || '',
          industry: profile.industry || '',
          bankName: profile.bank_name || '',
          accountNumber: profile.account_number || '',
          routingNumber: profile.routing_number || '',
          cep: profile.cep || '',
          street: profile.street || '',
          number: profile.number || '',
          complement: profile.complement || '',
          neighborhood: profile.neighborhood || '',
          city: profile.city || '',
          state: profile.state || '',
        });
        setPreviewUrl(profile.avatar_url || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const createNewProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({ id: session.user.id, full_name: session.user.email.split('@')[0] });

      if (error) throw error;

      toast.success('New profile created');
      fetchUserProfile();
    } catch (error) {
      console.error('Error creating new profile:', error);
      toast.error('Failed to create new profile');
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const updates = {
        id: session.user.id,
        full_name: profileData.fullName,
        phone: profileData.phone,
        avatar_url: profileData.avatarUrl,
        company_name: profileData.companyName,
        position: profileData.position,
        industry: profileData.industry,
        bank_name: profileData.bankName,
        account_number: profileData.accountNumber,
        routing_number: profileData.routingNumber,
        cep: profileData.cep,
        street: profileData.street,
        number: profileData.number,
        complement: profileData.complement,
        neighborhood: profileData.neighborhood,
        city: profileData.city,
        state: profileData.state,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (event) => {
    try {
      setIsLoading(true);
      const file = event.target.files[0];
      if (!file) {
        throw new Error('You need to select an image to upload.');
      }

      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

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

  const fetchAddressFromCEP = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setProfileData(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
        }));
      } else {
        toast.error('CEP não encontrado');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      toast.error('Erro ao buscar endereço');
    }
  };

  const handleCEPChange = (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    setProfileData(prev => ({ ...prev, cep }));
    if (cep.length === 8) {
      fetchAddressFromCEP(cep);
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
            <TabsTrigger value="address">Address</TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={previewUrl || profileData.avatarUrl} />
                  <AvatarFallback>{profileData.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Upload New Avatar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isLoading}
                    className="hidden"
                  />
                </label>
              </div>
              <Input
                name="fullName"
                placeholder="Full Name"
                value={profileData.fullName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Input
                name="email"
                placeholder="Email"
                value={profileData.email}
                disabled={true}
              />
              <Input
                name="phone"
                placeholder="Phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </TabsContent>
          <TabsContent value="company">
            <div className="space-y-4">
              <Input
                name="companyName"
                placeholder="Company Name"
                value={profileData.companyName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Input
                name="position"
                placeholder="Position"
                value={profileData.position}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Input
                name="industry"
                placeholder="Industry"
                value={profileData.industry}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </TabsContent>
          <TabsContent value="bank">
            <div className="space-y-4">
              <Input
                name="bankName"
                placeholder="Bank Name"
                value={profileData.bankName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Input
                name="accountNumber"
                placeholder="Account Number"
                value={profileData.accountNumber}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Input
                name="routingNumber"
                placeholder="Routing Number"
                value={profileData.routingNumber}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </TabsContent>
          <TabsContent value="address">
            <div className="space-y-4">
              <Input
                name="cep"
                placeholder="CEP"
                value={profileData.cep}
                onChange={handleCEPChange}
                disabled={isLoading}
              />
              <Input
                name="street"
                placeholder="Street"
                value={profileData.street}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Input
                name="number"
                placeholder="Number"
                value={profileData.number}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Input
                name="complement"
                placeholder="Complement"
                value={profileData.complement}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Input
                name="neighborhood"
                placeholder="Neighborhood"
                value={profileData.neighborhood}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Input
                name="city"
                placeholder="City"
                value={profileData.city}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <Input
                name="state"
                placeholder="State"
                value={profileData.state}
                onChange={handleInputChange}
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