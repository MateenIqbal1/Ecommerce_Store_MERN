import ProductDetails from "@/components/shopping-view/ProductDetails"
import ProductTile from "@/components/shopping-view/ProductTile"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import { fetchProductDetails } from "@/store/shop/products-slice"
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"

function SearchProducts() {
    const [keyword, setKeyword] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const [openDetailsDialog , setOpenDetailsDialog] = useState(false)
    const dispatch = useDispatch()
    const { toast } = useToast()
    const { searchResults } = useSelector(state => state.shopSearch)
    const { user } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.shopCart)
    const { productDetails } = useSelector(state => state.shopProducts)

    useEffect(() => {
        if (keyword && keyword.trim() !== '' && keyword.trim().length >= 3) {
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
                dispatch(getSearchResults(keyword))
            }, 1000)
        } else {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
            dispatch(resetSearchResults())
        }
    }, [keyword])

    function handleAddtoCart(getCurrentProductId, getTotalStock) {
        console.log(cartItems, 'these are cart items');
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
                dispatch(fetchCartItems(user?.id));
                toast({ title: 'added to cart successfully ✔', className: 'bg-green-600 text-white !important' })


            }

        })
    }

    function handleGetProductDetails(getCurrentProductId){
        console.log(getCurrentProductId)
        dispatch(fetchProductDetails(getCurrentProductId))
      }
     
    useEffect(()=>{
        if(productDetails !==null)setOpenDetailsDialog(true)
      },[productDetails])

    return (
        <div className="container mx-auto md:px-6 px-4 py-8 ">
            <div className="flex justify-center mb-8">
                <div className="w-full flex items-center ">
                    <Input className='py-6'
                        value={keyword}
                        name="keyword" onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Search Products..."
                    />
                </div>
            </div>
            {
                !searchResults.length ? <h3 className="text-5xl font-extrabold">No results found!!</h3> : null
            }

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {

                    searchResults.map(item => <ProductTile handleAddtoCart={handleAddtoCart} product={item} handleGetProductDetails={handleGetProductDetails}/>)

                }
            </div>
            <ProductDetails open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails}/>

        </div>
    )
}
export default SearchProducts