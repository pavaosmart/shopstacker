import { supabase } from '../supabaseClient';

export const ensureProductsBucket = async () => {
  try {
    // Verificar se o bucket existe
    const { data, error } = await supabase.storage.getBucket('products');
    
    if (error && error.statusCode === '404') {
      // O bucket não existe, então vamos criá-lo
      const { data: createdBucket, error: createError } = await supabase.storage.createBucket('products', {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // Limite de 10MB
      });
      
      if (createError) {
        console.error('Erro ao criar bucket:', createError);
        return false;
      }
      console.log('Bucket criado com sucesso:', createdBucket);
    } else if (error) {
      console.error('Erro ao verificar bucket:', error);
      return false;
    } else {
      console.log('Bucket já existe:', data);
    }
    
    // Aplicar políticas de acesso
    await applyBucketPolicies();
    
    return true;
  } catch (error) {
    console.error('Erro ao garantir bucket de produtos:', error);
    return false;
  }
};

const applyBucketPolicies = async () => {
  try {
    // Permitir acesso público de leitura
    await supabase.storage.from('products').setPublic();

    // Aplicar políticas para usuários autenticados
    const { error } = await supabase.rpc('apply_storage_policies');
    if (error) throw error;

    console.log('Políticas do bucket aplicadas com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao aplicar políticas do bucket:', error);
    return false;
  }
};

export const uploadImage = async (fileObject, userId, sku) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Usuário não autenticado');
    }

    const filePath = `${userId}/${sku}/${fileObject.name}`;
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, fileObject, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    console.log('Arquivo enviado com sucesso:', data);
    return { success: true, publicUrl: publicUrlData.publicUrl };
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    return { success: false, message: error.message };
  }
};

export const getImageUrl = async (userId, sku, fileName) => {
  try {
    const filePath = `${userId}/${sku}/${fileName}`;
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error generating URL:', error.message);
    return null;
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
