import { Card, CardHeader, CardContent, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { useEffect, useState } from "react";
import AdminOrderDetails from "./AdminOrderDetails";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import AdminOrders from "@/pages/admin-view/AdminOrders";
import { useNavigate } from "react-router-dom";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order
  const { orderList ,orderDetails} = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();
  const navigate = useNavigate()
   
  function handleFetchOrderDetails(getId){
    dispatch(getOrderDetailsForAdmin(getId))
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const handleViewDetails = (order) => {
    navigate("/admin/order-details", { state: { order } });
  };
  console.log('Order details : ',orderDetails)
   
  useEffect(()=>{
   if(orderDetails !== null) setOpenDetailsDialog(true)
  },[])

  return (
    <Card className="bg-gray-300">
      <CardHeader>
        <CardTitle className="border-b border-black pb-2">All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-black">
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow key={orderItem._id}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-500 text-white py-1 px-3 border border-white"
                            : "bg-yellow-300 text-yellow-700 py-1 px-3 border border-white"
                        }
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Button
                        className="bg-[#008080] text-white hover:bg-red-700 rounded-[10px]"
                        onClick={() => {handleFetchOrderDetails(orderItem?._id) ;  handleViewDetails(orderItem)}}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog outside map */}
      {selectedOrder && (
        <Dialog
          open={openDetailsDialog}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setOpenDetailsDialog(false);
              setSelectedOrder(null);
            }
          }}
        >
          <AdminOrders orderDetails={selectedOrder} />
        </Dialog>
      )}
    </Card>
  );
}

export default AdminOrdersView;


