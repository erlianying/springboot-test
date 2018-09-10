
var data = {
    list: [
    {
        'time': '09:41  ',
        'contentName':  'WA2支队通报',
        'content': '善心会要在6月10日到北京活动',
    },
    {
         'time': '12:40  ',
        'contentName':  'WA6支队通报',
        'content': 'E租宝事件被骗受害群体在各省自发组织群体',
    },
     {
         'time': '13:30  ',
        'contentName':  'WA7支队通报',
        'content': 'XXX开始借两会契机不断进京上访',
    }  

]}


var html = template('attentionTP', data);
document.getElementById('attention').innerHTML = html;


var data2 = {
    list: [
    {
        'time': '10:20  ',
        'content': '涉军访类群体近10日进京人数超过10均线25%',
    },
    {
         'time': '11:10  ',
        'content': 'XXXXXXX群体近10日进京人数超过10均线25%',
    },
     {
         'time': '15:45  ',
        'content': 'XXXXXX群体近10日进京人数超过10均线25%',
    }  

]}


var html = template('warningTP', data2);
document.getElementById('warning').innerHTML = html;


