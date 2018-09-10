var petitionRegistrationTable = '      <thead>  \
                          <tr>  \
                              <th width="5%"><input type="checkbox" class="icheckbox"></th>  \
                              <th width="5%">序号</th>  \
                              <th width="13%">上访日期/星期</th>  \
                              <th width="10%">群体</th>  \
                              <th width="12%">上访性质</th>  \
                              <th width="10%">上访部位</th>  \
                              <th width="8%">人员规模</th>  \
                              <th width="12%">来源地</th>  \
                              <th width="12%">现场突围情况</th>  \
                              <th>本市集访</th>  \
                              <th></th>  \
                        </tr>  \
                      </thead>  \
                \
                      <tbody>               \
                         <tr>  \
                              <td><input type="checkbox" class="icheckbox"></td>  \
                              <td>1</td>  \
                              <td>2017年8月10日<p>星期一</p></td>  \
                              <td>退伍军人</td>  \
                              <td>改革、政策变革引发问题</td>  \
                              <td>民政部</td>  \
                              <td>25</td>  \
                              <td>山西吕梁柳州市</td>  \
                              <td></td>  \
                              <td></td>  \
                              <td><a href="#">详情</a></td>  \
                     </tr>                                         \
                   </tbody>'  

$('.petitionRegistrationTable').html(petitionRegistrationTable) 

dtTable($('.petitionRegistrationTable'))                 