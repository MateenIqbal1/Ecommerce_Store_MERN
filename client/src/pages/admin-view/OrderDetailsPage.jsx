import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Box,
  Divider,
  Paper,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Badge,
} from "@mui/material";
import { useToast } from "@/hooks/use-toast";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from "@/store/admin/order-slice";

function OrderDetailsPage() {
  const { state } = useLocation();
  const { order } = state || {}; 
  const { orderList } = useSelector((state) => state.adminOrder); 
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || "pending");
  const [currentOrder, setCurrentOrder] = useState(order);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order?.orderStatus); 
    }
  }, [order]); 

  useEffect(() => {
    if (orderList.length > 0 && currentOrder) {
      const updatedOrder = orderList.find((order) => order._id === currentOrder._id);
      if (updatedOrder) {
        setCurrentOrder(updatedOrder);
      }
    }
  }, [orderList, currentOrder]); 

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  function handleUpdateOrderStatus(event) {
    event.preventDefault();

    const newStatus = selectedStatus;
    setSelectedStatus(newStatus);

    dispatch(
      updateOrderStatus({ id: currentOrder._id, orderStatus: newStatus })
    )
    .then((response) => {
      if (response?.payload?.success) {
        toast({
          title: "Order status updated successfully",
          className: "bg-green-500 text-white p-4 rounded-lg shadow-lg", 
        });

        dispatch(getOrderDetailsForAdmin(currentOrder._id)); 
        dispatch(getAllOrdersForAdmin()); 
      } else {
        toast({
          title: "Failed to update the order status",
          className: "bg-red-500 text-white p-4 rounded-lg shadow-lg", // Tailwind classes for error
        });
      }
    })
    .catch((error) => {
      console.error(error);
      toast({
        title: "An error occurred while updating the order status.",
        className: "bg-red-500 text-white p-4 rounded-lg shadow-lg", // Tailwind classes for error
      });
    });
  }

  if (!currentOrder) {
    return <Typography variant="h6">No Order Selected</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "100vh",
        padding: "16px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Paper elevation={3} sx={{ padding: "24px", maxWidth: "600px", width: "100%" }}>
        <Typography variant="h5" gutterBottom>
          Order Details
        </Typography>
        <Divider sx={{ marginY: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <Typography variant="body1">
            <strong>Order ID:</strong>
          </Typography>
          <Typography variant="body1">{currentOrder._id}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <Typography variant="body1">
            <strong>Order Date:</strong>
          </Typography>
          <Typography variant="body1">{currentOrder.orderDate.split("T")[0]}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <Typography variant="body1">
            <strong>Order Price:</strong>
          </Typography>
          <Typography variant="body1">${currentOrder.totalAmount}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <Typography variant="body1">
            <strong>Order Status:</strong>
          </Typography>
          <Badge
            className={
              currentOrder?.orderStatus === "confirmed"
                ? "bg-green-500 text-white py-1 px-3 border border-white rounded-[50px]"
                : "bg-yellow-300 text-yellow-700 py-1 px-3 border border-white rounded-[50px]"
            }
          >
            {currentOrder?.orderStatus}
          </Badge>
        </Box>

        <Divider sx={{ marginY: 2 }} />

        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        <Box>
          {currentOrder.cartItems.map((item) => (
            <Box key={item._id} sx={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <Typography variant="body2">{item.title}</Typography>
              <Typography variant="body2">x{item.quantity}</Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ marginY: 2 }} />

        <InputLabel id="order-status-label">Change Order Status</InputLabel>

        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel id="order-status-label">{selectedStatus ? "Order Status" : "Select Order Status"}</InputLabel>
          <Select labelId="order-status-label" value={selectedStatus || ""} onChange={handleStatusChange}>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="inProcess">In Process</MenuItem>
            <MenuItem value="inShipping">In Shipping</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 3 }}
          onClick={handleUpdateOrderStatus}
        >
          Update Order Status
        </Button>
      </Paper>
    </Box>
  );
}

export default OrderDetailsPage;
