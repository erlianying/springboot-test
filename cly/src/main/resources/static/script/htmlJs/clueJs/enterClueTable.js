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
                            <th>操作</th>  \
                        </tr>  \
                    </thead>  \
                    <tbody>  \
                        <tr>  \
                            <td>张毅</td>  \
                            <td>282272198403021292</td>  \
                            <td>一般参与</td>  \
                            <td>否</td>  \
                            <td>13470742562</td>  \
                            <td></td>  \
                            <td></td>  \
                            <td></td>  \
                            <td>  \
                                <p class="text-center">  \
                                    <a href="#">编辑</a>  \
                                    <a href="#">删除</a>  \
                                </p>   \
                            </td>  \
                        </tr>  \
                        <tr class="table-edit">  \
                            <td><input type="text" class="form-control input-sm"></td>  \
                            <td><input type="text" class="form-control input-sm"></td>  \
                            <td>  \
                                <select id="" class="form-control input-sm">  \
                                    <option>组织者</option>  \
                                    <option>骨干</option>  \
                                    <option>一般参与</option>  \
                                </select>  \
                            </td>  \
                            <td>  \
                                <div class="pull-left" style="width: 27%; margin-right: 3%;">  \
                                    <select id="selecttest1" class="form-control select2">  \
                                        <option>是</option>  \
                                        <option>否</option>  \
                                    </select>  \
                                </div>  \
                                <div class="pull-left" style="width: 70%;">  \
                                    <input type="text" class="form-control input-sm" placeholder="请填写维稳情况" />  \
                                </div>  \
                            </td>  \
                            <td><input type="text" class="form-control input-sm"/></td>  \
                            <td>  \
                                <select id="selecttest2" class="form-control input-sm" multiple>  \
                                    <option>微信</option>  \
                                    <option>QQ</option>  \
                                    <option>其他</option>  \
                                </select>  \
                            </td>  \
                            <td><input type="text" class="form-control input-sm" placeholder="多个请用分号隔开" /></td>  \
                            <td><input type="text" class="form-control input-sm" placeholder="多个请用分号隔开" /></td>  \
                            <td>  \
                                <p class="text-center">  \
                                    <a href="#">保存</a>  \
                                </p>   \
                            </td>  \
                        </tr>  \
                    </tbody>'

var relativeCrowd = '<thead>  \
                        <tr>  \
                            <th>网络ID类型</th>  \
                            <th>网络ID</th>  \
                            <th>网络名称</th>  \
                            <th>操作</th>  \
                        </tr>  \
                    </thead>  \
                    <tbody>  \
                        <tr>  \
                            <td>微信群</td>  \
                            <td>8484898@qq.com</td>  \
                            <td></td>  \
                            <td>  \
                                <p class="text-center">  \
                                    <a href="#">编辑</a>  \
                                    <a href="#">删除</a>  \
                                </p>   \
                            </td>  \
                        </tr>  \
                        <tr class="table-edit">  \
                            <td>  \
                                <select id="" class="form-control input-sm">  \
                                    <option>微信群</option>  \
                                    <option>QQ群</option>  \
                                    <option>其他</option>  \
                                </select>  \
                            </td>  \
                            <td><input type="text" class="form-control input-sm" placeholder="多个请用分号隔开" /></td>  \
                            <td><input type="text" class="form-control input-sm" placeholder="多个请用分号隔开" /></td>  \
                            <td>  \
                                <p class="text-center">  \
                                    <a href="#">保存</a>  \
                                </p>   \
                            </td>  \
                        </tr>  \
                    </tbody>'




$('.relativePerson').html(relativePerson)
$('.relativeCrowd').html(relativeCrowd)


dtTable($('.relativePerson'))
dtTable($('.relativeCrowd'))








