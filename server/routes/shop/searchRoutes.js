const express=require('express')
const { searchProducts } = require('../../controllers/ShoppingControllers/searchController');


const router=express.Router();


router.get('/:keyword', searchProducts)

module.exports = router;
