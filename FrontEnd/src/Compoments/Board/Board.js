import React, { useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import '../../CSS/Board/Board.css'
import List from './List'
//import Pop from './pop'
//import { DndProvider } from 'react-dnd';
//import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import defaultProfilePhoto from '../../Assests/defaultProfilePhoto.png'
import PopUp from './PopUp';
import LoadingSpinnerButton from "../Athu/LoadingSpinnerButton"

function Board() {
  const navigate = useNavigate();
  const location = useLocation();

  const  [list, setList] =useState([]);
  const [btnPopup, setbtnPopup] = useState(false);
  const [userName, setUsername] = useState('')
  const [token, setToken] = useState('')
  const [sumbitloading, setSumbitloading] = useState(false)

  const [listName, setListName] = useState('');

  const [showMenu, setShowMenu] = useState(false);

  const handleProfilePhotoHover = () => {
    setShowMenu(true);
  };

  const handleMenuClose = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    fetchData()
  }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axios.post('http://localhost:8087/fetchDatas', {tableListName, tableCardName});
//       try {
//         const fetchedData = JSON.parse(response.data);
//         setList(fetchedData);
//       } catch (error) {
//         console.log('Error parsing JSON data:', error);
//         setList([]);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };


//   const addList = (name, setIsVisible, id) =>{
//     console.log("inside addlist")
//     console.log(setIsVisible)
//     const type = "listName";
//     if(name =="-1")
//     {
//       console.log(name)
//       console.log(type)
//       setbtnPopup(false);
//       setIsVisible(false)
//       return
//     }
//     const tableName = tableListName;
//     if(name != "")
//     {
//       axios.post('http://localhost:8087/addVal', {name, tableName, type}).then(res =>console.log(res.data).catch(err=>console.log(err)));
//       setbtnPopup(false);
//       fetchData();
//     }
//   }
//   const deleteList = (data) =>{
//     const listId = data.listId;
//     const listName = data.listName;
//     const type = "List"
//     console.log("came inside deleteList")
//     axios.post('http://localhost:8087/removeVal', {tableListName ,listId, listName, type}).then(res => console.log(res.data).catch(err => console.log(err)));
//     fetchData();
//   }

//   const logout = () =>
//   {
//     const newState = {
//       ...location.state,
//       username: null,
//       tableListName: null,
//       tableCardName: null,
//     };

//     // Redirect to the login page with the cleared state
//     navigate('/Login', newState)
//   }

      const fetchData = async () => {
          try {
            const storedToken = localStorage.getItem('token');

            //console.log(storedToken)
            if(storedToken === null)
            {
              navigate('/')
            }
            const response = await axios.get("http://localhost:3000/Board", {
              headers: {
                  'token': storedToken,
              },
          });

          if (response.status === 200 )
          {
            setUsername(response.data)
            setToken(storedToken);
          }
          else
          {
            navigate('/Login')
          }

          } 
          catch (error) {
            navigate('/Login')
          }
      }
  
      const logout = () => {
        setToken('');
        localStorage.removeItem('token');
        navigate('/')
      }

      const addNewList = async () => {
        setbtnPopup(true)
      }

      const submitAll = () => {
          console.log(list)
      }

  return (
      <div className='Board'>
        <div className='topBoard '>

            <div className='boardTitle'>To DO List Application</div>

            <div className='usernameLogout'>
                <p className='name'>{userName}</p>
                <img
                    src={defaultProfilePhoto}
                    className='defaultProfilePhoto'
                    alt='Profile'
                    onMouseEnter={handleProfilePhotoHover}
                    onMouseLeave={handleMenuClose}
                  />
                  {showMenu && (
                    <div className='menu' onMouseLeave={handleMenuClose} onMouseEnter={handleProfilePhotoHover}>
                      <div className='username'>{userName}</div>
                      <button className='logout' onClick={logout}>(Logout)</button>
                    </div>
                  )}
            </div>


        </div>
        <div className='buttons'>
            <LoadingSpinnerButton title={' Submit All '} 
                                mame = "AddListButton"
                                 loading={sumbitloading}  onClick={submitAll}/>
            <button className='AddListButton' onClick={addNewList}>Add List</button>
        </div>
        
       
       
        <div className='allList'>
          {list.map((value, i)=>{
            //console.log(value)
            return(
              
              <List className='List' data = {value} key={i}/>
              
            )
          })}
        </div>
          <PopUp trigger={btnPopup} cancel={setbtnPopup} type={"List"} token = {token} list = {setList}/>
      </div>
  );
}

export default Board;