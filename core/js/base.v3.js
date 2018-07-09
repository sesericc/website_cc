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
              { tag: 'i', className: 'material-icons', text: 'home' }
            ] },
            { tag: 'a', href: '#', id: 'toIndex', inner: [
              { tag: 'i', className: 'material-icons', text: 'arrow_upward' }
            ] }
          ] }
        ] }
      ]
    }
  };

  // テンプレートタグ展開
  function deployTmp( tags, to ){
    const f = document.createDocumentFragment();
    for( let i = 0, l = tags.length; i < l; i += 1 ){
      const t = tags[i];
      const e = document.createElement( t.tag );
      if( t.id ) e.id = t.id;
      if( t.className ) e.setAttribute( 'class', t.className );
      if( t.rel ) e.setAttribute( 'rel', t.rel );
      if( t.src ) e.setAttribute( 'src', t.src );
      if( t.name ) e.setAttribute( 'name', t.name );
      if( t.href ) e.href = t.href;
      if( t.text ) e.textContent = t.text;
      if( t.html ) e.innerHTML = t.html;
      if( t.inner ) deployTmp( t.inner, e );
      if( t.content ) e.setAttribute( 'content', t.content );
      f.appendChild( e );
    }
    to.appendChild( f );
  }

  // テンプレートを展開したフラグメントを取得
  function getFragmentByTmp( tags ){
    const f = document.createDocumentFragment();
    deployTmp( tags, f );
    return f;
  }

  function getMdText( links ){
    const l = links.length;
    if( l ){
      for( let i = 0; i < l; i++ ){
        const link = links[i];
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'text';
        xhr.addEventListener( 'loadend', ()=>{
          mdText += xhr.response;
          link.parentNode.removeChild( link );
        } );
        xhr.open( 'GET', link.href );
        xhr.send();
      }
    }else{
      console.log( 'Not found mdLink.' );
    }
  }

  function convertMd( t ){
    marked.setOptions( { breaks: true } );
    const div = document.createElement( 'div' );
    div.setAttribute( 'class', 'md' );
    div.innerHTML = marked( t );
    document.getElementById( 'mainContent' ).insertAdjacentHTML( 'beforeend', div.outerHTML );
  }

  // head
  const head = document.head,
    fragHead = getFragmentByTmp( template.tags.head ),
    fragBody = getFragmentByTmp( template.tags.body )
  ;
  let mdText = '';
  if( !document.title ) document.title = template.name;
  if( !document.documentElement.lang ) document.documentElement.lang = 'ja';
  head.appendChild( fragHead );

  // body
  window.addEventListener( 'DOMContentLoaded', ()=>{
    const body = document.body;
    const html = body.innerHTML;
    body.innerHTML = '';
    body.appendChild( fragBody );
    document.getElementById( 'mainContent' ).insertAdjacentHTML( 'beforeend', html );
    getMdText( document.getElementsByClassName( 'mdLink' ) );
  } );

  //
  window.addEventListener( 'load', ()=>{
    convertMd( mdText );
  } );

} )();
