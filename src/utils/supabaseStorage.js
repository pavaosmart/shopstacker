import { supabase } from '../supabaseClient';

export const ensureProductsBucket = async () => {
  try {
    // Check if the bucket exists
    const { data, error } = await supabase.storage.getBucket('products');
    
    if (error && error.statusCode === '404') {
      // Bucket doesn't exist, so create it
      const { data: createdBucket, error: createError } = await supabase.storage.createBucket('products', {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB limit
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      console.log('Bucket created successfully:', createdBucket);
      
      // Set policies for the new bucket
      await setBucketPolicies();
    } else if (error) {
      console.error('Error checking bucket:', error);
      return false;
    } else {
      console.log('Bucket already exists:', data);
      // Ensure policies are set correctly for existing bucket
      await setBucketPolicies();
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring products bucket:', error);
    return false;
  }
};

const setBucketPolicies = async () => {
  try {
    // Allow public read access
    await supabase.storage.from('products').setPublic();

    // Set policy for authenticated users to upload
    const { error: policyError } = await supabase.rpc('apply_storage_policies');
    if (policyError) throw policyError;

    console.log('Bucket policies set successfully');
    return true;
  } catch (error) {
    console.error('Error setting bucket policies:', error);
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