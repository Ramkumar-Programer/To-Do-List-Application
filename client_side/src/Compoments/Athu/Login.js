import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Reg.css'
import axios from 'axios'
import { Link } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = (val) => {
      setIsVisible(val);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(email);
      };
      
      const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
      };


    function handleSubmit(event)
    {
        
        console.log("enter")
        event.preventDefault();
        axios.post('http://localhost:8087/login', {email, password}).then(res => 
        {
            console.log(res.data)
            document.getElementById('statusMessage').innerText = res.data.message;
            if (res.data.status === 'Success') 
            {
                const username = res.data.name;
                const tableListName = res.data.tableListName;
                console.log(tableListName)
                const tableCardName = res.data.tableCardName;
                console.log("it vcame inside")
                navigate('/Board', { state: { username , tableListName, tableCardName} });
            }
            toggleVisibility(true)
            
        })
        .catch(err => console.log(err));
        
    }

  return (
    <div className='reg'>
        <div className='container'>
            <div className='row'>
                <div className='col-md-4 offset-md-4 form login-form'>
                    <form onSubmit={handleSubmit}> 
                        <h2 className='text-center'>Login Form</h2>
                        <p className='text-center'> Login with UserName and Password</p>
                        <p className="alert alert-danger text-center" id='statusMessage' hidden={!isVisible}></p>
                        <div className='form-group pad'>
                            <input className='form-control' type='text' placeholder='User name' onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group pad">
                            <input className="form-control" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className="form-group pad">
                            <input className="form-control button" type="submit" name="login" value="Login" />
                        </div>
                        <div className="link login-link text-center">Forgot password? 
                            <Link to="/ForgotPassword">Click here</Link>
                        </div>
                        <div className="link login-link text-center">Are you a new user? 
                            <Link to="/Register">Sign In</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login;