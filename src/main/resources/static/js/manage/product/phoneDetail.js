window.onload = function (){
    layui.use(['table','form','laydate'],function () {
        var $ = layui.$;
        var table = layui.table;
        let laydate = layui.laydate;

        var categoryId = 1;
        table.render({
            elem: '#main-table',
            height: 560,
            url: '/eight/manage/phoneDetail/queryPhoneDetailPage',
            method: 'POST',
            page: true,
            id: 'table-load',
            toolbar: '#toolbarDemo',
            cols: [
                [
                    {title: '序号',templet: '#indexTpl',width: 80,align:'center'},
                    {field:'pDetailId',title:'详细信息ID',algin:'center',width:120,sort:true},
                    {field:'productName',title:'商品名称',algin:'center',width:120,
                        templet: function (data){
                            return data.productInfo.productName;
                        }},
                    {field:'productCore',title:'商品编码',algin:'center',width:100,sort:true},
                    {field:'pHeight',title:'高度(m)',algin:'center',width:95,sort:true},
                    {field:'pWidth',title:'宽度(m)',algin:'center',width:100,sort:true},
                    {field:'pSize',title:'尺寸',algin:'center',width:100,sort:true},
                    {field:'pWeight',title:'重量(kg)',algin:'center',width:100,sort:true},
                    {field:'pColor',title:'机身颜色',algin:'center',width:120},
                    {field:'pMeal',title:'套餐类型',algin:'center',width:100},
                    {field:'pVersion',title:'版本',algin:'center',width:100},
                    {field:'pCapacity',title:'内存容量',algin:'center',width:120},
                    {title:'操作',align:'center',toolbar:'#barDemo',fixed:'right',width:130}
                ]
            ],
            //某一页数据删完后跳回上一个页面
            done: function (res, currentPage)  {
                if (currentPage > 1 && res.data.length === 0) {
                    taskTable.reload({
                        page: {
                            curr: currentPage - 1
                        }
                    });
                }
            }
        });

        //监听头工具栏事件
        table.on('toolbar(main-table)',function (obj) {
            switch (obj.event) {
                case 'add':
                    layer.open({
                        type: 2,
                        title: '新增手机详细信息',
                        content: '/eight/manage/phoneDetail/phoneDetailPage?categoryId=' + categoryId,
                        shade:[0.8,'#393d49'],
                        area:['600px','600px'],
                        btn:['确定','取消'],
                        yes:function (index,layero) {  //index是新出窗口的索引，layero是窗口的window对象
                            var iframeWindow = window['layui-layer-iframe' + index]; //获取哪个窗口点击的yes
                            var submit = layero.find('iframe').contents().find("#lay-front-submit");
                            //监听提交
                            iframeWindow.layui.form.on('submit(lay-front-submit)',function (data) {
                                var field = data.field;
                                $.ajax({
                                    url: '/eight/manage/phoneDetail/addPhoneDetail',
                                    data: field,
                                    async: false,
                                    cache: false,
                                    success: function (str) {
                                        if(str.code === 0){
                                            table.reload('table-load');
                                        }
                                        layer.msg(str.msg,{icon:str.icon,anim:str.anim});
                                    }
                                });
                                layer.close(index);     //关闭弹层
                            });
                            submit.trigger('click');
                        },
                        success:function (layero,index) {

                        }
                    });
                    break;
                case 'querySearch':
                    var param = $('#param').val();
                    table.reload('table-load',{
                        where: {
                            param: param
                        }
                    });
                    $('#param').val(param);
                    break;
            }
        });

        //监听编辑、删除
        table.on('tool(main-table)',function (obj) {
            var data = obj.data;

            switch (obj.event) {
                case 'edit':
                    layer.open({
                        type: 2,
                        title: '编辑手机详细信息',
                        content: '/eight/manage/phoneDetail/queryPhoneDetailById?pDetailId=' + data.pDetailId + '&categoryId=' + categoryId,
                        shade:[0.8,'#393d49'],
                        area:['600px','600px'],
                        btn:['确定','取消'],
                        yes:function (index,layero) {
                            var iframeWindow = window['layui-layer-iframe'+index];
                            var submit = layero.find('iframe').contents().find("#lay-front-submit");
                            //监听提交
                            iframeWindow.layui.form.on('submit(lay-front-submit)',function (data) {
                                var field = data.field;
                                $.ajax({
                                    url: '/eight/manage/phoneDetail/modifyPhoneDetail',
                                    data: field,
                                    async: false,
                                    cache: false,
                                    success: function (str) {
                                        if(str.code === 0){
                                            table.reload('table-load');
                                        }
                                        layer.msg(str.msg,{icon:str.icon,anim:str.anim});
                                    }
                                });
                                layer.close(index);     //关闭弹层
                            });
                            submit.trigger('click');
                        },
                        success:function (layero,index) {

                        }
                    });
                    break;
                case 'del':
                    layer.confirm('确认要删除吗？',function (index) {
                        $.ajax({
                            url: '/eight/manage/phoneDetail/deletePhoneDetail?pDetailId=' +data.pDetailId,
                            data: null,
                            async: false,
                            cache: false,
                            success: function (str) {
                                table.reload('table-load');
                                layer.msg(str.msg,{icon:str.icon,anim:str.anim});
                            }
                        });
                    })
                    break;
            }
        });
    });

}