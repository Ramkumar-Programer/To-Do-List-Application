import React, {useState, useEffect} from 'react'
//import Pop from './pop'
import '../../CSS/Board/List.css'
//import Card from './Card'
import axios from 'axios'
//import { useDrop } from 'react-dnd';
//import { ItemTypes } from './ItemTypes';
import { FaEdit, FaTimes, FaCheck} from 'react-icons/fa';
import PopUp from './PopUp';

function List({data}) {

  const [editMode, setEditMode] = useState(false);
  const [newListName, setNewListName] = useState(data.list_name);
  const [cardName, setCardName] = useState('')
  const[errMsg, setErrorMsg] = useState('');
  const [cardbtnPopup, setCardbtnPopup] = useState(false);
  //const[isVisible ,setIsVisible] = useState(false)
  
  const editName = () => {
    setEditMode(true);
  };

  const handleCancelEditName = () => {
    setEditMode(false);
    setNewListName(data.list_name);
    setErrorMsg('');
  };

  const handleListNameChange = (e) => {
    setNewListName(e.target.value);
  };

  const handleSaveEditName = async () =>{

    if(newListName.trim().length === 0)
    {
        setErrorMsg("Enter the name")
       // setIsVisible(true);
        return;
    }
    else
    {
        try {
          data = {
            list_name : newListName,
            type : "list"
          };
          
          const jsonData = JSON.stringify(data);

          const response = await axios.post("http://localhost:3000/Board/checkIfExistsName", jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                    'token' : localStorage.getItem('token')
                },
            });
            console.log(response.data)
            if (response.status === 200 ) {
                console.log(response.data)
                if(response.data.status === true)
                {
                  data.list_name = newListName;
                  setErrorMsg('');
                  setEditMode(false);
                }
                else if(response.data.status === false )
                {
                    setErrorMsg("Name already exists")
                   // setIsVisible(true);
                }
             
            } else {
              console.error("Unexpected response status:", response.status);
              //setIsVisible(false);
            }
            
        } 
        catch (error) {
           console.log(error)
        }
    }

    
  }

  const addCard = () => {
    setCardbtnPopup(true)
  }

  return (
    
    <div>
      {/* <Pop trigger={cardbtnPopup} addList ={addCard} type = {"Card"} tableName={tableName} id={data.listId}/> */}
      <PopUp trigger={cardbtnPopup} cancel={setCardbtnPopup} type={"Card"} list = {data}/>
      <div className='listComponent'>
      <div className='listTop'>
      <div className={`listNameContainer ${editMode ? 'editMode' : ''}`}>
        {editMode ? (
          <>
            <input
              type="text"
              value={newListName}
              onChange={handleListNameChange}
              className="listNameEditInput"
            />
            <FaTimes className="editLogo cancelEdit"  onClick={handleCancelEditName}/>
            <FaCheck className="editLogo saveEdit" onClick={handleSaveEditName} />
            <p className='errorMsg'>{errMsg}</p>
          </>
        ) : (
          <>
            <p className="listName" >
            <FaEdit className="editModeIcon" onClick={editName}/>{newListName}
            </p>
            <div className='line'></div>
          </>
        )}
      </div>  
      <button className='listCancel' >X</button><br/>
      <button className='AddCard' onClick={addCard}>Add Card</button>
      </div>
      <div className='allCards'>
      {data.cards.map((cardData, i)=>{
        return(
            //<Card className='allList' cardData={cardData} deleteCard={()=>deleteCard(cardData)} modifyCardContent={modifyCardContent} listId={data.listId} tableCardName={tableName}/> 
            <p>cdc</p>
            )}
      )}
      </div>
    </div>
    </div>
    
  );
}

export default List;