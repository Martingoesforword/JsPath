a = {
    "reward":[
        {
            "type":1,
            "data":[
                1,2,3
            ]
        },
        {
            "type":2,
            "data":[
                3,4,5
            ]
        }
    ]
}
//直接map类
var isKey = function (pos) {
    if(pos[0] === '$'){
        return true;
    }
    return false;
}
//直接数组类
var isIndex = function (pos) {
    if(pos[0] === '*'){
        return true;
    }
    return false;
}
//条件类
var isCondition = function (pos) {
    if(pos[0] === '!'){
        return true;
    }
    return false;
}
var genCondition = function (pos) {
    var keyFrom = pos.indexOf('$')+1;
    var keyTo = pos.indexOf('=');
    var valueFrom = pos.indexOf('=')+1;
    var valueTo = pos.indexOf(')');
    return {
        key:pos.slice(keyFrom, keyTo),
        value:pos.slice(valueFrom, valueTo)
    }
}
var findDataByPath = function (jsObj, path) {
    var poses = path.split('/');

    var curObj = jsObj;
    for(var index in poses){
        var pos = poses[index];
        if(pos === ""){
            continue;
        }
        if(isCondition(pos)){
            //condition
            var condition = genCondition(pos);
            var findObj = undefined;
            for(var sub in curObj){
                var subValue = curObj[sub];
                if(subValue[condition.key].toString() === condition.value) {
                    findObj = curObj[sub];
                    break;
                }
            }
            if(findObj === undefined){
                if(!nextObj) {
                    return {
                        success: false,
                        ret: curObj,
                    }
                }
            } else {
                curObj = findObj;
            }
        }else if(isKey(pos)) {
            //map
            var key = pos.slice(1);
            var nextObj = curObj[key];
            if(!nextObj) {
                return {
                    success: false,
                    ret: curObj,
                }
            }
            curObj = nextObj;
        }else if(isIndex(pos)) {
            //index
            var index = parseInt(pos.slice(1));
            nextObj = curObj[index];
            if(!nextObj) {
                return {
                    success: false,
                    ret: curObj,
                }
            }
            curObj = nextObj;
        } else {
            return {
                success: false,
                ret: curObj,
            }
        }
    }
    return {
        success: true,
        ret: curObj,
    }
}

//map根据key找，arr根据下标找
var song = findDataByPath(a, "/$reward/!($type=2)/$data/*0");

console.log(song);