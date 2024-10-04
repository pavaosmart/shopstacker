import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAddProduct } from '../hooks/useProducts';
import ImageUploader from './ImageUploader';
import { ensureProductsBucket, updateBucketPolicies, uploadImage } from '../utils/supabaseStorage';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const ProductForm = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [images, setImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [isBucketReady, setIsBucketReady] = useState(false);
  const addProduct = useAddProduct();
  const { session } = useSupabaseAuth();

  useEffect(() => {
    const initializeBucket = async () => {
      const bucketCreated = await ensureProductsBucket();
      if (bucketCreated) {
        const policiesUpdated = await updateBucketPolicies();
        setIsBucketReady(policiesUpdated);
      }
    };
    initializeBucket();
  }, []);

  const onSubmit = async (data) => {
    if (!isBucketReady) {
      toast.error('Storage is not ready. Please try again in a moment.');
      return;
    }

    try {
      const uploadedImages = await Promise.all(
        images.map((file, index) => uploadImage(file, session.user.id, data.sku, index))
      );

      const productData = {
        ...data,
        cost_price: data.price,
        images: uploadedImages,
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

      <Button type="submit" disabled={!isBucketReady}>
        {isBucketReady ? 'Adicionar Produto' : 'Aguardando inicialização do armazenamento...'}
      </Button>
    </form>
  );
};

export default ProductForm;
