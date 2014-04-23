/*
 * Licence CC-BY-SA 3.0 Kaligula 2013+ (script, icons)
 *  http://creativecommons.org/licenses/by-sa/3.0/
 *
 */
 
function searchResults(r) {
	var i,ch,a,b,c,d,e,f;
	var container=document.querySelector('#searchResults').firstChild;
	container.innerHTML='';
	for (i=0;i<r.length;i++) {
		a=document.createElement( r[i].title!='' ? 'a' : 'span' );
			a.setAttribute('href',r[i].url);
			a.setAttribute('title',r[i].url);
			a.setAttribute('dateAdded',r[i].dateAdded);
			a.setAttribute('objectId',r[i].id);
			a.setAttribute('index',r[i].index);
			a.setAttribute('parentId',r[i].parentId);
			a.setAttribute('target','blank');
			a.appendChild(document.createTextNode( r[i].title!='' ? r[i].title : '(bookmark without name)') );
		ch=document.createElement('li');
			ch.appendChild(a);
		container.appendChild(ch);
	}
}

function init() {
	var s=document.querySelector('#search')
	s.addEventListener('input',function(evt){
		if(this.value.length>2){
			chrome.bookmarks.search(this.value,searchResults);
		} else {
			document.querySelector('#searchResults').firstChild.innerHTML='';
		}
	});
	s.focus();
}

window.onload=init;