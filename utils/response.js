exports.success =(message,data=null)=>({
    error:false,
    message,
    data
});

exports.error =(message)=>({
    error: true,
    message
})