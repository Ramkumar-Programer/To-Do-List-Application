const express = require('express');
const router = express.Router();
const checkToken = require("../Athu/VerifyToken")

const {selectListNameQuery, insertListNameQuery} = require("../../Queries/Board/List")
const {executeQuery} = require('../../Queries/ExcuteQuery');
const dbConfig = require('../../Config/Config');


router.get("/", checkToken, async(req, res) => {
    //console.log(req.body);
    res.send(req.body.tokenData.name);
});


router.post("/checkIfExistsName", checkToken ,async(req, res) => {
    console.log(req.body.list_name);

    try {
        console.log(" --- came into /emailIdExists ---");
        var result;
        if(req.body.type === "list")
        {
            const tableName = req.body.tokenData.TableListName;
            const id = req.body.tokenData.id;
            const name = req.body.list_name; 

            console.log(req.body.tokenData.TableListName);
            console.log(req.body.list_name);
            result = await executeQuery(dbConfig, selectListNameQuery(tableName), [id, name]);
            
        }
        else
        {
            //logic for cards
        }
        
        if (result.length > 0) {
          res.status(200).json({ status: false, message: 'Name exists' });
          console.log(" --- Name exists ---")
        } else {
          
          res.status(200).json({ status: true, message: 'Name does not exist' });
          console.log(" --- Name does not exists ---")
        }
      } catch (error) {
        console.error("EmailId Exists error:", error);
        res.status(500).json("EmailId exists Api is failed");
      }

})


router.post('/addListName', checkToken, async (req, res) => {
  try {

    await executeQuery(dbConfig, insertListNameQuery, [req.body.list_name, data.tokenData.id]);

    res.status(200).json({status : true})
  } catch (error) {
    console.error("Error in /submitAll:", error);
    res.status(500).json({status : false});
  }
})


router.post("/submitAll", checkToken, async (req, res) => {
  try {
    const data = req.body;
    const dataLength = data.length;
    console.log(data);

    for (var index = 0; index < dataLength; index += 1) {
      const list_name = data[index].list_name;
      const cards = data[index].cards

      await executeQuery(dbConfig, insertListNameQuery, [list_name, data.tokenData.id]);

    }

    res.send(data.tokenData);
  } catch (error) {
    console.error("Error in /submitAll:", error);
    res.status(500).send("Internal Server Error");
  }
});




module.exports = router;