module.exports=(err,req,next,res)=>{
    console.error(err);
  res.status(err.status || 500).json({
    error:true,
    message:err.message || 'Internal Server Error'
  });
    
};