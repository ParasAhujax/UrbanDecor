import React, { useEffect, useState } from 'react'
import { formVisitedProps } from '../../../pages/Checkout'
import Cookies from 'js-cookie'
import axios from 'axios'

interface ShippingSectionProps{
    formVisited: formVisitedProps,
    setFormVisited: React.Dispatch<React.SetStateAction<formVisitedProps>>
    isEditSelected: string,
    setIsEditSelected: React.Dispatch<React.SetStateAction<string>>
}
export interface UserAddress{
    name:string,
    lastName:string,
    email:string,
    phone:number,
    street:string,
    city:string,
    landmark:string,
    country:string,
    state:string,
    pincode:number,
}

const ShippingSection:React.FC<ShippingSectionProps> = ({formVisited,setFormVisited,isEditSelected,setIsEditSelected}) => {
    const [formData, setFormData] = useState<UserAddress>({name: '',lastName:'',email: '',phone:0,landmark:'',street:'',city:'',country:'india',state:'',pincode:0});
    const[errorAt,setErrorAt] = useState<string>('');
    const[token,setToken] = useState<string|undefined>('');

    useEffect(()=>{
        function loadData(){
            var cookie = Cookies.get('token');
            setToken(cookie);
            if(cookie){
                axios.get(`/api/user/profile/address`)
                .then(response =>{
                    const userAddress:UserAddress = response.data;

                    const userData = JSON.parse(localStorage.getItem('customerData')||"")

                    userAddress.name = userData.name;
                    userAddress.email = userData.email;
                    userAddress.phone = userData.phone;

                    setFormData(userAddress);

                    if(userAddress.state && userAddress.pincode && userAddress.street && userAddress.city && userAddress.phone && formVisited.shipping===false){
                        localStorage.setItem('shippingData',JSON.stringify(userAddress)); 
                        localStorage.setItem('billingData',JSON.stringify(userAddress));       
                        
                        const allFormVisited = formVisited;
                        allFormVisited.shipping=true;
                        allFormVisited.billing=true;
                        setFormVisited(allFormVisited)
                        setIsEditSelected('payment')         
                    }
                    
                })
                .catch(error=>console.log(error))
                return;
            }
            const customerData = localStorage.getItem('customerData');
            if(customerData){   
                const shippingData = localStorage.getItem('shippingData');
                if(shippingData) {
                    const shippingDataJSON = JSON.parse(shippingData);
                    setFormData(shippingDataJSON)

                    const allFormVisited = formVisited;
                    allFormVisited.customer=true;
                    allFormVisited.shipping=true;
                    allFormVisited.billing=true;
                    setFormVisited(allFormVisited)
                    setIsEditSelected('payment')
                    return;
                }
                const customerDataJSON = JSON.parse(customerData)
                const data = {name: '',lastName:'',email: '',phone:0,landmark:'',street:'',city:'',country:'india',state:'',pincode:0}
                data.name = customerDataJSON.name;
                data.email = customerDataJSON.email;
                setFormData(data);
            }
        }
        loadData();
    },[formVisited,isEditSelected])

    const handleSubmit = (event:any) => {
        event.preventDefault();

        if(formData.email.length === 0){
            setErrorAt('email');
            return;
        } 
        else if(formData.name.length === 0){
            setErrorAt('name');
            return;
        }
        else if(formData.phone.toString().length !== 10){
            setErrorAt('phone');
            return;
        } 
        else if(formData.street.length === 0){
            setErrorAt('address')
            return;
        } 
        else if(formData.country.length ===0){
            setErrorAt('country')
            return;
        } 
        else if(formData.state.length === 0){
            setErrorAt('state');
            return;
        }
        else if(formData.pincode.toString().length !== 6) {
            setErrorAt('pincode');
            return;
        }
        localStorage.setItem('shippingData', JSON.stringify(formData));
        localStorage.setItem('billingData', JSON.stringify(formData));
        const allFormVisited = formVisited;
        allFormVisited.shipping=true;
        allFormVisited.billing=true;
        setFormVisited(allFormVisited)
        setIsEditSelected('payment')

        if(token){
            axios.put('/api/user/profile/address',{
                street:formData.street,
                city:formData.city,
                state:formData.state,
                pincode:formData.pincode,
                landmark:formData.landmark
            })
            .then(()=>{
            })
            .catch(error=>console.log(error))
        }
    }
    function handleFormChange(event:any) {
        setErrorAt('');
        setFormData((prevData) => ({ ...prevData, [event.target.name]: event.target.value }));

    }
    function handleEditClick(){
        setIsEditSelected('shipping');
    }

  return (
    <div id='checkout-shipping' className='w-[55vw] p-[2vw] pr-[0]'>
        <div className="heading-container flex justify-between items-center gap-[1vw]">
            <h1 className="font-futura w-[11vw] text-[1.8vw] uppercase">Shipping</h1>

            {(formVisited.shipping===true && isEditSelected!=='shipping') && (
                <>
                <div className="shipping-details email w-[30vw] text-[0.9vw] font-helvetica">
                    <p className='font-helvetica'>{formData.name} {formData.lastName}</p>
                    
                    <div className="shipping-address w-[]">
                        <p className='font-helvetica'>{formData.street}, {formData.landmark||""}, {formData.city}, {formData.state}, {formData.pincode}, {formData.country}</p>
                    </div>
                </div>
                <button className='w-[3.5vw] h-[1.9vw] font-helvetica text-[0.9vw] ring-1 ring-gray-200 rounded-[20px]' onClick={handleEditClick}>Edit</button>
                </>
            )}
        </div>

        {(isEditSelected=='shipping') && (
        <form onSubmit={handleSubmit} action="">
            <div className="address-container">
                <h1 className="heading my-[2vw] text-[1.5vw] font-helvetica">Shipping Address</h1>

                <div className="address w-[50vw] ">
                    <div className='name flex justify-between items-center gap-[1.5vw]'>
                        
                        <div className='name1 w-[25vw]'>
                            <p className='font-helvetica text-[1vw]'>First Name</p>
                            <input className='px-[0vw] font-helvetica text-[1vw] mb-[1vw] w-[25vw] h-[3vw] border-b-[1px] border-[#848484]' type="text" name='name' value={formData.name||''} onChange={handleFormChange}/>
                            
                            {errorAt==='name' &&(
                                <p className='text-red-500 text-[0.9vw]'>First Name is required</p>
                            )}
                        </div>
                        <div className='name1 w-[25vw]'>
                            <p className='font-helvetica text-[1vw]'>Last Name</p>
                            <input className='px-[0vw] font-helvetica w-[25vw] mb-[1vw] h-[3vw] border-b-[1px] border-[#848484]' type="text" name='lastName'value={formData.lastName||''} onChange={handleFormChange}/>
                        </div>
                    </div>

                    <p className='mt-3 font-helvetica text-[1vw]'>Email</p>
                    <input className='px-[0vw] font-helvetica text-[1vw] w-[52vw] mb-[1vw] h-[3vw] border-b-[1px] border-[#848484]' type="text" name='email' value={formData.email||''} onChange={handleFormChange}/>
                    
                    {errorAt==='email' &&(
                        <p className='text-red-500 text-[0.9vw]'>Email is required</p>
                    )}

                    <p className='mt-3 font-helvetica text-[1vw]'>Phone Number</p>
                    <input className='px-[0vw] font-helvetica text-[1vw] w-[52vw] mb-[1vw] h-[3vw] border-b-[1px] border-[#848484]' type="number" name='phone' value={formData.phone||''} onChange={handleFormChange}/>
                    
                    {errorAt==='phone' &&(
                        <p className='text-red-500 text-[0.9vw]'>Phone Number is required</p>
                    )}

                    <p className='mt-3 font-helvetica text-[1vw]'>Street</p>
                    <input className='px-[0vw] font-helvetica text-[1vw] w-[52vw] mb-[1vw] h-[3vw] border-b-[1px] border-[#848484]' type="text" name='street' value={formData.street||''} onChange={handleFormChange}/>
                    
                    {errorAt==='address' &&(
                        <p className='text-red-500 text-[0.9vw]'>Street is required</p>
                    )}

                    <p className='mt-3 font-helvetica text-[1vw]'>City</p>
                    <input className='px-[0vw] font-helvetica text-[1vw] w-[52vw] mb-[1vw] h-[3vw] border-b-[1px] border-[#848484]' type="text" name='city' value={formData.city||''} onChange={handleFormChange}/>
                    
                    {errorAt==='address' &&(
                        <p className='text-red-500 text-[0.9vw]'>City is required</p>
                    )}

                    <p className='mt-3 font-helvetica text-[1vw]'>Landmark</p>
                    <input className='px-[0vw] font-helvetica text-[1vw] w-[52vw] mb-[1vw] h-[3vw] border-b-[1px] border-[#848484]' type="text" name='landmark' value={formData.landmark||''} onChange={handleFormChange}/>
                    
                    <p className='mt-3 font-helvetica text-[1vw] '>Country</p>
                    <select defaultValue={'india'} className="country w-[52vw] h-[3vw] flex items-center font-helvetica text-[0.9vw] ring-1 ring-gray-200 rounded-[5px] mt-[0.7vw] mb-[1vw] p-[5px] pl-[1vw]" name='country' onChange={handleFormChange} >
                        <option className='font-helvetica' value="">Select a country</option>
                        <option className='font-helvetica' value="india">India</option>
                    </select>
                    <div className='name]'>
                        <div className='name1'>
                            <p className='mt-3 font-helvetica text-[1vw]'>State</p>
                            <input className='px-[0vw] font-helvetica text-[1vw] mb-[1vw] w-[52vw] h-[3vw] border-b-[1px] border-[#848484]' type="text" name='state' value={formData.state||''} onChange={handleFormChange}/>
                            
                            {errorAt==='state' &&(
                                <p className='text-red-500 text-[0.9vw]'>State is required</p>
                            )}
                        </div>
                        <div className='name1'>
                            <p className='mt-3 font-helvetica text-[1vw]'>Postal Code</p>
                            <input className='px-[0vw] font-helvetica text-[1vw] mb-[1vw] w-[52vw] h-[3vw] border-b-[1px] border-[#848484]' type="number" name='pincode'value={formData.pincode||''} onChange={handleFormChange}/>
                            {errorAt==='pincode' &&(
                                <p className='text-red-500 text-[0.9vw]'>Postal Code is required</p>
                            )}
                        </div>
                    </div>
                    
                </div>
            <button className='w-[10vw] h-[2.8vw] text-white rounded-[20px] font-helvetica text-[0.8vw] text-bold mt-[1vw] mr-[3vw] bg-black' onClick={handleSubmit}>CONTINUE</button>
            </div>

        </form>
        )}

    </div>
  )
}

export default ShippingSection