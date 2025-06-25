
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Próximamente
          </h3>
          <p className="text-muted-foreground">
            El módulo de gestión de clientes estará disponible pronto
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
