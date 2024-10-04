import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAddProduct, useUpdateProduct } from '../hooks/useProducts';
import { supabase } from '../integrations/supabase/supabase';

const ProductForm = ({ product, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: product || {}
  });
  const [images, setImages] = useState(product?.images || []);
  const [coverIndex, setCoverIndex] = useState(product?.cover_image_index || 0);
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const onSubmit = async (data) => {
    try {
      const productData = {
        ...data,
        images,
        cover_image_index: coverIndex
      };

      if (product) {
        await updateProduct.mutateAsync({ id: product.id, ...productData });
      } else {
        await addProduct.mutateAsync(productData);
      }
      toast.success(`Produto ${product ? 'atualizado' : 'adicionado'} com sucesso!`);
      onSuccess();
    } catch (error) {
      toast.error(`Erro ao ${product ? 'atualizar' : 'adicionar'} produto: ${error.message}`);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      toast.error('Você pode fazer upload de no máximo 6 imagens.');
      return;
    }

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) {
        toast.error(`Erro ao fazer upload da imagem: ${error.message}`);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        setImages(prev => [...prev, publicUrl]);
      }
    }
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
      <Input {...register("name", { required: "Nome é obrigatório" })} placeholder="Nome do Produto" />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <Textarea {...register("description")} placeholder="Descrição do Produto" />

      <Input {...register("price", { required: "Preço é obrigatório", min: 0 })} type="number" step="0.01" placeholder="Preço" />
      {errors.price && <p className="text-red-500">{errors.price.message}</p>}

      <Input {...register("stock_quantity", { required: "Quantidade em estoque é obrigatória", min: 0 })} type="number" placeholder="Quantidade em Estoque" />
      {errors.stock_quantity && <p className="text-red-500">{errors.stock_quantity.message}</p>}

      <div>
        <input type="file" onChange={handleImageUpload} multiple accept="image/*" className="mb-2" />
        <div className="flex flex-wrap gap-2">
          {images.map((url, index) => (
            <div key={url} className="relative">
              <img src={url} alt={`Produto ${index + 1}`} className="w-24 h-24 object-cover" />
              <button type="button" onClick={() => setCoverImage(index)} className="absolute top-0 left-0 bg-blue-500 text-white p-1 text-xs">
                {index === coverIndex ? 'Capa' : 'Definir Capa'}
              </button>
              {index > 0 && (
                <button type="button" onClick={() => moveImage(index, index - 1)} className="absolute bottom-0 left-0 bg-gray-500 text-white p-1 text-xs">
                  ←
                </button>
              )}
              {index < images.length - 1 && (
                <button type="button" onClick={() => moveImage(index, index + 1)} className="absolute bottom-0 right-0 bg-gray-500 text-white p-1 text-xs">
                  →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Button type="submit">{product ? 'Atualizar' : 'Adicionar'} Produto</Button>
    </form>
  );
};

export default ProductForm;