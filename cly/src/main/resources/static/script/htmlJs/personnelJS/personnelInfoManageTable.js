var personnelInfoManageTable = '      <thead>  \
                          <tr>  \
                              <th width="5%"><input type="checkbox" class="icheckbox"></th>  \
                              <th width="10%">人员姓名</th>  \
                              <th width="12%">身份证号码</th>  \
                              <th width="10%">省份</th>  \
                              <th width="25%">所属群体及人员细类</th>  \
                              <th width="10%">手机号码</th>  \
                              <th>重点人员</th>  \
                        </tr>  \
                      </thead>  \
                \
                      <tbody>               \
                         <tr>  \
                              <td><input type="checkbox" class="icheckbox"></td>  \
                              <td><a href="#">张三</a></td>  \
                              <td>110104198210230524</td>  \
                              <td>北京</td>  \
                              <td>E租宝（投资人），泛亚群体（公司员工）</td>  \
                              <td>13718352345，13642568970</td>  \
                              <td>重点（E租宝）</td>  \
                     </tr>                                         \
                   </tbody>'  

$('.personnelInfoManageTable').html(personnelInfoManageTable) 

dtTable($('.personnelInfoManageTable'))                 