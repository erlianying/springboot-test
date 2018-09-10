
var crowdManage = '<thead>  \
                            <tr>  \
                                <th></th>  \
                                <th>序号</th>  \
                                <th>群体类型</th>  \
                                <th>群体名称</th>  \
                                <th>人员数量(人)</th>  \
                                <th>常口数量(人)</th>  \
                                <th>暂口数量(人)</th>  \
                                <th>有手机号码数量(人)</th>  \
                            </tr>  \
                        </thead>  \
                        <tbody>  \
                            <tr>  \
                                <td><input type="checkbox" class="icheckbox"></td>  \
                                <td>1</td>  \
                                <td>涉众经济类案件</td>  \
                                <td><a href="#">泛亚群体</a></td>  \
                                <td>500000</td>  \
                                <td>10000</td>  \
                                <td>20000</td>  \
                                <td>420000</td>  \
                            </tr>  \
                            <tr>  \
                                <td><input type="checkbox" class="icheckbox"></td>  \
                                <td>2</td>  \
                                <td>涉众经济类案件</td>  \
                                <td><a href="#">E租宝</a></td>  \
                                <td></td>  \
                                <td></td>  \
                                <td></td>  \
                                <td></td>  \
                            </tr>  \
                        </tbody>'


$('.crowdManage').html(crowdManage);

dtTable($('.crowdManage'))
