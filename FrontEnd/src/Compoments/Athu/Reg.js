import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import '../../CSS/Athu/Reg.css'
import axios from 'axios'
import swal from "sweetalert2"
import LoadingSpinnerButton from "./LoadingSpinnerButton"
import { useNavigate } from 'react-router-dom';

function Reg() {

    // const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    const [verfiyloading, setVerfiyLoading] = useState(false)
    const [otpSumbitloading, setOtpSumbitloading] = useState(false)
    const [resendloading, setResendbLoading] = useState(false)
    const [sumbitloading, setSubmitLoading] = useState(false)
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
        else if(await emailIdExists())
        {
            setEmailError(true);
            setEmailErrorMsg("Email Id is Already exist")
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

    const validateFirstName = (dataValue) =>{
        setFName(dataValue);
        if(dataValue.length === 0)
        {
            setFNameError(true)
            return false;
        }
        else
        {
            setFNameError(false);
            return true;
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
      
          const jsonData = JSON.stringify(data);
          console.log(jsonData);
          try {
            const response = await axios.post("http://localhost:3000/athu/addUser", jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
      
            if (response.status === 200 ) {
                if(response.data.status === true)
                {
                    swal.fire("Sucesss", "Successfully added", 'success');
                    console.log("User added successfully:", response);
                    navigate('/Login');
                    setSubmitLoading(false)
                }
                else
                {
                    swal.fire("Error", "Something went wrong", 'error');
                    setSubmitLoading(false)
                }
             
            } else {
              console.error("Unexpected response status:", response.status);
              setSubmitLoading(false)
            }
          } catch (error) {
            console.error("Error adding user:", error.message);
            setSubmitLoading(false)
          }
      
          
        } else {
          console.log("Form validation failed");
          setSubmitLoading(false)
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
                        swal.fire("Error", "Something went wrong", 'error');
                    }
                
                } else {
                console.error("Unexpected response status:", response.status);
                }
            } catch (error) {
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
                                 loading={otpSumbitloading} onClick={verfiyOtp} />
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

export default Reg;











// import React, {useState} from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Reg.css'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { FaSadCry } from 'react-icons/fa';

// function Reg() {
//     const [isVisible, setIsVisible] = useState(false);

//   const toggleVisibility = (val) => {
//     setIsVisible(val);
//   };
//     const navigate = useNavigate();
//     const [hasError, setHasError] = useState(false);
//     const [fName, setFName] = useState('');
//     const [lName, setLName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setconfirmPassword] = useState('');
//     const [fNameError, setFNameError] = useState(false);
//     const [lNameError, setLNameError] = useState(false);
//     const [emailError, setEmailError] = useState(false);
//     const [passwordError, setPasswordError] = useState(false);
//     const [confirmPasswordError, setConfirmPasswordError] = useState(false);

//     const validateEmail = (email) => {
//         const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
//         return emailRegex.test(email);
//       };
      
//       const validatePassword = (password) => {
//         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
//         return passwordRegex.test(password);
//       };
      

//     function validate()
//     {
//         const fNameError = fName.trim() === '';
//         const lNameError = lName.trim() === '';
//         let emailError ;
//         let passwordError;
//         let confirmPasswordError;
//         if(fNameError)
//         {
//             toggleVisibility(true);
//             document.getElementById('statusMessage').innerText = "Enter First Name";
//             return false;
//         }
//         else if(lNameError)
//         {
//             toggleVisibility(true);
//             document.getElementById('statusMessage').innerText = "Enter Last Name";
//             return false;
//         }
//         else if(email.trim()==='')
//         {
//             toggleVisibility(true);
//             document.getElementById('statusMessage').innerText = "Enter Email";
//             emailError = true;
//             return false;
//         }
//         else if(!validateEmail(email))
//         {
//             toggleVisibility(true);
//             emailError = true;
//             document.getElementById('statusMessage').innerText = "Email formate is incorrect";
//             return false;
//         }
//         else 
//         {
//             var val;
//             const name = email;
//             const type = "email";
//             const tableName = "userLogin";
            

//             axios.post('http://localhost:8087/checkExists', {name, type, tableName }).then(res => 
//             {
//                 const sts = res.data.status;
//                 console.log(val)
//                 if(sts == 'error')
//                 {
//                     console.log("gone inside")
//                     toggleVisibility(true);
//                     emailError = true;
//                     document.getElementById('statusMessage').innerText = "Email alredy exists";
//                     setHasError(true)
//                     console.log("error1  " + hasError)
//                 }
//             }).catch(err => 
//             {
//                 console.log(err)
//                 setHasError(true)
//             }
//         );
        
//         if (hasError) {
//             return false; // Exit the function if there's an error
//           }
//         }
//         if(!validatePassword(password))
//         {
//             passwordError = true;
//             confirmPasswordError = true
//             toggleVisibility(true);
//             document.getElementById('statusMessage').innerText = "Password should be 8 charcters, Atleast ! Captipal letter and digit";
//             return false;
//         }
//         else if(password !== confirmPassword)
//         {
//             confirmPasswordError = true;
//             toggleVisibility(true);
//             document.getElementById('statusMessage').innerText = "Password Matched";
//             return false;
//         }
                
//         setFNameError(fNameError);
//         setLNameError(lNameError);
//         setEmailError(emailError);
//         setPasswordError(passwordError);
//         setConfirmPasswordError(confirmPasswordError);
            
//         return true;
//     }

//     function handleSubmit(event)
//     {
//         //if(validate() === true)
//         {
//             event.preventDefault();
//             axios.post('http://localhost:8087/register', {fName, lName, email, password}).then(res => 
//                 {
//                     console.log(res.data)
//                     if (res.data.status === 'Success') 
//                     {
//                         toggleVisibility(false);
//                         navigate('/Login');
//                     }
//                     else
//                     {
//                         toggleVisibility(true);
//                         document.getElementById('statusMessage').innerText = res.data;
//                     }
                    
//                 })
//                 .catch(err => console.log(err));
//         }
//         event.preventDefault();
//     }


//   return (
//     <div className='reg'>
//         <div className='container'>
//             <div className='row'>
//                 <div className='col-md-4 offset-md-4 form login-form'>
//                     <form autoComplete='' onSubmit={handleSubmit}> 
//                         <h2 className='text-center'>Login Form</h2>
//                         <p className='text-center'> Register with UserName and Password</p>
                        
//                <p className="alert alert-danger text-center" id='statusMessage' hidden={!isVisible}></p>

//                         <div className="form-group pad">
//                             <input className={`form-control ${fNameError ? 'inputError' : ''}`} type="text"placeholder="First Name" onChange={e => {
//                                 const { value } = e.target;
//                                 setFName(value);
//                             }}/>
//                         </div>
//                         <div className="form-group pad">
//                         <input
//                             className={`form-control ${lNameError ? 'inputError' : ''}`}
//                             type="text"
//                             placeholder="Last Name"
//                             onChange={e => {
//                                 const { value } = e.target;
//                                 setLName(value);
//                             }}
//                             />
//                         </div>
//                         <div className='form-group pad'>
//                         <input
//                             className={`form-control ${emailError ? 'inputError' : ''}`}
//                             type="text"
//                             placeholder="Email ID"
//                             onChange={e => {
//                                 const { value } = e.target;
//                                 setEmail(value);
//                             }}
//                             />
//                         </div>
//                         <div className="form-group pad">
//                         <input
//                             className={`form-control ${passwordError ? 'inputError' : ''}`}
//                             type="password"
//                             placeholder="Password"
//                             onChange={e => {
//                                 const { value } = e.target;
//                                 setPassword(value);
//                             }}
//                             />
//                         </div>
//                         <div className="form-group pad">
//                         <input
//                             className={`form-control ${confirmPasswordError ? 'inputError' : ''}`}
//                             type="password"
//                             placeholder="Confirm Password"
//                             onChange={e => {
//                                 const { value } = e.target;
//                                 setconfirmPassword(value);
//                             }}
//                             />
//                         </div>
//                         <div className="form-group pad">
//                         <input className="form-control button" type="submit" name="login" value="Login" />
//                     </div>
//                         <div className="link login-link text-center">Will you like to go back?? <Link to="/Login">Click here</Link>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default Reg;