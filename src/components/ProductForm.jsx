import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAddProduct } from '../hooks/useProducts';
import { supabase } from '../supabaseClient';

const ProductForm = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [image, setImage] = useState(null);
  const addProduct = useAddProduct();

  const onSubmit = async (data) => {
    try {
      let imageUrl = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const productData = {
        ...data,
        main_image_url: imageUrl,
        cost_price: parseFloat(data.cost_price),
        price: parseFloat(data.price),
        stock_quantity: parseInt(data.stock_quantity),
        suggested_price: parseFloat(data.suggested_price)
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
      <div>
        <Label htmlFor="sku">SKU</Label>
        <Input id="sku" {...register("sku", { required: "SKU é obrigatório" })} />
        {errors.sku && <p className="text-red-500">{errors.sku.message}</p>}
      </div>

      <div>
        <Label htmlFor="name">Nome do Produto</Label>
        <Input id="name" {...register("name", { required: "Nome é obrigatório" })} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div>
        <Label htmlFor="price">Preço de Venda</Label>
        <Input id="price" type="number" step="0.01" {...register("price", { required: "Preço é obrigatório", min: 0 })} />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      <div>
        <Label htmlFor="cost_price">Preço de Custo</Label>
        <Input id="cost_price" type="number" step="0.01" {...register("cost_price", { required: "Preço de custo é obrigatório", min: 0 })} />
        {errors.cost_price && <p className="text-red-500">{errors.cost_price.message}</p>}
      </div>

      <div>
        <Label htmlFor="stock_quantity">Quantidade em Estoque</Label>
        <Input id="stock_quantity" type="number" {...register("stock_quantity", { required: "Quantidade em estoque é obrigatória", min: 0 })} />
        {errors.stock_quantity && <p className="text-red-500">{errors.stock_quantity.message}</p>}
      </div>

      <div>
        <Label htmlFor="suggested_price">Preço Sugerido</Label>
        <Input id="suggested_price" type="number" step="0.01" {...register("suggested_price", { min: 0 })} />
      </div>

      <div>
        <Label htmlFor="image">Imagem do Produto</Label>
        <Input id="image" type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
      </div>

      <Button type="submit">Adicionar Produto</Button>
    </form>
  );
};

export default ProductForm;