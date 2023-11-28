import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import '../../CSS/Athu/Reg.css'
import axios from 'axios'
import swal from "sweetalert2"
import LoadingSpinnerButton from "../Athu/LoadingSpinnerButton"
import { useNavigate } from 'react-router-dom';

function Reg() {

    // const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    const [verfiyloading, setVerfiyLoading] = useState(false)
    const [sumbitloading, setSubmitLoading] = useState(false)
    const [resendloading, setResendbLoading] = useState(false)
    // const toggleVisibility = (val) => {
    //     setIsVisible(val);
    //   };

    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');


    const [fNameError, setFNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [otpError, setOtpError] = useState(false)
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
        const data1 = await validateFirstName(fName);
        const data2 = await validateEmailId(email);
        const data3 = await validatePassword(password);
        const data4 = await validateConfirmPassword(confirmPassword);

        if(data2)
        {
            var data5 = await mailIdVerfied()
        }
        if (data1 && data2 && data3 && data4 && data5) {
          const data = {
            first_name: fName,
            last_name: lName,
            email_id: email,
            password: password
          };
      
      
          
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
            

        }


      }

      const verfiyOtp = async () => {
        setSubmitLoading(true);

        const data = {email_id : email ,otp : otp};

        const jsonData = JSON.stringify(data);
            

      }

      const resendOtp = async () =>
      {
        const data1 = await validateEmailId(email);

        if (data1)
        {
            setResendbLoading(true)
            const data = {email_id : email};

            const jsonData = JSON.stringify(data);
            

        }


      }
    
      const cancelButton = async () => {
        
        const data = {email_id : email};
        setOptVerfiyOn(false);
        const jsonData = JSON.stringify(data);
            

        }

return (
    <div className='reg'>

        <div className='loginForm'>

                <p className='titleOne'>Login Form</p>
                <p className='titleTwo'>Enter the Details</p>

                <div className="divInputBox">
                    <input 
                    onBlur={()=> validateFirstName(fName)}
                        className={`inputValue ${fNameError ? 'inputError' : ''}`} 
                        type="text"
                        placeholder="First Name" 
                        onChange={e =>{ 
                            validateFirstName(e.target.value);
                            }
                        }
                    />
                    {fNameError && <p className='textError'>First name is required</p>}  
                </div>

                <div className="divInputBox">
                    <input
                        className="inputValue"
                        type="text"
                        placeholder="Last Name"
                        onChange={e => {
                            setLName(e.target.value);
                        }}
                    />
                    
                </div>

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
                        className={`inputValueOTP ${fNameError ? 'inputError' : ''}`} 
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
                                 loading={sumbitloading} onClick={verfiyOtp} />
                    <LoadingSpinnerButton title={' Resend '} 
                                mame = "verfiyOptCancel"
                                 loading={resendloading} onClick={resendOtp} />
                    {/* <input type = "submit" value="Resend" className="verfiyOptCancel" onClick={verfiyOptButton}/> */}
                    {fNameError && <p className='textError'>First name is required</p>}  
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
                    <input className="inputValue button" type="submit" value="Login" onClick={formOnSubmitHandle}/>
                </div>
                
                <div className="loginLink">
                    Will you like to go back??     <Link to="/Login">Click here</Link>
                </div>

        </div>

    </div>
  )
}

export default Reg;

