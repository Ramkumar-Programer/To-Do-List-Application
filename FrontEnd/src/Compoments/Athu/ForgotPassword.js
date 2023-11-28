import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import '../../CSS/Athu/Reg.css'
import axios from 'axios'
import swal from "sweetalert2"
import LoadingSpinnerButton from "./LoadingSpinnerButton"
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {

  const navigate = useNavigate();

    const [verfiyloading, setVerfiyLoading] = useState(false)
    const [otpSumbitloading, setOtpSumbitloading] = useState(false)
    const [resendloading, setResendbLoading] = useState(false)
    const [sumbitloading, setSubmitLoading] = useState(false)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');


  const [otpError, setOtpError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState([])

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [otp, setOtp] = useState('');
  const [optVerfiyOn, setOptVerfiyOn] = useState(false);

  const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
  };

  const emailIdExists = async () => {
      try {
        const response = await axios.post("http://localhost:3000/athu/emailIdExists", {email_id: email}, {
              headers: {
                  'Content-Type': 'application/json',
              }
        });

        if( response.data.exists)
        {
          return true;
        }
        else
        {
          return false;
        }
      } catch (error) {
        console.error("Error checking email ID existence:", error.message);
      }
    };
    

  const validateEmailId = async () =>{
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      const emailIdExistsOrNot = await emailIdExists()
      if(email.length === 0)
      {
          setEmailError(true);
          setEmailErrorMsg("Email is required")
          return false;
      }
      else if(emailRegex.test(email) === false)
      {
          setEmailError(true);
          setEmailErrorMsg("Invaild email id")
          return false;
      }
      else if(!emailIdExistsOrNot)
      {
          setEmailError(true);
          setEmailErrorMsg("Email Id is Does not exist")
          return false;
      }
      else
      {
          setEmailError(false);
          return true;
      }
  }

  const validatePassword = (dataValue) => {
      // Reset the password error state
      setPassword(dataValue);
      setPasswordError(false);
    
      // Password validation criteria
      const regexUpperCase = /[A-Z]/;
      const regexLowerCase = /[a-z]/;
      const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
      const regexDigit = /[0-9]/;

      const err = ["Password is empty", 
      "Atleast 1 [A-Z]",
      "Atleast 8 character", 
      "Atleast 1 [a-z]", 
      "Atleast 1 special character", 
      "Atleast 1 [0-9]"]
    
      // Individual validation checks
      const errors = err.map((errorMsg, index) => {
        switch (index) {
          case 0:
            return dataValue.length === 0 ? errorMsg : '';
          case 1:
            return !regexUpperCase.test(dataValue) ? errorMsg : '';
          case 2:
            return dataValue.length < 8 ? errorMsg : '';
          case 3:
            return !regexLowerCase.test(dataValue) ? errorMsg : '';
          case 4:
            return !regexSpecialChar.test(dataValue) ? errorMsg : '';
          case 5:
            return !regexDigit.test(dataValue) ? errorMsg : '';
          default:
            return '';
        }
      });
    
      // Update the password error state based on validation results
      
      setPasswordError(errors.some((error) => error !== ''));
      
      // Update the password error messages
      setPasswordErrorMsg(errors);
      if(confirmPassword !== '')
      {
          dataValue === confirmPassword ? setConfirmPasswordError(false) : setConfirmPasswordError(true)
      }
      return !(errors.some((error) => error !== ''));
  };
  
  const validateConfirmPassword = (dataValue) =>{
      setconfirmPassword(dataValue);
      if(dataValue === password)
      { 
          setConfirmPasswordError(false)
          return true;
      }  
      else
      {
          setConfirmPasswordError(true);
          return false;
      }
  }


  const mailIdVerfied = () =>{

      if(!otpError)
      {
          setEmailError(true);
          setEmailErrorMsg("Email is not verfied")
          return false;
      }
      else
      {
          setEmailError(false);
          return true;
      }
  }

  const formOnSubmitHandle = async () => {

    setSubmitLoading(true);

      const data1 = await validateEmailId(email);
      const data2 = await validatePassword(password);
      const data3 = await validateConfirmPassword(confirmPassword);


      if(data1)
      {
          var data4 = await mailIdVerfied()
      }
      
      
      
    
      if (data1 && data2 && data3 && data4) {
        const data = {
          email_id: email,
          password: password
        };
    
        const jsonData = JSON.stringify(data);
        console.log(jsonData);
        try {
          const response = await axios.post("http://localhost:3000/athu/forgotPassword", jsonData, {
              headers: {
                  'Content-Type': 'application/json',
              },
          });
    
          if (response.status === 200 ) {
              if(response.data.status === true)
              {
                setSubmitLoading(false)
                  swal.fire("Sucesss", "Successfully password is changed", 'success');
                  console.log("User added successfully:", response);
                  navigate('/Login');
              }
              else
              {
                setSubmitLoading(false)
                  swal.fire("Error", "Something went wrong", 'error');
              }
           
          } else {
            setSubmitLoading(false)
            console.error("Unexpected response status:", response.status);
          }
        } catch (error) {
            setSubmitLoading(false)
          console.error("Error adding user:", error.message);
        }
    
        
      } else {
        console.log("Form validation failed");
      }
    };
    


    const sendOtp = async () =>
    {
      const data1 = await validateEmailId(email);

      if (data1)
      {
          setVerfiyLoading(true)
          const data = {email_id : email};

          const jsonData = JSON.stringify(data);
          
          try {
              const response = await axios.post("http://localhost:3000/otp/sendOtp", jsonData, {
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });
              console.log(response.data)
              if (response.status === 200 ) {
                  if(response.data.status === true)
                  {
                      swal.fire("Sucesss", "Otp was send to email", 'success');
                      console.log("User added successfully:", response);
                      setVerfiyLoading(false);
                      setOptVerfiyOn(true);
                  }
                  else if(response.data.code === 3)
                  {
                      swal.fire("Sucesss", "Otp was already send to email", 'success');
                      console.log("User added successfully:", response);
                      setVerfiyLoading(false);
                      setOptVerfiyOn(true);
                      
                  }
                  else
                  {
                      setVerfiyLoading(false);
                      swal.fire("Error", "Something went wrong", 'error');
                  }
              
              } else {
              console.error("Unexpected response status:", response.status);
              }
          } catch (error) {
              console.error("Error adding user:", error.message);
          }

      }


    }

    const verfiyOtp = async () => {
        setOtpSumbitloading(true);

      const data = {email_id : email ,otp : otp};

      const jsonData = JSON.stringify(data);
          
          try {
              const response = await axios.post("http://localhost:3000/otp/verfiyOtp", jsonData, {
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });
              console.log(response.data)
              if (response.status === 200 ) {
                  if(response.data.status === true)
                  {
                      swal.fire("Sucesss", "Otp was verfied", 'success');
                      console.log("User added successfully:", response);
                      setOtpError(true);
                      setOtpSumbitloading(false);
                      setOptVerfiyOn(false);
                  }
                  else
                  {
                      setVerfiyLoading(false);
                      setOtpSumbitloading(false)
                      swal.fire("Error", "Something went wrong", 'error');
                  }
              
              } else {
                setOtpSumbitloading(false)
              console.error("Unexpected response status:", response.status);
              }
          } catch (error) {
            setOtpSumbitloading(false)
              console.error("Error adding user:", error.message);
          }

    }

    const resendOtp = async () =>
    {
      const data1 = await validateEmailId(email);

      if (data1)
      {
          setResendbLoading(true)
          const data = {email_id : email};

          const jsonData = JSON.stringify(data);
          
          try {
              const response = await axios.post("http://localhost:3000/otp/reSendOtp", jsonData, {
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });
              console.log(response.data)
              if (response.status === 200 ) {
                  if(response.data.status === true)
                  {
                      swal.fire("Sucesss", "Otp was send to email", 'success');
                      console.log("User added successfully:", response);
                      setResendbLoading(false)
                      setOptVerfiyOn(true);
                  }
                  else if(response.data.code === 3)
                  {
                      swal.fire("Sucesss", "Otp was already send to email", 'success');
                      console.log("User added successfully:", response);
                      setResendbLoading(false);
                      setOptVerfiyOn(true);
                      
                  }
                  else
                  {
                      setVerfiyLoading(false);
                      swal.fire("Error", "Something went wrong", 'error');
                  }
              
              } else {
              console.error("Unexpected response status:", response.status);
              }
          } catch (error) {
              console.error("Error adding user:", error.message);
          }

      }


    }
  
    const cancelButton = async () => {
      
      const data = {email_id : email};
      setOptVerfiyOn(false);
      const jsonData = JSON.stringify(data);
          
      try {
           await axios.post("http://localhost:3000/otp/deleteOtp", jsonData, {
              headers: {
                  'Content-Type': 'application/json',
                  },
          });
          } catch (error) {
              console.error("Error adding user:", error.message);
          }

      }


  return (
    <div className='reg'>

        <div className='loginForm'>

                <p className='titleOne'>Login Form</p>
                <p className='titleTwo'>Enter the Details</p>

                <div className='divInputBox'>
                    <div className='email'>
                        <input
                        onBlur={validateEmailId}
                            className={`inputValueEmail ${emailError ? 'inputError' : ''}`}
                            type="text"
                            placeholder="Email ID"
                            onChange={e => {
                                setEmail(e.target.value);
                            }}
                        />
                        {
                            !optVerfiyOn ? (
                                <LoadingSpinnerButton title={' Verify '} 
                                className = "loading"
                                mame = "verfiyOpt"
                                 loading={verfiyloading} onClick={sendOtp} />
                                
                            ) : (
                                <input
                                type="submit"
                                value=" Cancel "
                                className="verfiyOpt"
                                onClick={cancelButton}
                                />
                            )
                        }
                    </div>
                    
                    {emailError && <p className='textError'>{emailErrorMsg}</p>} 
                </div>
                {
                    optVerfiyOn && <div className="divInputBox  otp">
                    <input 
                        className={`inputValueOTP ${otpError ? 'inputError' : ''}`} 
                        type="text"
                        placeholder="OTP" 
                        onChange={e =>{ 
                            setOtp(e.target.value);
                            }
                        }
                    />
                    {/* <input type = "submit" value="Submit" className="verfiyOptSumbit" /> */}
                    <LoadingSpinnerButton title={' Submit '} 
                                mame = "verfiyOptSumbit"
                                 loading={otpSumbitloading} onClick={verfiyOtp} />
                    <LoadingSpinnerButton title={' Resend '} 
                                mame = "verfiyOptCancel"
                                 loading={resendloading} onClick={resendOtp} />
                    {/* <input type = "submit" value="Resend" className="verfiyOptCancel" onClick={verfiyOptButton}/> */}
                    {otpError && <p className='textError'>First name is required</p>}  
                </div>
                }
                

                <div className="divInputBox">
                    <input
                        onBlur={() => validatePassword(password)}
                        className={`inputValue ${passwordError ? 'inputError' : ''}`}
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Password"
                        onChange={e => {
                            validatePassword(e.target.value)
                        }}
                    />
                    <div className='passwordErrorMsgList'>
                        {passwordError &&
                            passwordErrorMsg.map((data, i) => (
                                data !== '' && 
                                <p key={i} className='textError'>
                                {data}
                                </p> 
                            ))
                        }
                    </div> 
                </div>

                <div className="divInputBox">
                    <input
                    onBlur={() => {validateConfirmPassword(confirmPassword)}}
                        className={`inputValue ${confirmPasswordError ? 'inputError' : ''}`}
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        onChange={e => {
                            validateConfirmPassword(e.target.value);
                        }}
                    />
                   {confirmPasswordError && <p className='textError'>Password Not Matched</p>} 
                </div>
                <div className='checkBox'>
                    <input
                        type="checkbox"
                        onChange={togglePasswordVisibility}
                        checked={passwordVisible}
                    /><span className='title'>Show Password</span>
                </div>
                <div className="divInputBox">
                <LoadingSpinnerButton title={' Login '} 
                                mame = "inputValueSubmit"
                                 loading={sumbitloading} onClick={formOnSubmitHandle} />
                    {/* <input className="inputValue button" type="submit" value="Login" onClick={formOnSubmitHandle}/> */}
                </div>
                
                <div className="loginLink">
                    Will you like to go back??     <Link to="/Login">Click here</Link>
                </div>

        </div>

    </div>
  )
}

export default ForgotPassword