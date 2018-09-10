var trackDataImportTable = ' <thead>  \
	                              <tr>  \
	                              <th width="5%"><input type="checkbox" class="icheckbox"></th>  \
	                              <th width="10%">编号</th>  \
	                              <th width="10%">导入时间</th>  \
	                              <th width="10%">导入数据类型</th>  \
	                              <th width="10%">导入原文件</th>  \
	                              <th width="10%">日志文件</th>  \
	                              </tr>  \
                             </thead>  \
                \
                        <tbody>               \
		                         <tr>  \
		                              <td><input type="checkbox" class="icheckbox"></td>  \
		                              <td>1</td>  \
		                              <td>2017年8月23日 14:25</td>  \
		                              <td>外卖数据</td>  \
		                              <td>XXXXX.xls</td>  \
		                              <td>XXXXX.xls</td>  \
		                         </tr>                                         \
                        </tbody>'

$('.trackDataImportTable').html(trackDataImportTable) 

dtTable($('.trackDataImportTable'))               