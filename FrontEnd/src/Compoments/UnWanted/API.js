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
            }
            else
            {
                swal.fire("Error", "Something went wrong", 'error');
            }
         
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } catch (error) {
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
    setSubmitLoading(true);

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
                    setSubmitLoading(false);
                    setOptVerfiyOn(false);
                }
                else if(response.data.code === 3)
                {
                    swal.fire("Sucesss", "Otp was already send to email", 'success');
                    console.log("User added successfully:", response);
                    setOtpError(true);
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


import axios from 'axios'
import swal from "sweetalert2"

const register = ["Sucessfully Register"];

const hostName = "http://localhost:3000/";

export const apiController = async (url, type, jsonData, loading1, loading2) => 
{
    try {
        const response = await axios.post(hostName+url, jsonData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const message = response.data.message;

        if (response.status === 200 ) {
            if(response.data.status === true)
            {
                swal.fire("Sucesss", {message}, 'success');
                console.log("User added successfully:", response);
                // loading1(false)
                // loading2(true);
                return true;
            }
            else
            {
                //loading1(false);
                swal.fire("Error", {message}, 'error');
                return false;
            }
        
        } else {
        console.error("Unexpected response status:", response.status);
        }
    } catch (error) {
        console.error("Error adding user:", error.message);
    }
}