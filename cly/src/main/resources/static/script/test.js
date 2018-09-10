
var data = {
    list: [
    {
        'time': '2017-06-24 09:00',
        'contentName':  'WA二支队  评价线索',
        'content': '',
        'liclass': 'active'
    },
    {
        'time': '2017-06-23 09:00',
        'contentName':  '治安总队   办结线索',
        'content': '',
        'liclass': ''
    },
     {
        'time': '2017-06-22 09:00',
        'contentName':  '治安大队  反馈工作情况',
        'content': '',
        'liclass': ''
    },
     {
        'time': '2017-06-21 09:00',
        'contentName':  'WA四支队  反馈落地核查结果',
        'content': '跟进情况：根据UI设计显示两行根据UI设计显示两行根据UI设计显示两行根据UI设计显示两行根据UI设计显示两行根据UI设计显示两行根据UI设计显示两行根据UI设计显示两行根据UI设计显示两行  ',
        'liclass': '',
        'outTime': true
    },
    {
        'time': '2017-06-20 09:00',
        'contentName':  'WA二支队  线索通报',
        'content': '反馈内容：XXXXXXXXXXXXXXXXXXXXXXXXXX根据UI设计显示两行',
        'liclass': ''
    },
     {
        'time': '2017-06-19 09:00',
        'contentName':  'WA二支队  新增线索',
        'content': '',
        'liclass': ''
    }   

    ]
}


 
// data.list = data.list.reverse()
var html = template('test', data);
document.getElementById('testTpl').innerHTML = html;
