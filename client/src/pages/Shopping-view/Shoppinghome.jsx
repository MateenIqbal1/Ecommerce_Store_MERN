import React, { useEffect, useState } from 'react';
import bannerOne from '../../assets/bannerOne.webp';
import bannerTwo from '../../assets/bannerTwo.webp';
import bannerThree from '../../assets/bannerThree.webp';
import { Button } from '@/components/ui/button';
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice';
import ProductTile from '@/components/shopping-view/ProductTile';
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { useToast } from '@/hooks/use-toast';
import ProductDetails from '@/components/shopping-view/ProductDetails';


const Shoppinghome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [ bannerTwo, bannerThree,bannerTwo];
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const { productList ,productDetails} = useSelector(state => state.shopProducts)
  const {user}=useSelector((state)=>state.auth)
  const {toast}=useToast()
  const [openDetailsDialog,setOpenDetailsDialog]=useState(false)


  function handleNavigateToListingPage(getCurrentItem , section){
    sessionStorage.removeItem('filters');
    const currentFilter={
      [section]:[getCurrentItem.id]
    }
     sessionStorage.setItem('filters',JSON.stringify(currentFilter))
     navigate(`/shop/listing`)
  }
  function handleGetProductDetails(getCurrentProductId){
    console.log('this is cureent product id ',getCurrentProductId)
    dispatch(fetchProductDetails(getCurrentProductId))
  }


  function handleAddtoCart(getCurrentProductId){
    console.log("this is latest id add to cart",getCurrentProductId)
    dispatch(addToCart({userId:user?.id , productId:getCurrentProductId, quantity:1})).then((data)=>{
      if(data?.payload?.success){
        dispatch(fetchCartItems(user?.id));
        toast({ title: 'added to cart successfully ✔', className: 'bg-green-500 text-white !important' })

      }
        
    })
  }


  useEffect(()=>{
    if(productDetails !==null)setOpenDetailsDialog(true)
  },[productDetails])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }))
  }, [])

  const categoriesWithIcon = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
  ];
   
 const  brandsWithIcon= [
    { id: "nike", label: "Nike" ,icon:Shirt },
    { id: "adidas", label: "Adidas" ,icon:WashingMachine},
    { id: "puma", label: "Puma" ,icon:ShoppingBasket},
    { id: "levi", label: "Levi's" ,icon:Airplay},
    { id: "zara", label: "Zara" ,icon:Images},
    { id: "h&m", label: "H&M" ,icon:Heater},
  ];
  

  return (
    <div className="flex flex-col min-h-screen w-full mx-0 px-0">
      {/* Slider Section */}
      <div className="relative w-full h-[190px] md:h-[350px] lg:h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          />
        ))}

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex justify-between items-center z-20 pointer-events-none">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)
            }
            className="pointer-events-auto bg-black/35 text-white hover:bg-black/50 transition duration-200"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
            }
            className="pointer-events-auto bg-black/35 text-white hover:bg-black/50 transition duration-200"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="w-full mx-0 px-0">
          <h2 className="text-3xl font-bold font-serif text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card onClick={()=>handleNavigateToListingPage(categoryItem ,'category')} key={categoryItem.id} className="cursor-pointer border border-black bg-[#BC8F8F] text-black hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
       
      <section className="py-12 bg-gray-50">
        <div className="w-full mx-0 px-0">
          <h2 className="text-3xl font-bold font-serif text-center mb-8">Shop by Brands</h2>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card onClick={()=>handleNavigateToListingPage(brandItem ,'brand')} key={brandItem.id} className="cursor-pointer bg-[#BC8F8F] border border-black text-black hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='py-12'>
        <div className="w-full mx-0 px-0">
          <h2 className="text-3xl font-bold font-serif text-center mb-8">Featured products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {
              productList && productList.length > 0 ?
              productList.map(productItem=> <ProductTile handleGetProductDetails={handleGetProductDetails} product={productItem} handleAddtoCart={handleAddtoCart}/>)
              :null
            }
          </div>
        </div>
      </section>
      <ProductDetails open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails}/>

    </div>
  );
};

export default Shoppinghome;
