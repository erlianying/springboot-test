
var crowdDetail = '<thead>  \
                                <tr>  \
                                    <th>人员姓名</th>  \
                                    <th>身份证号码</th>  \
                                    <th>年龄</th>  \
                                    <th>户籍省市</th>  \
                                    <th>手机号码</th>  \
                                    <th>现住地址</th>  \
                                </tr>  \
                            </thead>  \
                            <tbody>  \
                                <tr>  \
                                    <td><a href="#"><span class="state state-circle  state-red1">骨干</span>张三</td>  \
                                    <td>112304198401240987</td>  \
                                    <td>35</td>  \
                                    <td>湖北武汉</td>  \
                                    <td>13911297653</td>  \
                                    <td>XXXXX</td>  \
                                </tr>  \
                                <tr>  \
                                    <td><a href="#"><span class="state state-circle  state-red1">骨干</span>李四</a></td>  \
                                    <td>112304198401240987</td>  \
                                    <td>36</td>  \
                                    <td>湖北武汉</td>  \
                                    <td>13911297653</td>  \
                                    <td>XXXXX</td>  \
                                </tr>  \
                                <tr>  \
                                    <td><a href="#"><span class="state state-circle  state-green2">在京</span>王五</a></td>  \
                                    <td>112304198401240987</td>  \
                                    <td>32</td>  \
                                    <td>河北石家庄</td>  \
                                    <td>XXXXXXXXXXX</td>  \
                                    <td>XXXXX</td>  \
                                </tr>  \
                                <tr>  \
                                    <td><a href="#"><span class="state state-circle  state-green2">在京</span>赵六</a></td>  \
                                    <td>112304198401240987</td>  \
                                    <td>30</td>  \
                                    <td>河北石家庄</td>  \
                                    <td>XXXXXXXXXXX</td>  \
                                    <td>XXXXX</td>  \
                                </tr>  \
                            </tbody>'

var clueInfo = '<thead>  \
                                <tr>  \
                                    <th width="18%">线索标题</th>  \
                                    <th width="25%">线索内容</th>  \
                                    <th width="8%">来源单位</th>  \
                                    <th width="8%">主责单位</th>  \
                                    <th width="10%">指向时间</th>  \
                                    <th width="10%">指向地点</th>  \
                                    <th width="10%">行为方式</th>  \
                                    <th width="">办理状态</th>  \
                                </tr>  \
                            </thead>  \
                            <tbody>  \
                                <tr>  \
                                    <td><a href="#">  \全国E租宝受害群体集体拟上访维权</a></td>  \
                                    <td>XXX重点人员在QQ群中拟发起30人左右聚集  \在天安门群体上访维权，聚众静坐。</td>  \
                                    <td>指挥部</td>  \
                                    <td>XXX支队</td>  \
                                    <td>2017年7月24日</td>  \
                                    <td>天安门</td>  \
                                    <td>聚众静坐</td>  \
                                    <td>未办结</td>  \
                                </tr>  \
                                <tr>  \
                                    <td><a href="#">XXXX</a></td>  \
                                    <td></td>  \
                                    <td></td>  \
                                    <td></td>  \
                                    <td></td>  \
                                    <td>2017年7月23日</td>  \
                                    <td>方式2</td>  \
                                    <td>已办结</td>  \
                                </tr>  \
                            </tbody>' 


var applyInfo = '<thead>  \
                                <tr>  \
                                    <th>来源地</th>  \
                                    <th>上访日期</th>  \
                                    <th>上访部位</th>  \
                                    <th>人员规模</th>  \
                                    <th>现场情况</th>  \
                                </tr>  \
                            </thead>  \
                            <tbody>  \
                                <tr>  \
                                    <td></td>  \
                                    <td></td>  \
                                    <td></td>  \
                                    <td></td>  \
                                    <td></td>  \
                                </tr>  \
                                <tr>  \
                                    <td></td>  \
                                    <td></td>  \
                                    <td></td>  \
                                    <td></td>  \
                                    <td></td>  \
                                </tr>  \
                            </tbody>'

