import React, {useState} from 'react'
import './Card.css'
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import axios from 'axios'

import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
function Card({cardData,deleteCard, modifyCardContent, listId, tableCardName}) {
 const [isVisible, setIsVisible] = useState(false);
 
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };


  const [editMode, setEditMode] = useState(false);
  const [newListName, setNewListName] = useState(cardData.cardName);
  
  const handleListNameClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setNewListName(cardData.cardName);
  };

  const handleSaveClick = () => {
    // Perform save/update logic here
    // For example, call an API to update the list name in the database
    if (newListName.trim() === '') {
      // Empty string validation
      alert("List name is empty")
      return;
    }
    setEditMode(false);
    cardData.cardName = newListName; // Update the list name in the data object
    const name = newListName;
    const id = cardData.cardId;
    const tableName = tableCardName;
    const type = "card"
    axios.post('http://localhost:8087/modifyName', { tableName, id, name, type}).then(res => console.log(res.data).catch(err => console.log(err)));
  };

  const handleListNameChange = (e) => {
    setNewListName(e.target.value);
  };

  const [textareaValue, setTextareaValue] = useState(cardData.cardContent);
  
  const handleTextareaChange = (event) => {
    console.log(event.target.value)
    setTextareaValue(event.target.value);
  };
  const handleTextareaBlur = () => {
    console.log('Textarea value:', textareaValue);
    const type = "cardContent";
    modifyCardContent(cardData,type, textareaValue);
  };

    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.CARD,
      item: { cardData, listId: listId }, // Pass the card data and the list ID to the drag source
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

  return (
    <div ref={drag} className="Card" style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div className='topCard'>
            <span className='plusMinus' onClick={toggleVisibility}>{isVisible ? '-' : '+'}</span>
            <div className={`cardNameContainer ${editMode ? 'editMode' : ''}`}>
        {editMode ? (
          <>
            <input
              type="text"
              value={newListName}
              onChange={handleListNameChange}
              className="cardNameEditInput"
            />
            <FaTimes className="card editLogo cancelEdit" onClick={handleCancelClick} />
            <FaCheck className="card editLogo saveEdit" onClick={handleSaveClick} />
          </>
        ) : (
          <>
            <p className='cardTitle' onClick={handleListNameClick}>
            <FaEdit className="editModeIcon" />{cardData.cardName}
            </p>
          </>
        )}
            </div>  
            
            <button className='cancelCard' onClick={deleteCard} >X</button>
        </div>
        <div className='cardContent'>
            <textarea className='text' hidden={!isVisible} onChange={handleTextareaChange} onBlur={handleTextareaBlur} value={textareaValue}/>
        </div>
    </div>
  )
}

export default Card;