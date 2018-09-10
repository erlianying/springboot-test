

var leader = '<thead>  \
                                                <tr>  \
                                                    <th>批示时间</th>  \
                                                    <th>批示级别</th>  \
                                                    <th>批示内容</th>  \
                                                </tr>  \
                                            </thead>  \
                                            <tbody>  \
                                                <tr>  \
                                                    <td>2017-05-19</td>  \
                                                    <td>部委</td>  \
                                                    <td>各单位迅速控制，调查落地</td>  \
                                                </tr>    \
                                                <tr>  \
                                                    <td>2017-05-21</td>  \
                                                    <td>市局</td>  \
                                                    <td>XXXXX</td>  \
                                                </tr>    \
                                            </tbody>'

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
                               \
                               \
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
                                        </tr>     \
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
                                        </tr>   \
                                    </tbody>'

var relativeCrowd = '<thead>  \
                                        <tr>  \
                                            <th>网络ID类型</th>  \
                                            <th>网络ID</th>  \
                                            <th>网络名称</th>  \
                                            <th>最新轨迹</th>  \
                                        </tr>  \
                                    </thead>  \
                               \
                               \
                                    <tbody>  \
                                        <tr>  \
                                            <td>微信群</td>  \
                                            <td>2785875684</td>  \
                                            <td>行帖称</td>  \
                                            <td></td>  \
                                      </tr>     \
                                    </tbody>'

var feedback = '<thead>  \
                                                <tr>  \
                                                    <th>反馈时间</th>  \
                                                    <th>反馈单位</th>  \
                                                    <th>反馈内容</th>  \
                                                    <th>反馈人</th>  \
                                                </tr>  \
                                            </thead>  \
                                            <tbody>  \
                                                <tr>  \
                                                    <td>2017-05-19 10:00:00</td>  \
                                                    <td>治安总队</td>  \
                                                    <td>  \
                                                        <div class="fi-ceng-out">  \
                                                            发生，发生时间  \
                                                            <div class="fi-ceng">  \
                                                                <p style="padding: 5px 10px;">发生，发生时间：2017-06-01；发生地点：XXX；人员规模：XX人；  \无过激行为；现场情况：XX；持续时间：XX小时。</p>  \
                                                            </div>  \
                                                        </div>  \
                                                    </td>  \
                                                    <td>李四</td>  \
                                              </tr>     \
                                            </tbody>'

var feedbackList = '<thead>  \
                                                <tr>  \
                                                    <th>反馈时间</th>  \
                                                    <th>反馈单位</th>  \
                                                    <th>跟进情况</th>  \
                                                    <th>反馈人</th>  \
                                                </tr>  \
                                            </thead>  \
                                       \
                                       \
                                            <tbody>  \
                                                <tr>  \
                                                    <td>2017-05-19 10:00:00</td>  \
                                                    <td>治安总队</td>  \
                                                    <td>  \
                                                        <div class="fi-ceng-out">  \
                                                            已处置，XXXX  \
                                                            <div class="fi-ceng">  \
                                                                <p style="padding: 5px 10px;">湖南湘潭参战老兵陈建设（手机13470742562）8日与在京河北参战  \老兵王月华（手机15620620589）联系反映，陈建设一行已抵京活动。XXXXXXXXXXXXXXXXXXX</p>  \
                                                            </div>  \
                                                        </div>  \
                                                    </td>  \
                                                    <td>李四</td>  \
                                              </tr>     \
                                            </tbody>'



$('.leader').html(leader)
$('.relativePerson').html(relativePerson)
$('.relativeCrowd').html(relativeCrowd)
$('.feedback').html(feedback)
$('.feedbackList').html(feedbackList)


dtTable($('.leader'))
dtTable($('.relativePerson'))
dtTable($('.relativeCrowd'))
dtTable($('.feedback'))
dtTable($('.feedbackList'))
