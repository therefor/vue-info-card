function contains(list,value) {
    return list.filter(function(item) {
        var prop;
        for (prop in item){
            if (item[prop].toString().toLowerCase().indexOf(value.toLowerCase()) > -1){
                return true;
            }
        }
        return false;
    });
}

//深拷贝一个对象
function deepCopy(o,c){
    var c = c || {};
    for(var i in o){
        if(typeof o[i] === 'object'){
            //深复制
            if(o[i].constructor === Array){
                //这是数组
                c[i] =[];
            }else{
                //这是对象
                c[i] = {};
            }
            deepCopy(o[i],c[i]);
        }else{
            c[i] = o[i];
        }
    }
    return c;
}

var Child = {
    template: "#addOrModifyTemplate",
    props:["title", "mode", "column", "item", "editobj"],
    computed:{
        show: function(){
            if(this.mode !==0){
                return true;
                if( this.mode === 2){
                    this.newItem = deepCopy(this.editobj, this.newItem);
                }
            }else{
                return false;
            }
        },
        newItem: function(){
            switch( this.mode ){
                case 0:
                    return {};
                    break;
                case 1:
                    return {};
                    break;
                case 2:
                    return deepCopy(this.editobj, "");
                    break;
            }
        }
    },
    // watch:{
    //  mode: function(){
    //alert("mode changed!"+ this.mode);
    //   }
//  },
    methods:{
        closeModal: function(){
            this.$emit('closemodal');
        },
        saveItem: function(){
            if( this.checkItem(this.newItem) ){
                var keys;
                for( keys in this.newItem){
                    this.item[keys] = this.newItem[keys];
                }
                this.mode == 1? this.$emit('saveitem'): this.$emit('edititem');
                this.closeModal();
            }
        },checkItem: function(arr){
            var i, j;
            for( i = 0; i < this.column.length; i++){
                j = this.column[i];
                if ( !arr[j.name] || typeof(arr[j.name]) !== j.type){
                    alert("please check the " + j.name);
                    return false;
                }else if ( j.name === "age" ){
                    if (arr[j.name] <= 0){
                        alert("please input the right " + j.name);
                        return false;
                    }else{
                        this.newItem[j.name] = Math.ceil(this.newItem[j.name]);
                    }
                }
            }
            return true;
        }
    }
}

Vue.component( 'simple-grid', {
    template: '#grid-template',
    data: function(){
        return{
            mode: 0,//0：关闭modal； 1：开启modal，添加模式； 2：开启modal，修改模式
            title:'Creat New Item',
            index: -1,// 用于edit或delete的项目，在筛选后的新数组findBy的index
            editObj: {},// 用于在edit模式下深拷贝需要edit的条目
            item:{}
        }
    },
    props:['dataList', 'columns', 'searchKey'],
    computed:{
        findBy: function(){
            return contains(this.dataList, this.searchKey);
        }
    },
    methods:{
        findItem: function(index){
            var i;
            for ( i = 0; i < this.dataList.length; i++){
                if( this.dataList[i].name === this.findBy[index].name){

                    return i;
                }
            }
        },
        deleteItem: function(index){
            var i = this.findItem(index);
            this.dataList.splice(i, 1);
        },
        editItem: function(){
            var i = this.findItem(this.index);
            var j = this.dataList[i];
            var keys;
            for( keys in j){
                j[keys] = this.item[keys];
            }
            this.item = {};
        },
        pushItem: function(){
            this.dataList.push(this.item);
            this.item = {};
        },
        resetItem: function(){

        },
        openModal: function(text, mode, index){
            this.title = text;
            this.mode = mode;
            if ( index >=0) { this.index = index}
            if ( this.mode === 2 ) {
                this.editObj = deepCopy(this.findBy[index], this.editObj);
            }
            this.$emit("resetitem");
        },
        close: function(){
            this.mode = 0;
            this.index = -1;
        },
        beforeEnter: function (el) {
            el.style.opacity = 0
            el.style.height = 0
        },
        enter: function (el, done) {
            var delay = el.dataset.index * 150
            setTimeout(function () {
                Velocity(
                    el,
                    { opacity: 1, height: '1.6em' },
                    { complete: done }
                )
            }, delay)
        },
        leave: function (el, done) {
            var delay = el.dataset.index * 150
            setTimeout(function () {
                Velocity(
                    el,
                    { opacity: 0, height: 0 },
                    { complete: done }
                )
            }, delay)
        }
    },
    filters: {
        capitalize: function (value) {
            if (!value) { return ''};
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    },
    components:{
        "addOrModify": Child
    }
})

var demo = new Vue({
    el:'#app',
    data: {
        searchQuery: '',
        item: {},
        columns: [{
            name: 'name',
            isKey: true,
            type: "string"
        }, {
            name: 'age',
            number: true,
            type: "number"
        }, {
            name: 'sex',
            dataSource: ['Male', 'Female'],
            type: "string"
        }],
        people: [{
            name: 'Jack',
            age: 30,
            sex: 'Male'
        }, {
            name: 'Bill',
            age: 26,
            sex: 'Male'
        }, {
            name: 'Tracy',
            age: 22,
            sex: 'Female'
        }, {
            name: 'Chris',
            age: 36,
            sex: 'Male'
        }]
    }
}) 