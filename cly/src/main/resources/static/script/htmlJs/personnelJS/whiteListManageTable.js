var whiteListManageTable = '    <thead>  \
                          <tr>\
                              <th width="5%" rowspan="2"><input type="checkbox" class="icheckbox"></th>  \
                              <th rowspan="2" width="8%" >人员姓名</th>  \
                              <th rowspan="2" width="18%">身份证号码</th>  \
                              <th rowspan="2" width="10%">所属群体</th>  \
                              <th rowspan="2" width="10%">群体细类</th>  \
                              <th colspan="4" width="30%">人员细类</th>  \
                              <th rowspan="2">加入白名单时间</th>  \
                              <th rowspan="2">操作人</th>  \
                        </tr>\
                           <tr>  \
                              <th>细类1</th>  \
                              <th>细类2</th>  \
                              <th>细类3</th>  \
                              <th>细类4</th>  \
                        </tr>\
                      </thead>\
                      <tbody>               \
                         <tr>\
                              <td><input type="checkbox" class="icheckbox"></td>  \
                              <td>张三</td>  \
                              <td>110101189201137643</td>  \
                              <td>社会群体访</td>  \
                              <td>E租宝</td>  \
                              <td>细类1</td>  \
                              <td>细类2</td>  \
                              <td>细类3</td>  \
                              <td>细类4</td>  \
                              <td>2017年8月11日</td>  \
                              <td>李梅</td>  \
                     </tr> \
                   </tbody>'  

$('.whiteListManageTable').html(whiteListManageTable) 

dtTable($('.whiteListManageTable'))                 