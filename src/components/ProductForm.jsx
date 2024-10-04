import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAddProduct } from '../hooks/useProducts';
import { supabase } from '../integrations/supabase/supabase';
import ImageUploader from './ImageUploader';

const createBucketIfNotExists = async (bucketName) => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    
    if (error && error.statusCode === '404') {
      // Bucket doesn't exist, so create it
      const { data, error: createError } = await supabase.storage.createBucket(bucketName, { public: true });
      if (createError) {
        throw createError;
      }
      console.log(`Bucket '${bucketName}' created successfully.`);
    } else if (error) {
      throw error;
    } else {
      console.log(`Bucket '${bucketName}' already exists.`);
    }
  } catch (error) {
    console.error('Error checking/creating bucket:', error);
    toast.error(`Failed to initialize storage: ${error.message}`);
  }
};

const ProductForm = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [images, setImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [isBucketReady, setIsBucketReady] = useState(false);
  const addProduct = useAddProduct();

  useEffect(() => {
    const initializeBucket = async () => {
      await createBucketIfNotExists('products');
      setIsBucketReady(true);
    };
    initializeBucket();
  }, []);

  const onSubmit = async (data) => {
    if (!isBucketReady) {
      toast.error('Storage is not ready. Please try again in a moment.');
      return;
    }

    try {
      const productData = {
        ...data,
        cost_price: data.price,
        images,
        cover_image_index: coverIndex
      };
      await addProduct.mutateAsync(productData);
      toast.success('Produto adicionado com sucesso!');
      onSuccess();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(`Erro ao adicionar produto: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("sku", { required: "SKU é obrigatório" })} placeholder="SKU" />
      {errors.sku && <p className="text-red-500">{errors.sku.message}</p>}

      <Input {...register("name", { required: "Nome é obrigatório" })} placeholder="Título do Produto" />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <Textarea {...register("description")} placeholder="Descrição do Produto" />

      <Input {...register("price", { required: "Preço é obrigatório", min: 0 })} type="number" step="0.01" placeholder="Preço (também será usado como preço de custo)" />
      {errors.price && <p className="text-red-500">{errors.price.message}</p>}

      <Input {...register("stock_quantity", { required: "Quantidade em estoque é obrigatória", min: 0 })} type="number" placeholder="Quantidade em Estoque" />
      {errors.stock_quantity && <p className="text-red-500">{errors.stock_quantity.message}</p>}

      <Input {...register("suggested_price", { required: "Preço sugerido é obrigatório", min: 0 })} type="number" step="0.01" placeholder="Preço Sugerido para Venda" />
      {errors.suggested_price && <p className="text-red-500">{errors.suggested_price.message}</p>}

      <ImageUploader
        images={images}
        setImages={setImages}
        coverIndex={coverIndex}
        setCoverIndex={setCoverIndex}
        isBucketReady={isBucketReady}
      />

      <Button type="submit" disabled={!isBucketReady}>Adicionar Produto</Button>
    </form>
  );
};

export default ProductForm;