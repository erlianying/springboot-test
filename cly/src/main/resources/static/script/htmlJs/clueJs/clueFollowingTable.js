
var relativePerson = '<thead>  \
                                                    <tr>  \
                                                        <th>姓名</th>  \
                                                        <th>身份证号</th>  \
                                                        <th>人员等级</th>  \
                                                        <th>是否稳控</th>  \
                                                        <th>手机号</th>  \
                                                        <th>网络ID类型</th>  \
                                                        <th>网络ID</th>  \
                                                        <th>网络名称</th>  \
                                                        <th>最新轨迹</th>  \
                                                    </tr>  \
                                                </thead>  \
                                                <tbody>  \
                                                    <tr>  \
                                                        <td><a href="#">张毅</a></td>  \
                                                        <td>282272198403021292</td>  \
                                                        <td>一般参与</td>  \
                                                        <td>是</td>  \
                                                        <td>13470742562</td>  \
                                                        <td></td>  \
                                                        <td></td>  \
                                                        <td></td>  \
                                                        <td></td>  \
                                                    </tr>    \
                                                    <tr>  \
                                                        <td><a href="#">王刚</a></td>  \
                                                        <td>110108198402012145</td>  \
                                                        <td>组织者</td>  \
                                                        <td>是</td>  \
                                                        <td>15620620589</td>  \
                                                        <td></td>  \
                                                        <td></td>  \
                                                        <td></td>  \
                                                        <td></td>  \
                                                    </tr>    \
                                                </tbody>'

var relativeCrowd = '<thead>  \
                                                <tr>  \
                                                    <th>网络ID类型</th>  \
                                                    <th>网络ID</th>  \
                                                    <th>网络名称</th>  \
                                                    <th>最新轨迹</th>  \
                                                </tr>  \
                                            </thead>  \
                                            <tbody>  \
                                                <tr>  \
                                                    <td><a href="#">微信群</a></td>  \
                                                    <td>2785875684</td>  \
                                                    <td>行帖称</td>  \
                                                    <td></td>  \
                                              </tr>     \
                                            </tbody>'


$('.relativePerson').html(relativePerson)
$('.relativeCrowd').html(relativeCrowd)

dtTable($('.relativePerson'))
dtTable($('.relativeCrowd'))