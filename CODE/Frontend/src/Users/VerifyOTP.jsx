import React, { useState, useRef } from 'react';
import MainNav from './MainNav';
import AxiosApi from '../AxiosAPI';
import { toast } from 'react-toastify';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    const value = element.target.value;
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Move to next input field if a digit is entered
      if (value !== '' && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (element, index) => {
    if (element.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const handleSubmit = async () => {
    try {
      const otpValue = Number(otp.join('')); // Correctly join the digits into a number

      const response = await AxiosApi.post('/user/verify-otp', {
        email: user?.email,
        otp: otpValue,
      });
      
      toast.success(response.data.message);
      window.location.href = '/login'; // Uncomment to redirect on success
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to verify OTP';
      toast.error(errorMessage);
    }
  };


  const resendotp = async() =>{
    try{
        const res = await AxiosApi.post('/user/resend-otp',{
            email:user.email
        });

        toast.success(res.data.message)

        window.location.reload();

    }catch(error){
        console.log(error)
        toast.error(error.response.data.message)
    }
  }

  return (
    <div className="">
      <MainNav />
      <div className="max-w-screen sm:flex">
        <div className="">
          <img src="/9.png" alt="" className="max-h-screen" />
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Verify Your OTP</h2>
            <p className="text-gray-600 text-center mb-6">Enter the 4-digit code sent to your email</p>
            <div className="flex justify-center space-x-3">
              {otp.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}
            </div>
            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
            >
              Verify OTP
            </button>

            <button onClick={resendotp} className="text-sm text-blue-400 items-center ml-28 mt-2">
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
