
export const emailIdExists = async (email) => {
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
  

export const validateEmailId = async (email, setEmailError, setEmailErrorMsg) =>{
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
    else if(await emailIdExists(email))
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

export const validatePassword = (dataValue, setPasswordError, setPasswordErrorMsg, setConfirmPasswordError) => {
    // Reset the password error state
    //setPassword(dataValue);
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

export const validateConfirmPassword = (dataValue, setConfirmPasswordError) =>{
    //setconfirmPassword(dataValue);
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

export const validateFirstName = (dataValue, setFNameError) =>{
    //setFName(dataValue);
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