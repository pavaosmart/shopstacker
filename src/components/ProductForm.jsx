import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAddProduct } from '../hooks/useProducts';
import { supabase } from '../integrations/supabase/supabase';
import ImageUploader from './ImageUploader';

const ProductForm = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [images, setImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [isBucketReady, setIsBucketReady] = useState(false);
  const addProduct = useAddProduct();

  useEffect(() => {
    createBucketIfNotExists();
  }, []);

  const createBucketIfNotExists = async () => {
    try {
      console.log('Checking if products bucket exists...');
      const { data, error } = await supabase.storage.getBucket('products');
      if (error && error.statusCode === '404') {
        console.log('Products bucket does not exist. Creating...');
        const { data: createdBucket, error: createError } = await supabase.storage.createBucket('products', {
          public: true
        });
        if (createError) {
          console.error('Error creating bucket:', createError);
          toast.error('Falha ao criar bucket de armazenamento');
        } else {
          console.log('Bucket created successfully:', createdBucket);
          toast.success('Bucket de produtos criado com sucesso');
          setIsBucketReady(true);
        }
      } else if (error) {
        console.error('Error checking bucket:', error);
        toast.error('Falha ao verificar bucket de armazenamento');
      } else {
        console.log('Products bucket already exists:', data);
        setIsBucketReady(true);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Ocorreu um erro inesperado');
    }
  };

  const uploadImage = async (file) => {
    if (!isBucketReady) {
      console.error('Bucket is not ready for upload');
      throw new Error('Bucket de armazenamento não está pronto');
    }
    console.log('Uploading image:', file.name);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    console.log('File uploaded successfully:', data);

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    console.log('Public URL:', publicUrl);
    return publicUrl;
  };

  const onSubmit = async (data) => {
    if (!isBucketReady) {
      toast.error('O sistema de armazenamento não está pronto. Por favor, tente novamente em alguns instantes.');
      return;
    }
    try {
      console.log('Submitting product data:', data);
      const uploadedImageUrls = await Promise.all(images.map(uploadImage));
      console.log('Uploaded image URLs:', uploadedImageUrls);

      const productData = {
        ...data,
        price: parseFloat(data.price),
        stock_quantity: parseInt(data.stock_quantity),
        suggested_price: parseFloat(data.suggested_price),
        cost_price: parseFloat(data.price),
        images: uploadedImageUrls,
        cover_image_index: coverIndex
      };
      console.log('Final product data:', productData);
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

      <Input 
        {...register("price", { 
          required: "Preço é obrigatório", 
          min: { value: 0, message: "O preço deve ser maior que zero" },
          validate: (value) => !isNaN(parseFloat(value)) || "O preço deve ser um número válido"
        })} 
        type="number" 
        step="0.01" 
        placeholder="Preço (também será usado como preço de custo)" 
      />
      {errors.price && <p className="text-red-500">{errors.price.message}</p>}

      <Input 
        {...register("stock_quantity", { 
          required: "Quantidade em estoque é obrigatória", 
          min: { value: 0, message: "A quantidade deve ser maior ou igual a zero" },
          validate: (value) => Number.isInteger(Number(value)) || "A quantidade deve ser um número inteiro"
        })} 
        type="number" 
        placeholder="Quantidade em Estoque" 
      />
      {errors.stock_quantity && <p className="text-red-500">{errors.stock_quantity.message}</p>}

      <Input 
        {...register("suggested_price", { 
          required: "Preço sugerido é obrigatório", 
          min: { value: 0, message: "O preço sugerido deve ser maior que zero" },
          validate: (value) => !isNaN(parseFloat(value)) || "O preço sugerido deve ser um número válido"
        })} 
        type="number" 
        step="0.01" 
        placeholder="Preço Sugerido para Venda" 
      />
      {errors.suggested_price && <p className="text-red-500">{errors.suggested_price.message}</p>}
      
      <ImageUploader
        images={images}
        setImages={setImages}
        coverIndex={coverIndex}
        setCoverIndex={setCoverIndex}
        isBucketReady={isBucketReady}
      />
      
      <Button type="submit" disabled={!isBucketReady}>
        {isBucketReady ? 'Adicionar Produto' : 'Aguarde...'}
      </Button>
    </form>
  );
};

export default ProductForm;
