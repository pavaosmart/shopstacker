import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpdateUserProduct } from '../hooks/useUserProducts';
import { toast } from "sonner";

const MarketplaceTab = ({ marketplace, product, onUpdate }) => {
  const [marketplaceData, setMarketplaceData] = useState(product[marketplace] || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarketplaceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(marketplace, marketplaceData);
  };

  return (
    <div className="space-y-4">
      <Input
        name="title"
        value={marketplaceData.title || ''}
        onChange={handleChange}
        placeholder="Título"
      />
      <Textarea
        name="description"
        value={marketplaceData.description || ''}
        onChange={handleChange}
        placeholder="Descrição"
      />
      <Input
        name="price"
        type="number"
        value={marketplaceData.price || ''}
        onChange={handleChange}
        placeholder="Preço de Venda"
      />
      {/* Adicione mais campos conforme necessário */}
      <Button onClick={handleSave}>Salvar Alterações</Button>
      <Button variant={marketplaceData.isListed ? "secondary" : "default"}>
        {marketplaceData.isListed ? "Vendendo" : "Vender"}
      </Button>
    </div>
  );
};

const ProductDetails = ({ product, onClose }) => {
  const updateProductMutation = useUpdateUserProduct();

  const handleUpdateMarketplace = async (marketplace, data) => {
    try {
      await updateProductMutation.mutateAsync({
        id: product.id,
        [marketplace]: data
      });
      toast.success(`Dados atualizados para ${marketplace}`);
    } catch (error) {
      toast.error(`Erro ao atualizar dados: ${error.message}`);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">Detalhes do Produto</h3>
            <p>SKU: {product.sku}</p>
            <p>Preço de Custo: R$ {product.cost_price?.toFixed(2)}</p>
            <p>Estoque: {product.stock_quantity}</p>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Imagens</h4>
              <div className="grid grid-cols-3 gap-2">
                {product.images.map((img, index) => (
                  <img key={index} src={img} alt={`Produto ${index + 1}`} className="w-full h-24 object-cover rounded" />
                ))}
              </div>
            </div>
          </div>
          <div>
            <Tabs defaultValue="mercadolivre">
              <TabsList>
                <TabsTrigger value="mercadolivre">Mercado Livre</TabsTrigger>
                <TabsTrigger value="shopee">Shopee</TabsTrigger>
                <TabsTrigger value="amazon">Amazon</TabsTrigger>
                <TabsTrigger value="shopify">Shopify</TabsTrigger>
              </TabsList>
              <TabsContent value="mercadolivre">
                <MarketplaceTab marketplace="mercadolivre" product={product} onUpdate={handleUpdateMarketplace} />
              </TabsContent>
              <TabsContent value="shopee">
                <MarketplaceTab marketplace="shopee" product={product} onUpdate={handleUpdateMarketplace} />
              </TabsContent>
              <TabsContent value="amazon">
                <MarketplaceTab marketplace="amazon" product={product} onUpdate={handleUpdateMarketplace} />
              </TabsContent>
              <TabsContent value="shopify">
                <MarketplaceTab marketplace="shopify" product={product} onUpdate={handleUpdateMarketplace} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;