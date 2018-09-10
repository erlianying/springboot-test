var importLogsTable = '     <thead>  \
                                <tr>  \
                                    <th width="5%"><input type="checkbox" class="icheckbox"></th>  \
                                    <th width="10%">编号</th>  \
                                    <th width="20%">导入开始时间</th>  \
                                    <th width="20%">导入结束时间</th>  \
                                    <th width="22%">导入原始文件</th>  \
                                    <th>导入日志文件</th>  \
                              </tr>  \
                            </thead>  \
                      \
                            <tbody>               \
                               <tr>  \
                                    <td><input type="checkbox" class="icheckbox"></td>  \
                                    <td>1</td>  \
                                    <td>2017年8月5日 14:00</td>  \
                                    <td>2017年8月6日 14:00</td>  \
                                    <td><a href="#">XXXX.xls</a></td>  \
                                    <td><a href="#">XXXX.xls</a></td>  \
                           </tr>                       \
                         </tbody>'  

$('.importLogsTable').html(importLogsTable) 

dtTable($('.importLogsTable'))                 