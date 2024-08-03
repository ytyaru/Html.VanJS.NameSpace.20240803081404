class NamespaceError extends Error { constructor(msg='Does not Exist.') { super(msg); this.name='NamespaceError' } }
// 名前空間を生成する（Objectはすべて名前空間になる（Object型の値まで名前空間になってしまう））
function ns(obj) {
    if (!Type.isObj(obj)) { throw new NamespaceError(`Only objects are valid arguments.`) }
    function recursion(obj) { // 再帰
        if (Type.isObj(obj)) {
            for (let key of Object.keys(obj)) {
                if (Type.isObj(obj[key])) { console.log(key, obj);obj[key] = recursion(obj[key]) }
            }
            return new Proxy(obj, {
                set(target, key, value, receiver) { throw new NamespaceError(`Cannot be assigned to a Namespace.`) },
                get(target, key, receiver) {
                    if ('typeName'===key) { return 'Proxy(Namespace)' }
                    if (key in target) { return target[key] }
                    else { throw new NamespaceError(`Does not exist: ${key}`) }
                },
            })
        } else { return obj }
    }
    return recursion(obj)
}

