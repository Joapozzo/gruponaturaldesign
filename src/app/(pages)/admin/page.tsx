import PageHeader from '@/components/admin/PageHeader';
import { Card } from '@/components/ui/Card';
import { TrendingUp, Package, ShoppingCart, Users } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { 
      label: 'Productos', 
      value: '245', 
      icon: Package, 
      trend: '+12%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Pedidos', 
      value: '89', 
      icon: ShoppingCart, 
      trend: '+8%',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Clientes', 
      value: '1,234', 
      icon: Users, 
      trend: '+23%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Vista general de tu negocio"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} variant="elevated" padding="lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-neutral-900 mb-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">{stat.trend}</span>
                    <span className="text-neutral-500">vs mes anterior</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
