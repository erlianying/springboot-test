
var data = {
    list: [
    {
        'contentName':  'E租宝群体',
        'content': '0时至18时在京住宿50人，环比昨日同时段48人上升4.2%，1日火车票进京68人，环比昨日149人下降54.3%',
    },
    {
        'contentName':  '涉军访群体',
        'content': '该群体成员因E租宝事件被骗受害群体，与2015年5月起在各省自发组织群体，开始借两会契机不断进京上访，目前',
    },
     {
        'contentName':  '善心汇群体',
        'content': '2015年5月起在各省自发组织群体，开始借两会契机不断进京上访，目前',
    }  

]}


var html = template('crowdDynamicTP', data);
document.getElementById('crowdDynamic').innerHTML = html;




