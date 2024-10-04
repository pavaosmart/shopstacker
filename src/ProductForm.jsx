import React, { useEffect } from 'react';
import { supabase } from './supabaseClient';

const createBucketIfNotExists = async (bucketName) => {
    const { data, error } = await supabase
        .storage
        .createBucket(bucketName, { public: true });

    if (error) {
        if (error.message.includes('already exists')) {
            console.log(`Bucket '${bucketName}' already exists.`);
        } else {
            console.error('Error creating bucket:', error);
        }
    } else {
        console.log(`Bucket '${bucketName}' created successfully.`);
    }
};

const ProductForm = () => {
    useEffect(() => {
        createBucketIfNotExists('products');
    }, []);

    return (
        <div>
            {/* Your form elements go here */}
        </div>
    );
};

export default ProductForm;
