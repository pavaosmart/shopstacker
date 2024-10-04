import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAddProduct } from '../hooks/useProducts';
import { supabase } from '../integrations/supabase/supabase';

const ProductForm = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [images, setImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const addProduct = useAddProduct();

  useEffect(() => {
    createBucketIfNotExists();
  }, []);

  const createBucketIfNotExists = async () => {
    try {
      const { data, error } = await supabase.storage.getBucket('products');
      if (error && error.message.includes('not found')) {
        const { data: createdBucket, error: createError } = await supabase.storage.createBucket('products', {
          public: true
        });
        if (createError) {
          console.error('Error creating bucket:', createError);
          toast.error('Failed to create storage bucket');
        } else {
          toast.success('Storage bucket created successfully');
        }
      } else if (error) {
        console.error('Error checking bucket:', error);
        toast.error('Failed to check storage bucket');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const uploadImage = async (file) => {
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

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onSubmit = async (data) => {
    try {
      const uploadedImageUrls = await Promise.all(images.map(uploadImage));

      const productData = {
        ...data,
        cost_price: data.price,
        images: uploadedImageUrls,
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      toast.error('Você pode fazer upload de no máximo 6 imagens.');
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
    if (coverIndex === fromIndex) setCoverIndex(toIndex);
    else if (coverIndex === toIndex) setCoverIndex(fromIndex);
  };

  const setCoverImage = (index) => {
    setCoverIndex(index);
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

      <div>
        <p className="text-sm text-gray-600 mb-2">Imagens devem ser 1200x1200 pixels, formato JPG ou PNG</p>
        <input type="file" onChange={handleImageUpload} multiple accept="image/*" className="mb-2" />
        <div className="flex flex-wrap gap-2">
          {images.map((url, index) => (
            <div key={url} className="relative">
              <img src={url} alt={`Produto ${index + 1}`} className="w-20 h-20 object-cover rounded" />
              {index === coverIndex && (
                <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">
                  Capa
                </span>
              )}
              <button 
                type="button" 
                onClick={() => setCoverImage(index)} 
                className="absolute bottom-0 left-0 bg-gray-800 text-white text-xs px-1 rounded-tr"
              >
                {index === coverIndex ? 'Capa' : 'Definir Capa'}
              </button>
              {index > 0 && (
                <button 
                  type="button" 
                  onClick={() => moveImage(index, index - 1)} 
                  className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-1 rounded-tl"
                >
                  ←
                </button>
              )}
              {index < images.length - 1 && (
                <button 
                  type="button" 
                  onClick={() => moveImage(index, index + 1)} 
                  className="absolute top-0 right-0 bg-gray-800 text-white text-xs px-1 rounded-bl"
                >
                  →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Button type="submit">Adicionar Produto</Button>
    </form>
  );
};

export default ProductForm;