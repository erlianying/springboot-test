var setting = {
    check: {
        enable: true,
        chkboxType: { "Y" : "ps", "N" : "ps" }
    },
    data: {
        simpleData: {
            enable: true
        }
    }
};

var zNodes =[
    { name:"涉军", open:false, checked: true,
        children: [
            { name:"两参"},
            { name:"转业志愿兵"},
            { name:"伤残军人", checked: true}
        ]
    }, { name:"政策", open:false,
        children: [
            { name:"非京籍", checked: true},
            { name:"......"}
        ]
    }
];


$(document).ready(function(){
    $.fn.zTree.init($("#notFoucsCrowd"), setting, zNodes);
});