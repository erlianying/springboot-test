var petitionLeaveTable = '      <thead>  \
                          <tr>  \
                              <th width="5%" rowspan="2"><input type="checkbox" class="icheckbox"></th>  \
                              <th width="10%" rowspan="2">上访日期/星期</th>  \
                               <th width="10%" rowspan="2">四个重点区域发现带离上访人员</th>  \
                              <th width="25%" colspan="3">全部人员</th>  \
                              <th width="27%" colspan="4">本市人员</th>  \
                              <th width="15%" colspan="2">极端访</th>  \
                              <th rowspan="2">2016年总数</th>  \
                        </tr>  \
                        <tr>  \
                              <th>集访批次</th>  \
                              <th>集访人次</th>  \
                              <th>个人访</th>  \
                               <th>集访批次</th>  \
                              <th>集访人次</th>  \
                              <th>个人访</th>  \
                              <th>上访总数</th>  \
                              <th>批次</th>  \
                              <th>人次</th>  \
                        </tr>  \
                      </thead>  \
                \
                      <tbody>               \
                         <tr>  \
                              <td><input type="checkbox" class="icheckbox"></td>  \
                              <td><a href="#">2017年8月10日<p>星期一</p></a></td>  \
                              <td>478</td>  \
                              <td>2</td>  \
                              <td>21</td>  \
                              <td>457</td>  \
                              <td>0</td>  \
                              <td>0</td>  \
                              <td>12</td>  \
                              <td>12</td>  \
                              <td></td>  \
                              <td></td>  \
                              <td>609</td>  \
                     </tr>                                         \
                   </tbody>'  

$('.petitionLeaveTable').html(petitionLeaveTable) 

dtTable($('.petitionLeaveTable'))                 