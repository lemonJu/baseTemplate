# baseTemplate -高效的js模板引擎
## 运行你的第一个程序
要将程序运行起来非常简单，加载js之后，在window对象下会挂载一个新的对象--template对象，想要编译模板时只需要执行该对象的render方法
```js
template.render('app', {
    title: '例子',
    print: true,
    list: ['123', '222', '333', '44']
})
```
该方法的第一个参数为需要编译的dom对象的id，第二个对象会传入的数据，请参见demo中base.html

## 同步更新视图
这里视图是指需要编译的html结构，如果需要在执行某些请求（如ajax）后更新视图，使用下面的方法
```js
template.render('app', function($oper) {
    $oper.setData({
        title: '例子',
        print: true,
        list: ['123', '222', '333', '44']
    })

    setTimeout(function() {
        $oper.setData({
            title: '成功！',
            print: true,
            list: ['成功！', '成功！', '成功！']
        })
    }, 1000)
})
```
即第二个参数传入为函数形式，此时回调中会带一个对象参数，该参数有一个id属性指明了需要更新的dom ID，以及setData方法，请注意，调用此方法后视图会自动更新。

## 自定义标签
默认的标签如下：
```js
{
        openTag: '<%',
        closeTag: '%>',
        outTag: '='
    }
```
需要自定义时，将新的表情作为template.render的第三个参数传入
```js
template.render('app', {
    title: '例子',
    print: true,
    list: ['123', '222', '333', '44']
}, {
    openTag: '{{',
    closeTag: '}}',
    outTag: '='
})
```
