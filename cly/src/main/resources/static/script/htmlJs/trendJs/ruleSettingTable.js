var ruleSetting = '<thead>  \
                            <tr>  \
                                <th width="5%"></th>  \
                                <th width="5%">序号</th>  \
                                <th width="20%">规则名称</th>  \
                                <th width="10%">适用群体</th>  \
                                <th width="52%">规则内容</th>  \
                                <th >状态</th>  \
                            </tr>  \
                        </thead>  \
                        <tbody>  \
                            <tr>  \
                                <td><input type="checkbox" class="icheckbox"></td>  \
                                <td>1</td>  \
                                <td>E租宝群体每天轨迹超出预警规则</td>  \
                                <td>E租宝</td>  \
                                <td>E租宝群体 每天进京轨迹全部数量（去重）总和超过前7天（包括当天）均值25%，在进京轨迹情况监测按日  \统计图表中用黄色柱状（点）展示</td>  \
                                <td><span class="state state-green2">启用</span></td>  \
                            </tr>  \
                            <tr>  \
                                <td><input type="checkbox" class="icheckbox"></td>  \
                                <td>2</td>  \
                                <td></td>  \
                                <td>E租宝</td>  \
                                <td></td>  \
                                <td><span class="state state-red2">停用</span></td>  \
                            </tr>  \
                        </tbody>'


$('.ruleSetting').html(ruleSetting)

dtTable($('.ruleSetting'))
