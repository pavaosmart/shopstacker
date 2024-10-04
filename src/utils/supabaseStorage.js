import { supabase } from '../supabaseClient';

export const ensureProductsBucket = async () => {
  try {
    // Verifica se o bucket existe
    const { data, error } = await supabase.storage.getBucket('products');
    
    if (error && error.statusCode === '404') {
      // O bucket não existe, então vamos criá-lo
      const { data: createdBucket, error: createError } = await supabase.storage.createBucket('products', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
      });
      
      if (createError) {
        console.error('Erro ao criar o bucket:', createError);
        return false;
      }
      console.log('Bucket criado com sucesso:', createdBucket);
      
      // Configura as políticas do bucket após a criação
      await updateBucketPolicies();
    } else if (error) {
      console.error('Erro ao verificar o bucket:', error);
      return false;
    } else {
      console.log('O bucket já existe:', data);
      // Atualiza as políticas mesmo se o bucket já existir
      await updateBucketPolicies();
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao garantir o bucket de produtos:', error);
    return false;
  }
};

const updateBucketPolicies = async () => {
  try {
    // Define acesso de leitura público
    await supabase.storage.from('products').updateBucketPolicy({
      type: 'READ',
      definition: {
        allow: true,
        roles: ['anon', 'authenticated'],
      },
    });

    // Define acesso de escrita para usuários autenticados
    await supabase.storage.from('products').updateBucketPolicy({
      type: 'WRITE',
      definition: {
        allow: true,
        roles: ['authenticated'],
      },
    });

    console.log('Políticas do bucket atualizadas com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao atualizar as políticas do bucket:', error);
    return false;
  }
};

export const uploadImage = async (file, userId, sku, index) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    const fileName = `${userId}/${sku}_${index}.${file.name.split('.').pop()}`;
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const initializeStorage = async () => {
  const bucketCreated = await ensureProductsBucket();
  if (!bucketCreated) {
    console.error('Failed to initialize storage');
    return false;
  }
  return true;
};
