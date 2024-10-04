import { supabase } from '../supabaseClient';

export const ensureProductsBucket = async () => {
  try {
    const { data, error } = await supabase.storage.getBucket('products');
    
    if (error && error.statusCode === '404') {
      console.log('Products bucket not found. Creating...');
      const { data: createdBucket, error: createError } = await supabase.storage.createBucket('products', {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
      });
      
      if (createError) throw createError;
      console.log('Bucket created successfully:', createdBucket);
    } else if (error) {
      throw error;
    } else {
      console.log('Products bucket already exists:', data);
    }
    
    await applyBucketPolicies();
    return true;
  } catch (error) {
    console.error('Error ensuring products bucket:', error);
    return false;
  }
};

const applyBucketPolicies = async () => {
  try {
    const { error: publicError } = await supabase.storage.from('products').setPublic();
    if (publicError) throw publicError;

    const { error } = await supabase.rpc('apply_storage_policies');
    if (error) throw error;

    console.log('Bucket policies applied successfully');
    return true;
  } catch (error) {
    console.error('Error applying bucket policies:', error);
    return false;
  }
};

export const uploadImage = async (fileObject, userId, sku) => {
  try {
    const { data: { session } } = await supabase.auth.getUser();
    if (!session) throw new Error('User not authenticated');

    const filePath = `${userId}/${sku}/${fileObject.name}`;
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, fileObject, { upsert: true });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return { success: true, publicUrl: publicUrlData.publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, message: error.message };
  }
};

export const getImageUrl = (userId, sku, fileName) => {
  const filePath = `${userId}/${sku}/${fileName}`;
  const { data } = supabase.storage.from('products').getPublicUrl(filePath);
  return data.publicUrl;
};

export const initializeStorage = async () => {
  console.log('Initializing storage...');
  const bucketCreated = await ensureProductsBucket();
  if (!bucketCreated) {
    console.error('Failed to initialize storage');
    return false;
  }
  console.log('Storage initialized successfully');
  return true;
};