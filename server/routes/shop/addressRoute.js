const express=require('express')
const { addAddress, deleteAddress, editAddress, fetchAllAddress } = require('../../controllers/ShoppingControllers/addressController')

const router = express.Router()

router.post('/add',addAddress)
router.get('/get/:userId',fetchAllAddress)
router.delete('/delete/:userId/:addressId',deleteAddress)
router.put('/update/:userId/:addressId',editAddress)

module.exports=router