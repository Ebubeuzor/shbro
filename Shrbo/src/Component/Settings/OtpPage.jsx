import React, { useState, useEffect } from 'react';

const OTPPage = ({ resendOtp, onClose, verifyOtp, isVerified, isLoading, error }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(20);
  const [isResendActive, setIsResendActive] = useState(false);



  useEffect(() => {
    let timer;
    if (countdown > 0 && isResendActive) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsResendActive(true);
    }

    return () => clearTimeout(timer);
  }, [countdown, isResendActive]);

  const handleInputChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move to the next input field or focus on the previous input field
    if (index < 5 && value !== '') {
      document.getElementById(`otp-input-${index + 1}`).focus();
    } else if (index > 0 && value === '') {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }

    // If the last digit is cleared, set focus to the last but one input field
    if (index === 5 && value === '') {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }

    // If all digits are cleared, set focus to the first input field
    if (index === 0 && value === '') {
      document.getElementById(`otp-input-${index}`).focus();
    }

    // If all digits are entered, initiate verification
    if (index === 5 && value !== '') {
      verifyOtp(newOtp);
      setOtp(['', '', '', '', '', '']);
    }
  };

  const handleResendClick = () => {
    resendOtp();
    setCountdown(20);
    setIsResendActive(false);
  };

  const handleGoBackHome = () => {
    onClose();
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className='mx-auto p-4 flex flex-col gap-10 '>
      <div>
        < h1 className="text-2xl font-bold">Verification code</h1>
        <p className="mt-2 text-gray-600">
          We sent you a code to verify your phone number. Please check your messages and enter the code below.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full ">

        <div className="flex space-x-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-10 h-10 text-center border rounded focus:outline-none focus:border-orange-400"
            />
          ))}
          
        </div>
        {isLoading ? (
          <div className=' w-full flex justify-center pr-16  '>

            <div className='   '>
              <div className="containerM  ">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>

        ) : (
          <>
            {isVerified ? (
              <div className="mb-4">
                <span className="text-green-500">Verified!</span>
                <button
                  onClick={handleGoBackHome}
                  className="ml-4 bg-orange-500 text-white px-4 py-2 rounded"
                >
                  close
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <label className=' text-red-600' >{error}</label>
                <br />
                {countdown > 0 ? (
                  <div className=' w-full flex items-center justify-center'>

                    <span className="text-gray-500">{`Resend OTP in ${countdown} seconds`}</span>
                  </div>
                ) : (<div className=' w-full flex items-center justify-center'>
                  <label>Didn't get a code?</label>

                  <button
                    onClick={handleResendClick}
                    className={` text-orange-500 ml-2 x-4 py-2 rounded ${isResendActive ? 'active' : 'cursor-not-allowed'
                      }`}
                    disabled={!isResendActive}
                  >
                    Resend OTP
                  </button>
                </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default OTPPage;
