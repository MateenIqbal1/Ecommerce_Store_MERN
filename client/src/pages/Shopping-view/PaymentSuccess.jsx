import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        {/* Flex container to align text and tick mark */}
        <div className="flex items-center justify-center space-x-4">
          <CardTitle className="text-5xl text-green-700">Payment is Successful</CardTitle>
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-500 border border-white">
            <span className="text-white text-5xl">✔</span>
          </div>
        </div>
      </CardHeader>
      <Button 
  className="mt-5 mb-5 w-50 h-19 bg-pink-700 hover:bg-red-600 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 border order-black"
  onClick={() => navigate("/shop/account")}>
        View Orders
      </Button>
    </Card>
  );
}

export default PaymentSuccess;
