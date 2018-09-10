
var sameWayTrack = '<thead>  \
                                <tr>  \
                                    <th>群体名称</th>  \
                                    <th>群体细类</th>  \
                                    <th>人员名称</th>  \
                                    <th>身份证号码</th>  \
                                    <th>监测类型</th>  \
                                    <th>轨迹信息</th>  \
                                    <th>监测时间</th>  \
                                </tr>  \
                            </thead>  \
                            <tbody>  \
                                <tr>  \
                                    <td>群体访</td>  \
                                    <td>E租宝</td>  \
                                    <td>张三</td>  \
                                    <td>110108111111111111</td>  \
                                    <td rowspan="3">铁路订票</td>  \
                                    <td rowspan="3">乘坐G8535 <br>重庆北--北京西 <br>2017年7月23日 19:35开</td>  \
                                    <td>2017.08.10</td>  \
                                </tr>  \
                                <tr>  \
                                    <td>群体访</td>  \
                                    <td>E租宝</td>  \
                                    <td>李四</td>  \
                                    <td>110108222222222222</td>  \
                                    <td>2017.08.10</td>  \
                                </tr>  \
                                <tr>  \
                                    <td>群体访</td>  \
                                    <td>E租宝</td>  \
                                    <td>王五</td>  \
                                    <td>110108333333333333</td>  \
                                    <td>2017.08.11</td>  \
                                </tr>  \
                            </tbody>'


var sameHotelTrack = '<thead>  \
                                <tr>  \
                                    <th>群体名称</th>  \
                                    <th>群体细类</th>  \
                                    <th>人员名称</th>  \
                                    <th>身份证号码</th>  \
                                    <th>旅店名称</th>  \
                                    <th>旅店地址</th>  \
                                    <th>入住时间</th>  \
                                    <th>入住房间</th>  \
                                </tr>  \
                            </thead>  \
                            <tbody>  \
                                <tr>  \
                                    <td>群体访</td>  \
                                    <td>E租宝</td>  \
                                    <td>张三</td>  \
                                    <td>110108111111111111</td>  \
                                    <td rowspan="3">皇冠假日酒店</td>  \
                                    <td rowspan="3">北京市西城区XX街道XX号</td>  \
                                    <td>2017.08.10</td>  \
                                    <td>8088</td>  \
                                </tr>  \
                                <tr>  \
                                    <td>群体访</td>  \
                                    <td>E租宝</td>  \
                                    <td>李四</td>  \
                                    <td>110108222222222222</td>  \
                                    <td>2017.08.10</td>  \
                                    <td>8061</td>  \
                                </tr>  \
                                <tr>  \
                                    <td>群体访</td>  \
                                    <td>E租宝</td>  \
                                    <td>王五</td>  \
                                    <td>110108333333333333</td>  \
                                    <td>2017.08.11</td>  \
                                    <td>8081</td>  \
                                </tr>  \
                            </tbody>'


$('.sameWayTrack').html(sameWayTrack)
$('.sameHotelTrack').html(sameHotelTrack)
