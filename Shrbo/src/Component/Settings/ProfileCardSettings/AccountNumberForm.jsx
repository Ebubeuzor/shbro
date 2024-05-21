import React, { useState,useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { styles } from '../../ChatBot/Style';
import { Select } from 'antd';
import axios from '../../../Axios'


const AccountNumberForm = ({ Submit, close, loading,banks}) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [fullName, setFullName] = useState('');
  const [loadingName, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (value) => {
    setBankName(value);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };


  const filterOption = (input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase());



  useEffect(() => {
    const fetchUserInfo = async () => {
      setFullName("");
      try {
        if (!(accountNumber.trim().length===10) || !bankName.trim()) {
          setError('Bank Name and Account Number are required.');
          return;
        }

        setLoading(true);

        const response = await axios.get(`/getUserInfoByAccountNumber/${accountNumber}/${bankName}`);
        const newErrors = {
          accountNumber: '',
          bankName: '',
          fullName: '',
        };

        if(response.data.account_name){
          setFullName(response.data.account_name);
          setErrors(newErrors);
          
        }else{
          newErrors.fullName = "Could'nt find a name linked to this account";
          setErrors(newErrors)
          
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setError('Error fetching user info. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchUserInfo, 500);

    return () => clearTimeout(debounceTimeout);
  }, [bankName, accountNumber]);


  const handleAccountNumberChange = (e) => {
    let inputAccountNumber = e.target.value;

    // Use regex to remove non-numeric characters
    inputAccountNumber = inputAccountNumber.replace(/[^0-9]/g, '');

    // Use regex to limit to exactly 10 digits
    inputAccountNumber = inputAccountNumber.substring(0, 10);

    setAccountNumber(inputAccountNumber);
  };


  const handleCancel = () => {
    setAccountNumber('');
    setBankName('');
    setFullName("");

    close(false);
  };


  const [errors, setErrors] = useState({
    accountNumber: '',
    bankName: '',
    fullName: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic
    let isValid = true;
    const newErrors = {
      accountNumber: '',
      bankName: '',
      fullName: '',
    };

    // Validate account number using regex
    const accountNumberRegex = /^[0-9]+$/;
    if (!accountNumber.trim() || !accountNumber.match(accountNumberRegex)) {
      newErrors.accountNumber = 'Please enter a valid account number with only numeric characters.';
      isValid = false;
    }

    if (!bankName.trim()) {
      newErrors.bankName = 'Bank Name is required';
      isValid = false;
    }

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      Submit({ accountNumber, bankName, fullName });
      console.log('Submitted:', { accountNumber, bankName, fullName });
    }
  };

  return (
    <div className='bg-gray-100  flex justify-center items-center'>
      <div
        className="transition-3"
        style={{
          ...styles.loadingDiv,
          ...{
            zIndex: loading ? '10' : '-1',
            display: loading ? "block" : "none",
            opacity: loading ? '0.33' : '0',
          }
        }}

      />
      <LoadingOutlined
        className="transition-3"
        style={{
          ...styles.loadingIcon,
          ...{
            zIndex: loading ? '10' : '-1',
            display: loading ? "block" : "none",
            opacity: loading ? '1' : '0',
            fontSize: '42px',
            top: 'calc(50% - 41px)',
            left: 'calc(50% - 41px)',


          }


        }}
      />
      <div className="max-w-md mx-auto mt-6 mb-4 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6">Bank Account Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="accountNumber" className="block text-sm font-semibold mb-2">
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              placeholder='000-00000-0000'
              value={accountNumber}
              onChange={handleAccountNumberChange}
              className={`w-full p-2 border ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none `}
              required
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="bankName" className="block text-sm font-semibold mb-2">
              Bank Name
            </label>

            <Select
              showSearch
              placeholder="Select a Bank"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              style={{
                width: '100%',
              }}
              options={[
                ...banks
              ]}
            />
            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="fullName" className=" gap-2 text-sm font-semibold mb-2 flex">
              Full Name
            {loadingName&& <LoadingOutlined
        className={`transition-3 text-orange-500 text-base ${loadingName?" opacity-75":"opacity-0"} `}
      />}
            </label>
            <input
              type="text"
              id="fullName"
              readOnly
              value={fullName}
              placeholder='Mohammed Adamu Charles'
              className={`w-full p-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none `}
              required
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
          {error&& <p className="text-red-500 text-sm mt-1">{error}</p>}
          <div className=' flex gap-2'>
            <button
              type="submit"
              disabled={loadingName}
              className="bg-orange-500 w-full text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="border  w-full text-slate-800 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountNumberForm;
