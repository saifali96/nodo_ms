const { CustomerRepository } = require("../database");
const { CustomerModel } = require("../database/models");
const { FormatData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors')


// All Business logic will be here
class CustomerService {

	constructor(){
		this.repository = new CustomerRepository();
	}

	async SignIn(userInputs){

		const { email, password } = userInputs;
		
		try {
			
			const existingCustomer = await this.repository.FindCustomer({ email });

			if(existingCustomer){
			
				const validPassword = await ValidatePassword(password, existingCustomer.password);
				
				if(validPassword){
					const token = await GenerateSignature({ email, _id: existingCustomer._id});
					return FormatData({ id: existingCustomer._id, token });
				} 
			}
	
			return FormatData(null);

		} catch (err) {
			throw new APIError("Unable to login user.", err);
		}

	   
	}

	async SignUp(userInputs){
		
		const { email, password, phone } = userInputs;
		
		try{

			const userPassword = await GeneratePassword(password);
			
			const isExisting = await CustomerModel.findOne({ email });

			if(isExisting) {
				throw new BadRequestError("User exists already.");
			}

			const createCustomer = await this.repository.CreateCustomer({ email, password: userPassword, phone });
			// TODO - Check if customer is created or not.
			const token = await GenerateSignature({ email, _id: createCustomer._id});

			return FormatData({ id: createCustomer._id, token });

		} catch (err){
			throw new APIError('Unable to signup user.', err)
		}

	}

	async AddNewAddress(_id,userInputs){
		
		const { street, postalCode, city,country} = userInputs;
		
		try {
			const addressResult = await this.repository.CreateAddress({ _id, street, postalCode, city,country})
			return FormatData(addressResult);
			
		} catch (err) {
			throw new APIError('Data Not found', err)
		}
		
	
	}

	async GetProfile(id){

		try {
			const existingCustomer = await this.repository.FindCustomerById({id});
			return FormatData(existingCustomer);
			
		} catch (err) {
			throw new APIError('Data Not found', err)
		}
	}

	async GetShoppingDetails(id){

		try {
			const existingCustomer = await this.repository.FindCustomerById({id});
	
			if(existingCustomer){
			   return FormatData(existingCustomer);
			}       
			return FormatData({ msg: 'Error'});
			
		} catch (err) {
			throw new APIError('Data Not found', err)
		}
	}

	async GetWishList(customerId){

		try {
			const wishListItems = await this.repository.Wishlist(customerId);
			return FormatData(wishListItems);
		} catch (err) {
			throw new APIError('Data Not found', err)           
		}
	}

	async AddToWishlist(customerId, product){
		try {
			const wishlistResult = await this.repository.AddWishlistItem(customerId, product);        
		   return FormatData(wishlistResult);
	
		} catch (err) {
			throw new APIError('Data Not found', err)
		}
	}

	async ManageCart(customerId, product, qty, isRemove){
		try {
			const cartResult = await this.repository.AddCartItem(customerId, product, qty, isRemove);        
			return FormatData(cartResult);
		} catch (err) {
			throw new APIError('Data Not found', err)
		}
	}

	async ManageOrder(customerId, order){
		try {
			const orderResult = await this.repository.AddOrderToProfile(customerId, order);
			return FormatData(orderResult);
		} catch (err) {
			throw new APIError('Data Not found', err)
		}
	}

	async SubscribeEvents(payload){
 
		const { event, data } =  payload;

		const { userId, product, order, qty } = data;

		switch(event){
			case 'ADD_TO_WISHLIST':
			case 'REMOVE_FROM_WISHLIST':
				this.AddToWishlist(userId,product)
				break;
			case 'ADD_TO_CART':
				this.ManageCart(userId,product, qty, false);
				break;
			case 'REMOVE_FROM_CART':
				this.ManageCart(userId,product,qty, true);
				break;
			case 'CREATE_ORDER':
				this.ManageOrder(userId,order);
				break;
			case "TEST_EVENT":
				console.log("++++ EVENT FIRED ++++")
				break;
			default:
				break;
		}
 
	}

}

module.exports = CustomerService;