var otherCrowd = '<tbody>\n' +
    '\n' +
    '                        <tr>\n' +
    '<td class="td-left" width="20%">本市商住房人员：</td>\n' +
    '<td class="td-left">28人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">E租宝：</td>\n' +
    '<td class="td-left">12人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">隆尊：</td>\n' +
    '<td class="td-left">11人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">善心汇：</td>\n' +
    '<td class="td-left">10人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">慧融股权：</td>\n' +
    '<td class="td-left">6人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">华赢凯来：</td>\n' +
    '<td class="td-left">6人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">心未来：</td>\n' +
    '<td class="td-left">6人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">秀水群体：</td>\n' +
    '<td class="td-left">5人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">万福币：</td>\n' +
    '<td class="td-left">4人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">华融普银：</td>\n' +
    '<td class="td-left">4人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">海涛旅行社：</td>\n' +
    '<td class="td-left">4人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">张健五行币：</td>\n' +
    '<td class="td-left">4人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">易胜百投资人：</td>\n' +
    '<td class="td-left">3人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">成吉大易基金投资：</td>\n' +
    '<td class="td-left">2人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">九鼎汇鑫：</td>\n' +
    '<td class="td-left">2人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">富程：</td>\n' +
    '<td class="td-left">2人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">滨海大宗邮币卡：</td>\n' +
    '<td class="td-left">2人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">泛亚：</td>\n' +
    '<td class="td-left">1人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">API投资：</td>\n' +
    '<td class="td-left">1人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">天津私募：</td>\n' +
    '<td class="td-left">1人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">金源鸿基集资诈骗：</td>\n' +
    '<td class="td-left">1人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">中润通投资：</td>\n' +
    '<td class="td-left">1人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">中金嘉钰：</td>\n' +
    '<td class="td-left">1人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">民族资产解冻：</td>\n' +
    '<td class="td-left">1人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">妙有基金：</td>\n' +
    '<td class="td-left">1人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">银证国际投资基金管理（北京）有限公司：</td>\n' +
    '<td class="td-left">1人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">盛世汇海投资：</td>\n' +
    '<td class="td-left">1人</td>\n' +
    '</tr><tr>\n' +
    '<td class="td-left" width="20%">中晋案投资人：</td>\n' +
    '<td class="td-left">1人</td>\n' +
    '</tr></tbody>'

$('.crowdDetail').html(crowdDetail)
$('.clueInfo').html(clueInfo)
$('.applyInfo').html(applyInfo)
$('.otherCrowd').html(otherCrowd)

dtTable($('.crowdDetail'))
dtTable($('.clueInfo'))
dtTable($('.applyInfo'))
dtTable($('.otherCrowd'))





$('#personLocal').highcharts({
    chart: {
        type: 'bar'
    },
    title: {
        text: null
    },
    xAxis: {
        categories: ['上海', '山东', '河北', '天津', '北京'],
        title: {
            enabled: false
        }
    },
    yAxis: {
        title: {
            text: null
        }
    },
    tooltip: {
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
    },
    series: [{
        name: null,
        color: '#ffb980',
        data: [15, 25, 30, 15, 2]
    }]
});




$('#personGender').highcharts({
    chart: {
        type: 'pie',
    },
    title: {
        text: null
    },
    plotOptions: {
        pie: {
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: <br>{point.percentage:.1f} 人',
                style: {
                    color:  'black'
                }
            }
        }
    },
    series: [{
        size: 120,
        name: null,
        data: [
            ['男性',   50],
            ['女性',   19]
        ]
    }]
});


$('#personType').highcharts({
    chart: {
        type: 'bar'
    },
    title: {
        text: null
    },
    xAxis: {
        categories: ['公司员工', '理财人', '投资人'],
        title: {
            enabled: false
        }
    },
    yAxis: {
        title: {
            text: null
        }
    },
    tooltip: {
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
    },
    series: [{
        name: null,
        color: '#ffb980',
        data: [30, 50, 20]
    }]
});