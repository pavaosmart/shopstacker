import { supabase } from '../integrations/supabase/supabase';

export const ensureProductsBucket = async () => {
  try {
    const { data, error } = await supabase.storage.getBucket('products');
    if (error && error.statusCode === '404') {
      const { data: createdBucket, error: createError } = await supabase.storage.createBucket('products', { public: true });
      if (createError) throw createError;
      console.log('Bucket created successfully:', createdBucket);
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