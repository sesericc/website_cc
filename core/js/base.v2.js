;( ()=>{
    
    'use strict';

    // テンプレート定義
    const template = {
        url: 'cc.ismop.info',
        title: 'ClipChronicle',
        author: 'seseri',
        tags: {
            head: [
                { tag: 'meta', name: 'viewport', content: 'width=device-width' },
                { tag: 'link', rel: 'stylesheet', href: './core/css/base.v2.css' },
                { tag: 'link', rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
                { tag: 'link', rel: 'stylesheet', href: 'https://fonts.googleapis.com/earlyaccess/notosansjapanese.css' },
                { tag: 'link', rel: 'stylesheet', href: 'https://fonts.googleapis.com/earlyaccess/kokoro.css' },
                { tag: 'link', rel: 'stylesheet', href: 'https://fonts.googleapis.com/earlyaccess/sawarabimincho.css' },
                { tag: 'script', src: './core/js/marked.min.js' },
                { tag: 'script', src: './core/js/ga.js' }
            ],
            body: [
                { tag: 'main', className: 'wrapper', inner: [
                    { tag: 'article', className: 'content', id: 'mainContent' },
                    { tag: 'div', className: 'content', id: 'contentEnd', inner: [
                        { tag: 'a', href: './', id: 'back', inner: [
                            { tag: 'i', className: 'material-icons', text: 'home' },
                            { tag: 'span', text: 'もどる' }
                        ] }
                    ] }
                ] },
                { tag: 'footer', className: 'wrapper', id: 'fixedFooter', inner: [
                    { tag: 'div', className: 'content flex', inner: [
                        { tag: 'a', href: './', id: 'toHome', inner: [
                            { tag: 'i', className: 'material-icons', text: 'home' }/*,
                            { tag: 'span', text: 'HOME' }*/
                        ] },
                        { tag: 'a', href: '#', id: 'toIndex', inner: [
                            { tag: 'i', className: 'material-icons', text: 'arrow_upward' }
                        /*] },
                        { tag: 'a', href: '#headline', id: 'toHeadline', inner: [
                            { tag: 'i', className: 'material-icons', text: 'list' },
                            { tag: 'span', text: 'MENU' }
                        */] }
                    ] }
                ] }
            ]
        }
    };

    // テンプレート展開
    function deployTemplate( template, to ){
        const f = document.createDocumentFragment();
        for( let i = 0, l = template.length; i < l; i += 1 ){
            const t = template[i],
                e = document.createElement( t.tag ),
                id = t.id,
                cl = t.className,
                rel = t.rel,
                src = t.src,
                name = t.name,
                href = t.href,
                text = t.text,
                html = t.html,
                inner = t.inner,
                content = t.content
            ;
            if( id ){ e.id = id; } 
            if( cl ){ e.setAttribute( 'class', cl ); }
            if( rel ){ e.setAttribute( 'rel', rel ); }
            if( src ){ e.setAttribute( 'src', src ); }
            if( name ){ e.setAttribute( 'name', name ); }
            if( href ){ e.href = href; }
            if( text ){ e.textContent = text; }
            if( html ){ e.innerHTML = html; }
            if( inner ){ deployTemplate( inner, e ); }
            if( content ){ e.setAttribute( 'content', content ); }
            f.appendChild( e );
        }
        to.appendChild( f );
    }

    // タグ展開済みのフラグメントを取得
    function getFragment( t ){
        const f = document.createDocumentFragment();
        deployTemplate( t, f );
        return f;
    }

    function setMdContent( f ){
        const links = f.getElementsByClassName( 'mdLink' );
        const putMdElm = v =>{
            const div = document.createElement( 'div' );
            div.setAttribute( 'class', 'md' );
            div.textContent = v;
            window.addEventListener( 'load', ()=>{
                marked.setOptions( { breaks: true } );
                div.innerHTML = marked( div.textContent );
                f.appendChild( div );
            } );
        };
        const getResponse = ( path, type ) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = type;
            xhr.addEventListener( 'loadend', ()=>{
                putMdElm( xhr.response );
            } );
            xhr.open( 'GET', path );
            xhr.send();
        };
        const l = links.length;
        if( l >= 0 ){
            for( let i = 0; i < l; i++ ){
                const link = links[i],
                    href = link.href
                ;
                link.parentNode.removeChild( link );
                getResponse( href, 'text' );
            }
        }
    }

    // head読込時の処理
    const temp = template.tags,
        fragHead = getFragment( temp.head ),
        fragBody = getFragment( temp.body ),
        fragMain = fragBody.getElementById( 'mainContent' )
    ;
    if( !document.documentElement.lang ){
        document.documentElement.lang = 'ja';
    }
    document.head.appendChild( fragHead );

    // body要素読込時の処理
    window.addEventListener( 'DOMContentLoaded', ()=>{
        const body = document.body;
        fragMain.insertAdjacentHTML( 'beforeend', body.innerHTML );
        body.innerHTML = '';
        setMdContent( fragMain );
        body.appendChild( fragBody );
    } );


} )();