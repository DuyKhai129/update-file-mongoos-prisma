const customerController = require("../controllers/CustomerController");

const router = require("express").Router();

//GET
router.get("/", customerController.getAllCustomer);

//POST
router.post("/", customerController.addCustomer);

//PUT
router.put("/:id", customerController.editCustomer);

//DELETE
router.delete("/:id", customerController.deleteCustomer);


//upload file
router.post("/uploads", customerController.upload);

//download file
router.get("/download/:filename", customerController.download);

module.exports = router;