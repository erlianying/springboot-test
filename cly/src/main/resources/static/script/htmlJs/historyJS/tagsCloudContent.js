var data = {
  list: ['进京','西站','天安门','集会','谣传','新疆','讨薪','农民工','谣传222','新疆222','讨薪222','农民工222']
}

var html = template('tagscloudTP', data);
document.getElementById('tagscloud').innerHTML = html;