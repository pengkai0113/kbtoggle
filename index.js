class kbToggle {
    constructor(){
        this.CH = null;
        this.activeElement = null;
    }
    install(Vue){
        Vue.mixin(this.mixin(this))
    }
    mixin(context){
        return {
            data(){
                return {
                    kbToggle:true,
                }
            },
            created() {
                if(context.isPc() || context.CH) return false;
                context.CH = this.CH = document.documentElement.clientHeight || document.body.clientHeight;
                console.log(context)

                window.addEventListener('touchstart',(e)=>{
                    context.activeElement = e.target.name
                },true);

                let userAgentInfo = window.navigator.userAgent;
                if (userAgentInfo.indexOf("Android") > -1 || userAgentInfo.indexOf("Linux") > -1) {
                    //安卓判断resize
                    window.addEventListener('resize',context.windowResize.bind(this));
                }
                if (userAgentInfo.indexOf("iPhone") > -1 || userAgentInfo.indexOf("iOS") > -1) {
                    //ios判断focus、blur
                    window.document.addEventListener('focus',context.toggleFalse.bind(this,context),true);
                    window.document.addEventListener('blur',context.toggleTrue.bind(this,context),true);
                    window.document.addEventListener('change',context.toggleTrueTime.bind(this,context),true);
                }
            },
            watch: {
                kbToggle(newV,oldV){
                    console.log(newV,oldV)
                }
            },
        }
    }
    toggleFalse(context,event){
        if(context.selectToggleTarget(event)){
            if (document.activeElement.name == context.activeElement) {
                this.kbToggle = false;
            }
        }
    }
    toggleTrue(context,event){
        if(context.selectToggleTarget(event)){
            setTimeout(() => {
                this.kbToggle = true;
                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);
        }
    }
    toggleTrueTime(context,event){
        if(context.selectToggleTarget(event)){
            if (event.target.name == document.activeElement.name) {
                setTimeout(() => {
                    this.kbToggle = true;
                }, 50);
            }
        }
    }
    selectToggleTarget(e){
        return e.target.tagName.toLocaleLowerCase()==='input' && e.target.type!='file' ||
        e.target.tagName.toLocaleLowerCase()==='textarea';
    }
    windowResize(){
        //键盘弹起与隐藏都会引起窗口的高度发生变化
        let resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
        if (resizeHeight == this.CH){
            //当软键盘收起
            this.kbToggle = true;
        }else{
            this.kbToggle = false;
        }
    }
    isPc(){
        //PC端不触发
        let userAgentInfo = window.navigator.userAgent;
        let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        for (let v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                return false;
            }
        }
        return true;
    }
}

export default new kbToggle;