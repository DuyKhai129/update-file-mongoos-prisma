const { PrismaClient } = require("@prisma/client");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const { Console } = require("console");
const prisma = new PrismaClient();
const customerController = {
  //UpLoad File
  upload: async (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      console.log(files);
      var oldPath = files.file.filepath;
      console.log(files.file.originalFilename);
      var newPath =
        path.join(__basedir, "/uploads") + "/" + files.file.originalFilename;
      var rawData = fs.readFileSync(oldPath);
      fs.writeFile(newPath, rawData, function (err) {
        if (err) console.log(err);
        return res.send(files);
      });
    });
  },
  //Download File
  download: async (req, res) => {
    const fileName = req.params.filename;
    const directoryPath = __basedir + "/uploads" + "/";
    res.download(directoryPath + fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  },
  //ADD
  addCustomer: async (req, res, next) => {
    try {
        //upload file
        let form = formidable({ multiples: false });
        const formFields = new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) {
              reject("error");
              return res.end();
            }
            var oldPath = files.file.filepath;
            var newPath =
              path.join(__basedir, "/uploads") +
              "/" +
              files.file.originalFilename;
            var rawData = fs.readFileSync(oldPath);
            fs.writeFile(newPath, rawData, function (err) {
              if (err) console.log(err);
            });
            resolve({ fields, files });
          });
        });
     // parse data

      const formData = await formFields;
    
      const newCustomer = await prisma.customer.create({
        data: {
            firstName: formData.fields.firstName,
            lastName: formData.fields.lastName,
            phoneNumber: formData.fields.phoneNumber,
            email: formData.fields.email,
            fileName: formData.files.file.originalFilename,
        },
      });
      Console.log("NEW CUSTOMER", newCustomer);
      res.status(200).json({
        status: "success",
        message: "Create customer Success!",
        Response: newCustomer,
      });
    } catch (err) {
      next(err);
    }
  },

  //edit
  editCustomer: async (req, res, next) => {
    try {
      //upload file
      let form = formidable({ multiples: false });
      const formFields = new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            reject("error");
            return res.end();
          }
          var oldPath = files.file.filepath;
          var newPath =
            path.join(__basedir, "/uploads") +
            "/" +
            files.file.originalFilename;
          var rawData = fs.readFileSync(oldPath);
          fs.writeFile(newPath, rawData, function (err) {
            if (err) console.log(err);
          });
          resolve({ fields, files });
        });
      });

      const [firstCustomer] = await prisma.customer.findMany();
      const formData = await formFields;
      const updateCustomer = await prisma.customer.update({
        where: {
          id: firstCustomer.id,
        },
        data: {
          firstName: formData.fields.firstName,
          lastName: formData.fields.lastName,
          phoneNumber: formData.fields.phoneNumber,
          email: formData.fields.email,
          fileName: formData.files.file.originalFilename,
        },
      });
      console.log(updateCustomer);
      res.status(200).json({
        status: "success",
        message: "Update customer Success!",
        Response: updateCustomer,
      });
    } catch (err) {
      // res.status(500).json(err);
      next(err);
    }
  },
  //delete
  deleteCustomer: async (req, res, next) => {
    try {
      const [firstCustomer] = await prisma.customer.findMany();
      const deleteCustomer = await prisma.customer.delete({
        where: {
          id: firstCustomer.id,
        },
      });
      res.status(200).json({
        status: "success",
        message: "Delete customer Success!",
        Response: deleteCustomer,
      });
    } catch (err) {
      next(err);
    }
  },

  //GET ALL
  getAllCustomer: async (req, res, next) => {
    try {
      const customer = await prisma.customer.findMany();
      res.status(200).json({
        message: "success",
        Response: customer,
      });
      console.log(customer);
    } catch (err) {
      next(err);
    }
  },
};
module.exports = customerController;
