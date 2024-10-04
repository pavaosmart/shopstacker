import { supabase } from '../supabaseClient';

export const ensureProductsBucket = async () => {
  try {
    // Check if the bucket exists
    const { data, error } = await supabase.storage.getBucket('products');
    
    if (error && error.statusCode === '404') {
      // Bucket doesn't exist, so create it
      const { data: createdBucket, error: createError } = await supabase.storage.createBucket('products', {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      console.log('Bucket created successfully:', createdBucket);
      
      // Set up bucket policies after creation
      await updateBucketPolicies();
    } else if (error) {
      console.error('Error checking bucket:', error);
      return false;
    } else {
      console.log('Bucket already exists:', data);
      // Update policies even if the bucket already exists
      await updateBucketPolicies();
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring products bucket:', error);
    return false;
  }
};

const updateBucketPolicies = async () => {
  try {
    // Set public read access
    const { data: policyData, error: policyError } = await supabase.storage.from('products').getPublicUrl('dummy.txt');
    if (policyError) {
      console.error('Error setting read policy:', policyError);
    }

    // Set write access for authenticated users
    const { data: userData } = await supabase.auth.getUser();
    if (userData && userData.user) {
      const { error: writeError } = await supabase.storage.from('products').upload('dummy.txt', 'test');
      if (writeError) {
        console.error('Error setting write policy:', writeError);
      } else {
        await supabase.storage.from('products').remove(['dummy.txt']);
      }
    }

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