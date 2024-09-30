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
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.user_metadata?.full_name || '');
      setAvatarUrl(session.user.user_metadata?.avatar_url || '');
    }
  }, [session]);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName, avatar_url: avatarUrl }
      });

      if (error) throw error;
      toast.success('Perfil atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Falha ao atualizar perfil: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createBucketIfNotExists = async () => {
    const { data, error } = await supabase.storage.getBucket('avatars');
    if (error && error.message.includes('not found')) {
      const { data, error: createError } = await supabase.storage.createBucket('avatars', {
        public: true
      });
      if (createError) {
        throw createError;
      }
    } else if (error) {
      throw error;
    }
  };

  const handleAvatarUpload = async (event) => {
    try {
      setIsLoading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem para upload.');
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
      toast.success('Avatar atualizado com sucesso');
    } catch (error) {
      toast.error('Erro no upload do avatar: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Editar Perfil</CardTitle>
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
            placeholder="Nome Completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />
          <Button onClick={handleUpdateProfile} disabled={isLoading}>
            {isLoading ? 'Atualizando...' : 'Atualizar Perfil'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileEditor;