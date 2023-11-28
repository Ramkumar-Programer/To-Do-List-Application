import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import '../../CSS/Athu/Reg.css'
import axios from 'axios'
import swal from "sweetalert2"
import LoadingSpinnerButton from "./LoadingSpinnerButton"
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [emailErrorMsg, setEmailErrorMsg] = useState('');
    const [passwordErrorMsg, setPasswordErrorMsg] = useState('')

    const [passwordVisible, setPasswordVisible] = useState(false);

    const [sumbitloading, setSumbitLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    const validateEmailId = async () =>{
        if(email.length === 0)
        {
            setEmailError(true);
            setEmailErrorMsg("Email is required")
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
        if(dataValue.length === 0)
        {
            setPasswordError(true);
            setPasswordErrorMsg("Password is required")
        }
        else
        {
            setPasswordError(false);
        }
    };

    const formOnSubmitHandle = async () => {
        
        setSumbitLoading(true);

        validateEmailId(email);
        validatePassword(password);
      
        if (!emailError && !passwordError) {
          const data = {
            email_id: email,
            password: password
          };
      
          const jsonData = JSON.stringify(data);
          //console.log(jsonData);
          try {
            const response = await axios.post("http://localhost:3000/athu/login", jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
      
            if (response.status === 200 ) {
                //console.log(response.data)
                if(response.data.status === true)
                {
                    swal.fire("Sucesss", "Successfully added", 'success');
                    console.log("User added successfully:", response.data);
                    setSumbitLoading(false);
                    const token = response.data.token;
                    console.log(response.data.token)

                    localStorage.setItem('token', token);
                    
                    navigate('/Board');
                }
                else if(response.data.status === false && response.data.message === "Password" )
                {
                    setPasswordErrorMsg("Incorrect Password")
                    setPasswordError(true)
                    setSumbitLoading(false);
                }
                else if(response.data.status === false && response.data.message === "Email" )
                {
                    setEmailErrorMsg("Email not exists")
                    setEmailError(true)
                    setSumbitLoading(false);
                }
             
            } else {
              console.error("Unexpected response status:", response.status);
              setSumbitLoading(false);
            }
          } catch (error) {
            console.error("Error adding user:", error.message);
            setSumbitLoading(false);
          }

      
          
        } else {
          console.log("Form validation failed");
        }
      };
      


return (
    <div className='reg'>

        <div className='loginForm'>

                <p className='titleOne'>Sigin Form</p>
                <p className='titleTwo'>Enter the Mail Id and password</p>


                <div className='divInputBox'>
                    <input
                    onBlur={validateEmailId}
                        className={`inputValue ${emailError ? 'inputError' : ''}`}
                        type="text"
                        placeholder="Email ID"
                        onChange={e => {
                            setEmail(e.target.value);
                        }}
                    />
                    
                    {emailError && <p className='textError'>{emailErrorMsg}</p>} 
                </div>

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
                    {passwordError && <p className='textError'>{passwordErrorMsg}</p>}
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
                    Forgot password? <Link to="/ForgotPassword">Click here</Link>
                </div>
                <div className="loginLink">
                    Are you a new user? <Link to="/Register">Sign In</Link>
                </div>

        </div>

    </div>
  )
}

export default Login;