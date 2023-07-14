const { decode } = require("base-64");

module.exports.checkKeyService = async (req, res, next) => {
  try {
    const key = req.query.key;
    console.log(key)
    const decoded = await decode(key);
    console.log(key);
     console.log(decoded);
    if (
      decoded === process.env.KEY_USER_SERVICE ||
      decoded === process.env.KEY_USER_ORDER ||
      decoded === process.env.KEY_TABLE_SERVICE ||
      decoded === process.env.KEY_PRODUCT_SERVICE
    ) {
      
         next();
    }else{
        return res.json({
           status: false,
            message: "Key not valid!",
     
         });
    }
   
  } catch (err) {
    console.log(err);
  
  }
};