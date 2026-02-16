var express = require('express');
var router = express.Router();
var con=require('../config/config');
let {checkAdmin} = require("../middlewares/checkAdmin")


/* GET home page. */
router.get('/',(req,res)=>{
res.render('admin/homeIndex')
})
router.get('/login',(req,res)=>{
  res.render('admin/adminlogin')
  })

router.get('/home', function(req, res, next) {
  var sql="select * from product"
  if(req.session.user){
    con.query(sql,(err,result)=>{
      if(err){
        console.log(err)
      }
      else{
        console.log(result)
        res.render('admin/index',{result});
      }
    })
  }else{
    res.redirect('/login');
  }

  
});
router.get('/about', function(req, res, next) {
  const product = 
  [{
    name:"iphone",
    img:"https://d28i4xct2kl5lp.cloudfront.net/product_images/134107_cf06013b-7953-4cba-940e-3b0e1c0542f9.jpg",
    dis:" a product by apple"
  },
  {
    name:"iphon x",
    img:"https://d1eh9yux7w8iql.cloudfront.net/product_images/None_32e767de-b206-4f60-a4ca-b22f51f29d8c.jpg",
    dis:" a product by apple"
  },{
    name:"iphon x",
    img:"https://d1eh9yux7w8iql.cloudfront.net/product_images/None_32e767de-b206-4f60-a4ca-b22f51f29d8c.jpg",
    dis:" a product by apple"
  },
  {
    name:"iphon x",
    img:"https://d1eh9yux7w8iql.cloudfront.net/product_images/None_32e767de-b206-4f60-a4ca-b22f51f29d8c.jpg",
    dis:" a product by apple"
  }
  ]
  res.render('about',{product});
});
router.get('/addProduct',function(req,res){
  res.render('admin/addProduct')
})

router.post('/addProduct',function(req,res){
var image_name;
if(!req.files) return res.status(400).send("no files were uploaded.");

var file=req.files.uploaded_image;
var image_name = file.name;
let sql="INSERT INTO product SET ?";

console.log(file)
console.log(image_name);
if(file.mimetype =="image/jpeg" || file.mimetype =="image/png" || file.mimetype =="image/gif"
){
  file.mv("public/images/product/"+file.name,function(err){
    if(err) return res.status(500).send(err);
    console.log(image_name);

let data={
 
  Product_name:req.body.name,
  Description:req.body.description,
  Price:req.body.price,
  Image:image_name,
}; 
console.log(data)
con.query(sql,data,(err,result)=>{
  if(err){
    console.log(err)
  }else{
    res.redirect('/home')
  }
})
}) 
} 
})
router.get('/sellers',checkAdmin,(req,res)=>{
  sql = "select * from seller"
  con.query(sql,(err,result)=>{
    if(err){
      console.log(err)
  }else{
    console.log(result)
    res.render('admin/sellers',{seller:result,homepage:true})
  }
  })
})


router.get('/userlist',checkAdmin,(req,res)=>{
  sql = "select * from user"
  con.query(sql,(err,result)=>{
    if(err){
      console.log(err)
  }else{
    console.log(result)
    res.render('admin/user',{user:result,homepage:true})
  }
  })
})

router.get('/Blocke_sellers',checkAdmin,(req,res)=>{
  sql = "select * from seller where status = 'blocked'"
  con.query(sql,(err,result)=>{
    if(err){
      console.log(err)
  }else{
    console.log(result)
    res.render('admin/blocked',{seller:result,homepage:true})
  }
  })
})
router.get('/block/:id',checkAdmin,(req,res)=>{
  var id = req.params.id;
  sql = "update seller set status = 'blocked' where id = ?"
  con.query(sql,[id],(err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.render('admin/blocked')
    }
  })
})

router.get('/unblock/:id',checkAdmin,(req,res)=>{
  var id = req.params.id;
  sql = "update seller set status = '1' where id = ?"
  con.query(sql,[id],(err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect('/home')
    }
  })
})



router.post('/adminlog',(req,res)=>{
 var username  = req.body.name;
 var pass  = req.body.pass;
  if(pass=="admin" & username == "admin"){
    var data = {
      username,
      pass
    }
    req.session.user=data;
    res.redirect('/home')
  }else{
    res.redirect('/login')
  }
})
router.get('/logout',checkAdmin,(req,res)=>{
      req.session.destroy();
    res.redirect('/')

 
})


router.get('/delete/:id',checkAdmin,(req,res)=>{
  var id = req.params.id;
  sql = "Delete from product where id = ?"
  con.query(sql,[id],(err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect('/home')
    }
  })
})
module.exports = router;

