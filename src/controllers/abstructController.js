import abstructHelper from "../helpers/abstructHelper.js";


const getAll = async (req, res) => {
  try {
    const items = await abstructHelper.getAll(req.objName);
    res.status(200).json({ items });
   } catch (err) {
     res.status(500).json({ message: `Doslo je do greske getAll abstructController ${req.objName}`, error: err.message });
   }
 };

const getById = async (req, res) => {
  try {
    const item = await abstructHelper.getById( req.objName, req.params.id);
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getById abstructController ${req.objName}`, error: err.message });
  }
};


const getByStext = async (req, res) => {
  try {
    const item = await abstructHelper.getByStext( req.objName, req.params.id);
    res.status(200).json({ item }); 
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getByStext abstructController ${req.objName}`, error: err.message });
  }
};

const add = async (req, res) => {
  try {
    const items = await abstructHelper.add(req.objName, req.body);
    res.status(201).json({ message: `Stavka ${req.objName} je kreirana`, items });
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske add abstructController ${req.objName}:`, error: err.message });
  }
};

const update = async (req, res) => {
  try {   
    const item = await abstructHelper.update(req.objName, req.body);
    if (item) {
    res.status(200).json({ message: `Stavka ${req.objName} uspesno izmenjena`, item });
    } else {
      res.status(201).json({ message: `Broj izmenjenih stavki za ${req.objName} ${item}`, item });
    }
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske update abstructController ${req.objName}: `, error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const item = await abstructHelper.remove(req.objName, req.params.id);
    if (item) {
      res.status(200).json({ message: `Stavka ${req.objName} uspesno obrisana`, item });      
    } else {
      res.status(200).json({ message: `Broj obrisanih stavki za ${req.objName} je ${item}`, item });
    }
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske remove abstructController ${req.objName}: `, error: err.message });
  }
};

/******************************** */
const getItem = async (req, res) => {
  try {
    const item = await abstructHelper.getItem(req.objName, req.objItem, req.params.id);
    res.status(200).json({ item });
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getItem abstructController ${req.objName}`, error: err.message });
  }
};

const getIdByItem = async (req, res) => {
  try {
    const item = await abstructHelper.getIdByItem(req.objName, req.objItem, req.params.value);
    res.status(200).json({item});
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske getItem abstructController ${req.objName}`, error: err.message });
  }
};

const setItem = async (req, res) => {
 try {
    const item = await abstructHelper.setItem(req.objName, req.objItem, req.body);
    if (item) {
      res.status(200).json({ message: "Item uspesno setovan", item });
    } else {
      res.status(200).json({ message: `Broj setovanih stavki za ${req.objName} je ${item}`, item });
    }
  } catch (err) {
    res.status(500).json({ message: `Doslo je do greske setItem abstructController ${req.objName}`, error: err.message });
  }
};

export default {
  add,
  getAll,
  getById,
  getByStext,
  update,
  remove,
  getItem,
  getIdByItem,
  setItem,
};
