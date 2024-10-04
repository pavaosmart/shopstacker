import { supabase } from '../integrations/supabase/supabase';

export const ensureProductsBucket = async () => {
  try {
    const { data, error } = await supabase.storage.getBucket('products');
    
    if (error && error.statusCode === '404') {
      const { data: createdBucket, error: createError } = await supabase.storage.createBucket('products', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      console.log('Bucket created successfully:', createdBucket);
      
      await updateBucketPolicies();
    } else if (error) {
      console.error('Error checking bucket:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring products bucket:', error);
    return false;
  }
};

export const updateBucketPolicies = async () => {
  try {
    await supabase.storage.from('products').updateBucketPolicy({
      type: 'READ',
      definition: {
        allow: true,
        roles: ['anon', 'authenticated'],
      },
    });

    await supabase.storage.from('products').updateBucketPolicy({
      type: 'WRITE',
      definition: {
        allow: true,
        roles: ['authenticated'],
      },
    });

    console.log('Bucket policies updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating bucket policies:', error);
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