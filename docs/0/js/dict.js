class Dict { // Dict/HashMap    varNm[key] で参照できる非Object型
    static of(obj) {
        if (Type.isObj(obj) && 0<Object.keys(obj).length) { this._v = Object.entries(obj) }
        else if (Type.isAry(obj) && 0<obj.length && obj.every(v=>2<=v.length && Type.isStr(v[0]))) { this._v = obj }
        else { throw new TypeError(`引数は{k:'v',...}か[[key, value],...]のみ有効です。キーと値の組合せが一つ以上必要です。キーは文字列型のみ有効です。`) }
        this._v = new Map(this._v)
        return new Proxy(new Map(this._v), {
            set(target, key, value, receiver) {
                if (key.startsWith('[') && key.endsWith(']')) {
                    const k = key.slice(1, key.length-2)
                    if (target.has(k)) { return target.set(k, value) }
                }
                if (Type.hasSetter(target, key)) { return Reflect.set(target, key, value) }
                if (target.has(key)) { return target.set(key, value) }
                throw new ReferenceError(`Does not exist: ${key}`)
            },
            get(target, key, receiver) {
                if ('typeName'===key) { return 'Proxy(Dict)' }
                console.log(target, key)
                if (key in target) {
                    if (Type.hasGetter(target, key)) { return Reflect.get(target, key) } // ゲッター
                    else if ('function'===typeof target[key]) { return target[key].bind(target) } // メソッド参照
                    return target[key] // プロパティ値
                }
                if (target.has(key)) { return target.get(key) }
                if (key.startsWith('[') && key.endsWith(']')) {
                    const k = key.slice(1, key.length-2)
                    if (target.has(k)) { return target.get(k) }
                }
                throw new ReferenceError(`Does not exist: ${key}`)
            },
        })

    }
    constructor(obj) { return Dict.of(obj) }
}
