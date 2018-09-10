
var buildReport = '<thead>  \
                        <tr>  \
                            <th>编号</th>  \
                            <th>报告生成时间</th>  \
                            <th>群体类型</th>  \
                            <th>群体名称</th>  \
                            <th>报告名称</th>  \
                            <th>操作</th>  \
                        </tr>  \
                    </thead>  \
                    <tbody>  \
                        <tr>  \
                            <td>1</td>  \
                            <td>2017年8月15日 13：45</td>  \
                            <td>涉众经济类案件</td>  \
                            <td>E租宝</td>  \
                            <td>XXX群体研判报告.doc</td>  \
                            <td>  \
                                <p class="text-center">  \
                                    <button class="btn btn-default btn-xs">下载</button>  \
                                    <button class="btn btn-default btn-xs">删除</button>  \
                                </p>  \
                            </td>  \
                        </tr>  \
                    </tbody>'

$('.buildReport').html(buildReport);

dtTable($('.buildReport'))