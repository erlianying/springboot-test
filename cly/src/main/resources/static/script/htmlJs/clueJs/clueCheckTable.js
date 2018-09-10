 
var clueCheck = '<thead>  \
                            <tr>  \
                                <th width="7%">序号</th>  \
                                <th width="9%">录入时间</th>  \
                                <th width="10%">线索编码</th>  \
                                <th width="8%">来源单位</th>  \
                                <th width="8%">线索类别</th>  \
                                <th width="8%">涉访群体</th>  \
                                <th width="13%">内容</th>  \
                                <th width="10%">指向开始时间</th>  \
                                <th width="8%">指向地点</th>  \
                                <th width="8%">线索状态</th>  \
                                <th>操作</th>  \
                            </tr>  \
                        </thead>  \
                   \
  \
                        <tbody>  \
                            <tr>  \
                                <td><span class="fa fa-star level1"></span> <span class="fa fa-bell-o level1"></span> 1</td>  \
                                <td>2017-05-19 09:00</td>  \
                                <td>XS20170519001</td>  \
                                <td>公安部</td>  \
                                <td>涉防类</td>  \
                                <td>涉军</td>  \
                                <td>  \
                                    <div class="fi-ceng-out">  \
                                        善心会要在6月10日到北京活动...  \
                                        <div class="fi-ceng">  \
                                            <p style="padding: 5px 10px;">  \
                                                善心会要在6月10日到北京活动善心会要在6月10日到北京活动善心会要在6月10日到北京活动善心会要在6月10日到北京活  \动善心会要在6月10日到北京活动  \
                                            </p>  \
                                        </div>  \
                                    </div>  \
                                </td>  \
                                <td>2017-06-10</td>  \
                                <td>北京</td>  \
                                <td>新增</td>  \
                                <td>  \
                                    <p class="text-center">  \
                                        <a href="#" class="btn btn-default btn-xs">核查</a>  \
                                        <a href="#" class="btn btn-default btn-xs">查看</a>  \
                                    </p>  \
                                </td>  \
                            </tr>  \
                            <tr>  \
                                <td><span class="fa fa-star level2"></span> <span class="fa fa-bookmark level1"></span> 2</td>  \
                                <td>2017-05-19 09:00</td>  \
                                <td>XS20170519001</td>  \
                                <td>战支三部</td>  \
                                <td>涉防类</td>  \
                                <td>涉军</td>  \
                                <td>  \
                                    <div class="fi-ceng-out">  \
                                        善心会要在6月10日到北京活动...  \
                                        <div class="fi-ceng">  \
                                            <p style="padding: 5px 10px;">  \
                                                善心会要在6月10日到北京活动善心会要在6月10日到北京活动善心会要在6月10日到北京活动善心会要在6月10日到北京活  \动善心会要在6月10日到北京活动  \
                                            </p>  \
                                        </div>  \
                                    </div>  \
                                </td>  \
                                <td>2017-06-10</td>  \
                                <td>北京</td>  \
                                <td>已接收</td>  \
                                <td>  \
                                    <p class="text-center">  \
                                        <a href="#" class="btn btn-default btn-xs">核查</a>  \
                                        <a href="#" class="btn btn-default btn-xs">查看</a>  \
                                    </p>  \
                                </td>  \
                            </tr>  \
                        </tbody>'  


$('.clueCheck').html(clueCheck)


dtTable($('.clueCheck'))


