
var data = {
    list: [
    {
        'time': '2017-06-11 10:00 ',
        'contentName':  'WA2支队通报',
        'content': '善心会要在6月10日到北京活动 ',
    },
    {
         'time': '2017-05-11 09:41   ',
        'contentName':  '治安总队通报',
        'content': 'E租宝事件被骗受害群体在各省自发组织群体',
    },
     {
         'time': '13:30  ',
        'contentName':  '治安总队通报',
        'content': 'XXX开始借两会契机不断进京上访',
    }  

]}
var html = template('attentionTP', data);
document.getElementById('attention').innerHTML = html;

