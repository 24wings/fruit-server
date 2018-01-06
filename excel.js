var nodeExcel = require('excel-export');
let fs = require('fs');
let path =require('path');
/**
 * 导出excel
 * @param _headers example  [
 {caption:'用户状态',type:'string'},
 {caption:'部门',type:'string'},
 {caption:'姓名',type:'string'},
 {caption:'邮箱',type:'string'},
 {caption:'有效期',type:'string'},
 {caption:'身份',type:'string'}];
 * @param rows example 
 [['未激活','信息部','testname','123@qq.com','2019-11-09','管理员'],
 ['未激活','信息部','testname2','12345@qq.com','2019-11-09','普通成员']]
 */
let exportExcel = function(_headers,rows){
    var conf ={};
    conf.name = "mysheet";
    conf.cols = [];
    for(var i = 0; i < _headers.length; i++){
        var col = {};
        col.caption = _headers[i];
        col.type = 'string';
        conf.cols.push(col);
    }
    conf.rows = rows;
    var result = nodeExcel.execute(conf);
    return result;
}

exports.toExcel=async(req,res)=>{
    let {_headers,rows}=req.body;
    if(rows){rows=JSON.parse(rows)};
    
    if(!_headers) _headers=['订单时间','订单发起人','订单货品','订单数量','订单状态'];
    if(!rows) rows=[ ['11','21','31','41','51']],
   console.log(rows);

//    rows.forEach(row=>{
//         if(row.createDt){
//             row.createDt= new Date(row.createDt).toLocaleString()
//         }
//         });
    
        
    console.log(_headers,rows);
    var result = exportExcel(_headers,rows);
    // fs.writeFileSync(path.resolve(__dirname,'../../public/test.xlsx'),result);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "test.xlsx");
        res.end(result, 'binary');
}
