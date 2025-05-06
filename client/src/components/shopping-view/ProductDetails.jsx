import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import StarRating from "../common/StarRating";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { data } from "autoprefixer";

const ProductDetails = ({ open, setOpen, productDetails }) => {
  const [reviewMsg, setReviewMsg] = useState('')
  const [rating, setRating] = useState(0)
  const dispatch = useDispatch()
  const { toast } = useToast()
  const { user } = useSelector(state => state.auth)
  const { cartItems } = useSelector(state => state.shopCart)
  const { reviews } = useSelector(state => state.shopReview)



  useEffect(() => {
    if (productDetails) {
      dispatch(getReviews(productDetails._id));
    }
    console.log(reviews, 'these are reviews of the product opened');
  }, [productDetails, dispatch]);  // Make sure dispatch is included in the dependency array


  function handleRatingChange(getRating) {
    setRating(getRating)
  }


  if (!productDetails) {
    return <div></div>; // Show a loading message if necessary
  }
  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            className: 'bg-red-600 text-white'
          });

          return;
        }
      }
    }
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        toast({ title: 'added to cart successfully ✔', className: 'bg-green-500 text-white !important' })
        dispatch(fetchCartItems(user?.id));

      }

    })
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails())
    setRating(0)
    setReviewMsg('')
  }
  function handleAddReview() {
    dispatch(addReview({
      productId: productDetails?._id,
      userId: user?.id,
      userName: user?.userName,
      reviewMessage: reviewMsg,
      reviewValue: rating
    })).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("")
        dispatch(getReviews(productDetails._id))
        toast({ title: 'Review is submitted successfully ✔', className: 'bg-green-500 text-white !important' })
      }
    }).catch((error) => {
      toast({ id: 'purchase-required', title: 'Please purchase the product to review !!!', className: 'bg-red-500 text-white !important' });
    })
  }


  const averageReview = reviews && reviews.length > 0 ?
    reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
    : 0

  return (
    <Dialog
      open={open}
      onOpenChange={handleDialogClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <DialogContent className="bg-gray-200 p-6 rounded-lg max-w-[100vw] sm:max-w-[80vw] lg:max-w-[75vw] shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-lg shadow-lg flex flex-nowrap">
            <img
              src={productDetails.image}
              alt={productDetails.title}
              width={600}
              height={600}
              className="aspect-square  w-full object-cover rounded-lg border-4 border-gray-300 shadow-md"
            />
          </div>
          <div className="flex flex-col justify-start space-y-2">
            <h1 className="text-3xl font-extrabold">{productDetails.title}</h1>
            <p className="text-muted-foreground text-base">
              {productDetails.description}
            </p>
            <div className="flex items-center space-x-4">
              <p
                className={`text-2xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through" : ""
                  }`}
              >
                ${productDetails.price}
              </p>
              {productDetails?.salePrice > 0 && (
                <p className="text-2xl font-bold text-gray-600">
                  ${productDetails.salePrice}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                <StarRating rating={averageReview} />

              </div>
              <span className="text-muted-foreground">({averageReview.toFixed(2)})</span>
            </div>
            <div className="mt-5 mb-5">
              {
                productDetails?.totalStock === 0 ?
                  <Button className="cursor-not-allowed opacity-60 bg-gray-900 text-white w-full">
                    Out of Stock
                  </Button>
                  :
                  <Button onClick={() => handleAddtoCart(productDetails?._id, productDetails?.totalStock)} className="bg-gray-900 text-white w-full">
                    Add to Cart
                  </Button>
              }

            </div>
            <div className="max-h-[200px] overflow-auto ">
              <h2 className="text-xl font-bold mb-4">Reviews</h2>
              <div className="grid gap-6">
                {
                  reviews && reviews.length > 0 ?
                    reviews.map(reviewItem => <div className="flex gap-4">
                      <Avatar className='w-10 h-10 border'>
                        <AvatarFallback className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white text-lg font-bold leading-none">
                          {reviewItem.userName[0].toUpperCase()}
                        </AvatarFallback>

                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{reviewItem?.userName}</h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRating rating={reviewItem?.reviewValue} />

                        </div>
                        <p className="text-muted-foreground">
                          {reviewItem?.reviewMessage}
                        </p>
                      </div>
                    </div>) : <h1>No reviews yet</h1>
                }
                
              </div>
            </div>


            <div className="mt-4 flex gap-2 border border-black p-2 ">
              <Label>review here</Label>
              <div className="flex">
                <StarRating rating={rating} handleRatingChange={handleRatingChange} />
              </div>
              <Input
                name='reviewMsg' value={reviewMsg} onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write comment..."
                className="bg-green-200 border border-black rounded px-4 py-2 placeholder-black placeholder:font-semibold"
              />
              <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ''} className="bg-gray-800 border border-black text-white font-semibold px-2 py-1  rounded-[8px]">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
