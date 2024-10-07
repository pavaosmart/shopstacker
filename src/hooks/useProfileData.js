import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { toast } from "sonner";

export const useProfileData = () => {
  const { session } = useSupabaseAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          id: session.user.id,
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
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
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

  const updateProfile = async (updatedData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          full_name: updatedData.fullName,
          phone: updatedData.phone,
          avatar_url: updatedData.avatarUrl,
          company_name: updatedData.companyName,
          position: updatedData.position,
          industry: updatedData.industry,
          bank_name: updatedData.bankName,
          account_number: updatedData.accountNumber,
          routing_number: updatedData.routingNumber,
          cep: updatedData.cep,
          street: updatedData.street,
          number: updatedData.number,
          complement: updatedData.complement,
          neighborhood: updatedData.neighborhood,
          city: updatedData.city,
          state: updatedData.state,
        });

      if (error) throw error;
      setProfileData((prev) => ({ ...prev, ...updatedData }));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return { profileData, setProfileData, isLoading, updateProfile };
};