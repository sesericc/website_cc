/* base.js
    - テンプレート定義
    - テンプレート展開
    - mdコンテンツ設置
    - head処理
    - body処理
 */
;( ()=>{

    'use strict';

    // テンプレート定義
    const template = {
        name: 'チェンクロのメモ帳',
        author: 'seseri',
        tags: {
            head: [
                { tag: 'meta', name: 'viewport', content: 'width=device-width' },
                { tag: 'link', rel: 'stylesheet', href: './core/css/base.css' },
                { tag: 'link', rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
                { tag: 'script', src: './core/js/marked.min.js' },
                { tag: 'script', src: './core/js/ga.js' }
            ],
            body: [
                { tag: 'header', className: 'header wrapper', inner: [
                    { tag: 'div', className: 'content', inner: [
                        { tag: 'i', className: 'material-icons menu', id: 'menuSwitch', text: 'menu' },
                        { tag: 'h1', id: 'contentTitle' },
                        { tag: 'i', className: 'material-icons info', text: 'info_outline' }
                    ] }
                ] },
                { tag: 'div', className: 'main wrapper', inner: [
                    { tag: 'article', className: 'content', inner: [
                        { tag: 'div', className: 'container', id: 'mainContent' }
                    ] }/*,
                    { tag: 'a', id: 'toTop', href: '#', inner: [
                        { tag: 'i', className: 'material-icons', text: 'arrow_upward' }
                    ] }*/
                ] },
                { tag: 'nav', className: 'nav wrapper', id: 'siteMenu', inner: [
                    { tag: 'div', className: 'content', inner: [
                        {tag: 'ul', id: 'contentMenu', inner: [
                            { tag: 'li', className: 'close', inner: [
                                { tag: 'i', className: 'material-icons', text: 'arrow_back' },
                                { tag: 'span', text: 'とじる' }
                            ] },
                            { tag: 'li', inner: [
                                { tag: 'a', href: './', inner: [
                                    { tag: 'i', className: 'material-icons', text: 'home' },
                                    { tag: 'span', text: 'ホーム' }
                                ] }
                            ] },
                            { tag: 'li', className: 'noicon', inner: [
                                { tag: 'a', href: './chronicle.html', inner: [
                                    { tag: 'i', className: 'material-icons', text: '' },
                                    { tag: 'span', text: 'クロニクル' }
                                ] }
                            ] },
                            { tag: 'li', className: 'noicon', inner: [
                                { tag: 'a', href: './kamisiro.html', inner: [
                                    { tag: 'i', className: 'material-icons', text: '' },
                                    { tag: 'span', text: '上代' }
                                ] }
                            ] },
                            { tag: 'li', inner: [
                                { tag: 'a', href: 'https://twitter.com/seseri_gm', inner: [
                                    { tag: 'i', className: 'material-icons', text: 'open_in_new' },
                                    { tag: 'span', text: '管理者Twitter' }
                                ] }
                            ] }
                        ] }
                    ] }
                ] },
                { tag: 'footer', className: 'footer wrapper', inner: [
                    { tag: 'div', className: 'content', html: '&copy; 2017 seseri_gm' }
                ] }
            ]
        }
    };

    // タグ展開
    function deployTags( asset, to ){
        const c = ( t )=>{
            return document.createElement( t );
        };
        let i = 0,
            l = asset.length,
            f = document.createDocumentFragment()
        ;
        while( i < l ){
            let s = asset[i],
                e = c( s.tag ),
                id = s.id,
                cl = s.className,
                rel = s.rel,
                src = s.src,
                name = s.name,
                href = s.href,
                text = s.text,
                html = s.html,
                inner = s.inner,
                content = s.content
            ;
            if( id ){ e.id = id; } 
            if( cl ){ e.setAttribute( 'class', cl ); }
            if( rel ){ e.setAttribute( 'rel', rel ); }
            if( src ){ e.setAttribute( 'src', src ); }
            if( name ){ e.setAttribute( 'name', name ); }
            if( href ){ e.href = href; }
            if( text ){ e.textContent = text; }
            if( html ){ e.innerHTML = html; }
            if( inner ){ deployTags( inner, e ); }
            if( content ){ e.setAttribute( 'content', content ); }
            f.appendChild( e );
            i = i + 1;
        }
        to.appendChild( f );
    }

    // アンカーフラッシュ
    function setFlashAnchor( a ){
        const area = a || document.body,
            links = area.getElementsByTagName( 'a' ),
            mc = document.getElementById( 'mainContent' ),
            l = links.length
        ;
        const flash = ( e )=>{
            e.preventDefault();
            let target = e.target.href,
                current = location.href
            ;
            if( !target && current.match( /#/ ) ){
                target = current.replace( /#.*/, '#' );
            }else if( !target ){
                target = current + '#';
            }
            mc.classList.add( 'flash' );
            setTimeout( ()=>{
                location.href = target;
                mc.classList.remove( 'flash' );
            } , 250 );
        };
        let i = 0;
        while( i < l ){
            let link = links[i];
            if( link.getAttribute( 'href' ).match( /^#/ ) ){
                if( window.touch ){
                    link.addEventListener( 'touchend', flash );
                }else{
                    link.addEventListener( 'click', flash );
                }
            }
            i = i + 1;
        }
    }

    // md to html
    function convertMd(){
        const mds = document.getElementsByClassName( 'md' ),
            title = document.getElementById( 'contentTitle' ),
            l = mds.length
        ;
        let i = 0;
        marked.setOptions( { breaks: true } );
        while( i < l ){
            let md = mds[i],
                html = marked( md.textContent )
            ;
            md.innerHTML = html;
            setFlashAnchor( md );
            let h = md.getElementsByTagName( 'h1' )[0];
            title.textContent = h.textContent;
            h.parentNode.removeChild( h );
            i = i + 1;
        }
    }

    // md設置
    function setMdContent(){
        function setMD( md ){
            let c = document.getElementById( 'mainContent' ),
                e = document.createElement( 'div' )
            ;
            e.textContent = md;
            e.setAttribute( 'class', 'md' );
            c.appendChild( e );
            convertMd();        
        }
        function getFile( href ){
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'text';
            xhr.addEventListener( 'loadend', ()=>{
                setMD( xhr.response );
            } );
            xhr.open( 'GET', href );
            xhr.send();
        }
        const mdLinks = document.getElementsByClassName( 'mdLink' ),
            l = mdLinks.length
        ;
        if( l === 0 ){
            console.error( '.mdLink not found.' );
        }else{
            const mdLink = mdLinks[0];
            getFile( mdLink.href );
            mdLink.parentNode.removeChild( mdLink );
        }

    }

    // サイトメニュー表示切り換え
    function setMenuSwitch(){
        const s = document.getElementById( 'menuSwitch' ),
            m = document.getElementById( 'siteMenu' )
        ;
        function openMenu(){
            m.classList.add( 'visible' );
        }
        function closeMenu(){
            m.classList.remove( 'visible' );
        }
        if( window.touch ){
            s.addEventListener( 'touchend', openMenu );
            m.addEventListener( 'touchend', closeMenu );
        }else{
            s.addEventListener( 'click', openMenu );
            m.addEventListener( 'click', closeMenu );
        }
    }

    // head部の処理
    ( ()=>{

        const head = document.head;

        if( !document.title ){
            document.title = template.name;
        }/*else{
            document.title += '｜' + template.name;
        }*/

        if( !document.documentElement.lang ){
            document.documentElement.lang = 'ja';
        }

        deployTags( template.tags.head, head );
        
    } )();


    // body部の処理
    ( ()=>{

        window.addEventListener( 'DOMContentLoaded', ()=>{
            
            const body = document.body,
                html = body.innerHTML
            ;
            body.innerHTML = '';
            deployTags( template.tags.body, body );
            document.getElementById( 'mainContent' ).innerHTML = html;
            setMenuSwitch();
            
        } );
    
        window.addEventListener( 'load', () =>{

            setMdContent();
            setFlashAnchor();

        } );

    } )();

} )();
