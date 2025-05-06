import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";


function  ShoppingOrderDetails({orderDetails}){
    const {user} =useSelector(state=>state.auth)
    return(
        <DialogContent className="sm:max-w-[600px] bg-white text-black p-8 rounded-lg shadow-md border border-black">
            <div className="grid gap-3 ">
                <div className="grid gap-1 ">
                    <div className="flex items-center justify-between  ">
                        <p className="font-medium">Order ID</p>
                        <Label>{orderDetails?._id}</Label>
                    </div>
                    <div className="flex items-center justify-between ">
                        <p className="font-medium">Order Date</p>
                        <Label>{orderDetails?.orderDate.split('T')[0]}</Label>
                    </div>
                    <div className="flex items-center justify-between ">
                        <p className="font-medium">Order Price</p>
                        <Label>{orderDetails?.totalAmount}</Label>
                    </div>
                    <div className="flex items-center justify-between ">
                        <p className="font-medium">Order status</p>
                        <Label><Badge
                        className={
                          orderDetails?.orderStatus === "confirmed"
                            ? "bg-green-500 text-white py-1 px-3 border border-white"
                            : "bg-yellow-300 text-yellow-700 py-1 px-3 border border-white"
                        }
                      >
                        {orderDetails?.orderStatus}
                      </Badge>
                      </Label>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4 p-3 border-t border-gray-400">
                    <div className="grid gap-2 ">
                        <div className="font-medium">Order Details</div>
                        <ul className="grid gap-3">
                            {
                                orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? 
                                orderDetails?.cartItems.map(item=>
                                    <li className="flex items-center justify-between">
                                    <span>{item.title}</span>
                                    <span>{item.quantity}</span>
                                    
    
                                </li>
                                ):null
                            }
                    
                        </ul>
                    </div>
                </div>
                <div className="grid gap-4 border-t border-gray-400">
                    <div className="grid gap-4">
                        <div className="font-medium">Shipping Info</div>
                        <div className="grid gap-0.5 text-muted-foreground">
                            <span>{user?.userName}</span>
                            

                        </div>
                    </div>
                </div>

                
            </div>
        </DialogContent>
    )
}
export default ShoppingOrderDetails