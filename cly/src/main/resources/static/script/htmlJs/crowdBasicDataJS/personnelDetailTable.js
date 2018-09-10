var crowdTypeTable = ' <thead>  \
                             <tr>  \
	                              <th width="5%"><input type="checkbox" class="icheckbox"></th>  \
	                              <th width="10%">编号</th>  \
	                              <th width="10%">群体类型</th>  \
	                              <th width="10%">群体细类</th>  \
		                      </tr>  \
		                      </thead>  \
		              \
                      <tbody>               \
                         <tr>  \
                              <td><input type="checkbox" class="icheckbox"></td>  \
                              <td>1</td>  \
                              <td>案件</td>  \
                              <td>武警二院受害者</td>  \
                        </tr>\
                        <tr>\
                              <td><input type="checkbox" class="icheckbox"></td>  \
                              <td>2</td>  \
                              <td>涉众型经济案件</td>  \
                              <td>马航失联家属</td>  \
                        </tr> \
                        <tr>\
                              <td><input type="checkbox" class="icheckbox"></td>  \
                              <td>3</td>  \
                              <td>案件</td>  \
                              <td>盛世汇海投资受害群体</td>  \
                        </tr>  \
                   </tbody>'  

$('.crowdTypeTable').html(crowdTypeTable) 

dtTable($('.crowdTypeTable'))                 