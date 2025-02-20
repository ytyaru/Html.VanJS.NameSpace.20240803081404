window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const {h1, p} = van.tags
    const author = 'ytyaru'
    van.add(document.querySelector('main'), 
        h1(van.tags.a({href:`https://github.com/${author}/Html.VanJS.NameSpace.20240803081404/`}, 'NameSpace')),
        p('名前空間を生成する。'),
//        p('Generate a namespace.'),
    )
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make())
    const a = new Assertion()
    const bb = new BlackBox(a)
    a.t('ns' in window)
    a.t(Type.isFn(ns))
    a.e(NamespaceError, `Only objects are valid arguments.`, ()=>ns('A'))
    a.t('Proxy(Namespace)'===ns({}).typeName)
    bb.test(ns, [
        [[{a:'A'}], (ns)=>ns.a==='A'],
        [[{b:'B'}], (ns)=>ns.b==='B'],
        [[{a:'A', b:'B'}], (ns)=>ns.a==='A' && ns.b==='B'],
        [[{a:()=>{return 'A'}}], (ns)=>Type.isFn(ns.a) && ns.a()==='A'],
        [[{a:{A:'A'}}], (ns)=>ns.a.A==='A'],
    ])
    a.e(NamespaceError, `Does not exist: x`, ()=>{
        const N = ns({a:'A'})
        N.x
    })
    a.e(NamespaceError, `Cannot be assigned to a Namespace.`, ()=>{
        const N = ns({a:'A'})
        N.a = 'a'
    })
    a.e(NamespaceError, `Cannot be assigned to a Namespace.`, ()=>{
        const N = ns({a:{A:'A'}})
        N.a = 'a'
    })
    // 末端のオブジェクトAも名前空間になってしまう（それは名前空間でなく値としてのオブジェクトであってほしい）
    a.e(NamespaceError, `Cannot be assigned to a Namespace.`, ()=>{
        const N = ns({a:{A:'A'}})
        a.t('Proxy(Namespace)'===N.a.typeName)
        N.a.A = 'a' // A は名前空間になってしまう
    })
    // Dictを使う（末端のオブジェクトをオブジェクト風の値にするための型Dict）
    a.t(()=>{
        const N = ns({a:Dict.of({A:'A'})})
        N.a.A = 'X'
        return 'X'===N.a.A && 'Proxy(Dict)'===N.a.typeName; // AはDict型（辞書風の変数として使える）
    })

    a.fin()
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

