import React, { useState } from 'react';
import "../../CSS/Board/PopUp.css";
import axios from 'axios'
import LoadingSpinnerButton from "../Athu/LoadingSpinnerButton"

function PopUp({ trigger, type, id, cancel , list}) {

  const [name, setName] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [popUpSumbitloading, setPopUpSumbitloading] = useState(false)

  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem('token');

  const popUpSubmit = async () => {
    setPopUpSumbitloading(true)
    
    if(name.trim().length === 0)
    {
        setErrorMsg("Enter the name")
        setIsVisible(true);
        setPopUpSumbitloading(false)
        return;
    }
    else
    {
        try {
            var data;
            if(type === "List")
            {
                data = {
                    list_name : name,
                    type : "list"
                };
            }
            else
            {
                data = {
                    list_id : id,
                    card_name : name,
                    type : "card"
                };
            }
          
            const jsonData = JSON.stringify(data);

            const response = await axios.post("http://localhost:3000/Board/checkIfExistsName", jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                    'token' : token
                },
            });

            if (response.status === 200 ) {
                console.log(response.data)
                if(response.data.status === true)
                {
                    setPopUpSumbitloading(false);
                    list(prevList => [
                        ...prevList,
                        { list_name: name, cards : [] }
                    ]);
                    cancel(false)
                }
                else if(response.data.status === false )
                {
                    setErrorMsg("Name already exists")
                    setPopUpSumbitloading(false);
                }
             
            } else {
              console.error("Unexpected response status:", response.status);
              setPopUpSumbitloading(false)
            }
            
        } 
        catch (error) {
            setPopUpSumbitloading(false)
        }
    }
  };

  return trigger ? (
    <div className='popUp'>
      <div className='form'>
        <button className='cancel-btn' onClick={() => cancel(false)}>X</button>
        {
            isVisible && <p className='errorStatus'>{errorMsg}</p>
        }
        
        <p className='popUpTitile'>Enter the {type} Name {id}</p>
        <input type='text' onChange={(e) => setName(e.target.value)} /><br />
        <LoadingSpinnerButton title={' Submit '} 
                                mame = "submit-btn"
                                 loading={popUpSumbitloading} onClick={popUpSubmit} />
        {/* <button className='submit-btn' onClick={popUpSubmit}>Enter</button> */}
      </div>
    </div>
  ) : "";
}

export default PopUp;
