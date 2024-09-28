import { supabase } from '../integrations/supabase/supabase';

export const fetchProductColumns = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.error("Error fetching product data:", error);
      throw new Error("Error fetching product data");
    }

    // If data is empty array (no products in the table), return a default set of columns
    if (!data || data.length === 0) {
      return ['id', 'name', 'description', 'price', 'stock_quantity'];
    }

    // Return the keys of the first data object, which represent the column names
    return Object.keys(data[0]);
  } catch (err) {
    console.error("Error in fetchProductColumns:", err);
    // Return a default set of columns in case of error
    return ['id', 'name', 'description', 'price', 'stock_quantity'];
  }
};

export const handleSupabaseResponse = async (promise) => {
  try {
    const { data, error } = await promise;
    if (error) {
      console.error("Error accessing Supabase:", error.message, {
        query: promise,
        details: error.details
      });
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    console.error("Error in Supabase:", err);
    throw err;
  }
};