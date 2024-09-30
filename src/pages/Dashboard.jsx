import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardCard from '../components/DashboardCard';
import BarChart from '../components/BarChart';
import { Package, Users, DollarSign, Activity } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useProducts();

  const totalProducts = products?.length || 0;
  const totalValue = products?.reduce((sum, product) => sum + product.price * product.stock_quantity, 0) || 0;

  const chartData = products?.map(product => ({
    name: product.name,
    value: product.stock_quantity
  })) || [];

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar produtos: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard title="Total de Produtos" value={totalProducts} icon={Package} />
            <DashboardCard title="Valor Total do Estoque" value={`R$ ${totalValue.toFixed(2)}`} icon={DollarSign} />
            <DashboardCard title="Usuários Ativos" value="573" icon={Users} />
            <DashboardCard title="Atividades Recentes" value="24" icon={Activity} />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Visão Geral</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <p>Conteúdo da visão geral vai aqui</p>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Vendas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Conteúdo de vendas recentes vai aqui</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quantidade em Estoque por Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={chartData} dataKey="value" nameKey="name" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;