import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import AxiosApi from '../AxiosAPI';
import { toast } from 'react-toastify';




const ViewCupon = () => {


    const DummyCouponData = [
        {
          code: 'SAVE20',
          discountAmount: '20%',
          expirationDate: '2024-06-30',
        },
        {
          code: 'GET50OFF',
          discountAmount: '50%',
          expirationDate: '2024-07-15',
        },
        {
          code: 'FREESHIP',
          discountAmount: '10%',
          expirationDate: '2024-05-31',
        },
      ];

   const [data ,setdata] = useState([]);


   const gettingcuppon =async () =>{
    try{
      const res = await  AxiosApi.get('/admin/cupon');
      console.log(res);
      setdata(res.data.cupon)


    }catch(error){
      console.log(error)
      toast.error(error.response.data.message)
    }
   };

   useEffect(()=>{
    gettingcuppon()
   },[])


  return (
    <div className="w-full overflow-hidden ml-6 mt-11">
      <Link to='/layout/add-coupon' className=' text-sm font-serif border p-1 bg-blue-400  text-white mb-4 rounded-xl' >Add Cuppon</Link>
    <table className="w-full whitespace-nowrap">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2">#</th>
          <th className="px-4 py-2">Coupon Code</th>
          <th className="px-4 py-2">Discount Amount</th>
          <th className="px-4 py-2">Expiration Date</th>
        </tr>
      </thead>
      <tbody>
        {data && data.map((coupon, index) => (
          <tr key={index} className="bg-white">
            <td className="border px-4 py-2">{index + 1}</td>
            <td className="border px-4 py-2">{coupon.code}</td>
            <td className="border px-4 py-2">{coupon.discountAmount}</td>
            <td className="border px-4 py-2">{coupon.Validity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default ViewCupon
