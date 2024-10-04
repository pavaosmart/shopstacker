import { supabase } from '../supabaseClient';

export const ensureProductsBucket = async () => {
  try {
    // Check if the bucket exists
    const { data, error } = await supabase.storage.getBucket('products');
    
    if (error) {
      if (error.statusCode === '404') {
        // Bucket doesn't exist, so create it
        const { data: createdBucket, error: createError } = await supabase.storage.createBucket('products', {
          public: true,
          fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          return false;
        }
        console.log('Bucket created successfully:', createdBucket);
      } else {
        console.error('Error checking bucket:', error);
        return false;
      }
    } else {
      console.log('Bucket already exists:', data);
    }
    
    // Apply access policies
    await applyBucketPolicies();
    
    return true;
  } catch (error) {
    console.error('Error ensuring products bucket:', error);
    return false;
  }
};

const applyBucketPolicies = async () => {
  try {
    // Allow public read access
    await supabase.storage.from('products').setPublic();

    // Apply policies for authenticated users
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
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
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

    console.log('File uploaded successfully:', data);
    return { success: true, publicUrl: publicUrlData.publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
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