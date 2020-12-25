import html2canvas from "html2canvas";

export default {
    downloadQr(filename, vue) {
        window.pageYoffset = 0;
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        // 先获取你要转换为img的dom节点
        let node = vue.$refs.qrArea;//传入的id名称
        let width = node.offsetWidth; //dom宽
        let height = node.offsetHeight; //dom高
        let scale = 2; //放大倍数 这个相当于清晰度 调大一点更清晰一点
        html2canvas(node, {
            width: width,
            heigth: height,
            backgroundColor: "#ffffff", //背景颜色 为null是透明
            dpi: window.devicePixelRatio * 2, //按屏幕像素比增加像素
            scale: scale,
            X: 0,
            Y: 0,
            scrollX: -3, //如果左边多个白边 设置该偏移-3 或者更多
            scrollY: 0,
            useCORS: true, //是否使用CORS从服务器加载图像 !!!
            allowTaint: true //是否允许跨域图像污染画布  !!!
        }).then(canvas => {
            // console.log("canvas", canvas);
            let url = canvas.toDataURL(); //这里上面不设值cors会报错
            let a = document.createElement("a");//创建一个a标签 用来下载
            a.download = filename; //设置下载的图片名称
            let event = new MouseEvent("click");//增加一个点击事件
            a.href = url;//此处的url为base64格式的图片资源
            a.dispatchEvent(event); //触发a的单击事件 即可完成下载
        });
    },
    printQr(vue) {
        vue.$print(vue.$refs.qrArea)
    },
}