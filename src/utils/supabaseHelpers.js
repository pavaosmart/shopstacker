import { supabase } from '../integrations/supabase/supabase';

export const fetchProductColumns = async () => {
  const { data: columns, error } = await supabase
    .from('information_schema.columns')
    .select('column_name')
    .eq('table_name', 'products');

  if (error) {
    console.error("Erro ao buscar colunas:", error);
    throw new Error("Erro ao buscar colunas.");
  }

  return columns.map(col => col.column_name);
};

export const handleSupabaseResponse = async (promise) => {
  try {
    const { data, error } = await promise;
    if (error) {
      console.error("Erro ao acessar o Supabase:", error.message, {
        query: promise,
        details: error.details
      });
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    console.error("Erro no Supabase:", err);
    throw err;
  }
};