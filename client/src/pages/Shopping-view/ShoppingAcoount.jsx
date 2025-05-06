import React from 'react';
import accImage from '../../assets/account.jpg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Address from '@/components/shopping-view/Address';
import ShoppingOrders from '@/components/shopping-view/Orders';

const ShoppingAccount = () => {
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          width={'1600'}
          height={'300'}
          style={{ aspectRatio: '1600/300', objectFit: 'cover' }}
          src={accImage}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-0 shadow-sm">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="flex w-full justify-start border-b border-gray-200 p-4">
              <TabsTrigger
                value="orders"
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-blue-100 data-[state=active]:border-blue-500"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-green-100 data-[state=active]:border-green-500"
              >
                Address
              </TabsTrigger>
            </TabsList>

            {/* Tabs Content */}
            <div className="p-4">
              <TabsContent value="orders" className="text-left">
                <ShoppingOrders />
              </TabsContent>
              <TabsContent value="address" className="text-left">
                <Address />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ShoppingAccount;
 