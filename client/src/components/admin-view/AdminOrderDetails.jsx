import { useState } from "react";
import CommonForm from "../common/CommonForm";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const initialFormData = {
    status :''
}

function AdminOrderDetails() {
    const [formData , setFormData]=useState(initialFormData)

    function handleUpdateStatus(event){
     event.preventDefault()

    }
    return (
        <DialogContent className="sm:max-w-[600px] bg-white text-black p-8 rounded-lg shadow-md border border-black">
            <div className="grid gap-3 ">
                <div className="grid gap-1 ">
                    <div className="flex items-center justify-between  ">
                        <p className="font-medium">Order ID</p>
                        <Label>123456</Label>
                    </div>
                    <div className="flex items-center justify-between ">
                        <p className="font-medium">Order Date</p>
                        <Label>27/12/2024</Label>
                    </div>
                    <div className="flex items-center justify-between ">
                        <p className="font-medium">Order Price</p>
                        <Label>500 $</Label>
                    </div>
                    <div className="flex items-center justify-between ">
                        <p className="font-medium">Order status</p>
                        <Label>In process</Label>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4 p-3 border-t border-gray-400">
                    <div className="grid gap-2 ">
                        <div className="font-medium">Order Details</div>
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span>Product One</span>
                                <span>$200</span>

                            </li>
                        </ul>
                    </div>
                </div>
                <div className="grid gap-4 border-t border-gray-400">
                    <div className="grid gap-4">
                        <div className="font-medium">Shipping Info</div>
                        <div className="grid gap-0.5 text-muted-foreground">
                            <span>John Doe</span>
                            <span>Address</span>
                            <span>City</span>
                            <span>Pincode</span>
                            <span>Phone</span>
                            <span>notes</span>

                        </div>
                    </div>
                </div>
               
                <CommonForm
                    formControls={[
                        {
                            label: "Order status",
                            name: "status",
                            componentType: "select",
                            options: [
                                { id: "pending", label: "pending" },
                                { id: "inProcess", label: "In Process" },
                                { id: "inShipping", label: "In Shipping" },
                                { id: "delivered", label: "Delivered" },
                                { id: "rejected", label: "Rejected" },

                            ],
                        },
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={'Update Order Status'}
                    onSubmit={handleUpdateStatus}
                />
            </div>
        </DialogContent>
    );
}

export default AdminOrderDetails;
