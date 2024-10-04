import { supabase } from '../integrations/supabase/supabase';

export const ensureProductsBucket = async () => {
  try {
    // Check if the bucket exists
    const { data, error } = await supabase.storage.getBucket('products');
    
    if (error && error.statusCode === '404') {
      // Bucket doesn't exist, so create it
      const { data: createdBucket, error: createError } = await supabase.storage.createBucket('products', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
      });
      
      if (createError) throw createError;
      console.log('Bucket created successfully:', createdBucket);
      
      // Set up policies for the new bucket
      await updateBucketPolicies();
    } else if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring products bucket:', error);
    return false;
  }
};

export const updateBucketPolicies = async () => {
  try {
    const { error: readError } = await supabase.storage.from('products').createSignedUrl('dummy.txt', 60);
    if (readError) {
      await supabase.storage.from('products').updateBucketPolicy({
        type: 'READ',
        definition: {
          allow: true,
          roles: ['anon', 'authenticated'],
        },
      });
    }

    const { error: writeError } = await supabase.storage.from('products').upload('dummy.txt', 'test');
    if (writeError) {
      await supabase.storage.from('products').updateBucketPolicy({
        type: 'WRITE',
        definition: {
          allow: true,
          roles: ['authenticated'],
        },
      });
    }

    if (writeError) {
      await supabase.storage.from('products').remove(['dummy.txt']);
    }

    console.log('Bucket policies updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating bucket policies:', error);
    return false;
  }
};