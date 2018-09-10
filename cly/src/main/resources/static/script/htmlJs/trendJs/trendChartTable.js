var trendChartTable = '<thead>  \
                                <tr>  \
                                    <th></th>  \
                                    <th>序号</th>  \
                                    <th>预警时间</th>  \
                                    <th>预警规则</th>  \
                                    <th>预警内容</th>  \
                                    <th>状态</th>  \
                                </tr>  \
                            </thead>  \
                            <tbody>  \
                                <tr>  \
                                    <td><input type="checkbox" class="icheckbox"></td>  \
                                    <td>1</td>  \
                                    <td>2017年8月4日 15：35</td>  \
                                    <td>规则1</td>  \
                                    <td>政策类（涉军访群体）近10日进京人数超出10日均线50%</td>  \
                                    <td><span class="state state-green2">已读</span></td>  \
                                </tr>  \
                                <tr>  \
                                    <td><input type="checkbox" class="icheckbox"></td>  \
                                    <td>2</td>  \
                                    <td>2017年8月4日 15：35</td>  \
                                    <td>规则2</td>  \
                                    <td>【类型】【群体名称】【预警规则】</td>  \
                                    <td><span class="state state-green2">已读</span></td>  \
                                </tr>  \
                                <tr>  \
                                    <td><input type="checkbox" class="icheckbox"></td>  \
                                    <td>3</td>  \
                                    <td>2017年8月4日 15：35</td>  \
                                    <td>规则1</td>  \
                                    <td></td>  \
                                    <td><span class="state state-red2">未读</span></td>  \
                                </tr>  \
                            </tbody>'


$('.trendChartTable').html(trendChartTable)

dtTable($('.trendChartTable'), true)

