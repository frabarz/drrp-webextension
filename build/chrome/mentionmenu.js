!function(e,t){"use strict";function n(e){var n=t.querySelector(e),r=t.createElement("button");return r.href="#",r.className="drtrial-menubtn drtrial-insertmention",r.textContent="Mention",n.insertBefore(r,n.firstElementChild),r}function r(e,t){var n=t.target;if(n.matches(".drtrial-mention span")&&(n=n.parentNode),n.matches(".drtrial-mention")){var r=0,a=n.querySelector(".character-name").textContent,i=n.querySelector(".user-name").textContent,l=e.parentNode.querySelector("input.drtrial-formfinder").form,o=l.querySelector(".usertext-edit textarea");" "!=o.value.substr(o.textLength-1,1)&&(o.value+=" "),r=o.textLength,o.value+=a+"^^"+i+" ",o.focus(),o.setSelectionRange(r,r+a.length),this.remove(),l=null,o=null}}-1!=t.title.toLowerCase().indexOf("class trial")&&(n(".usertext-edit .bottom-area"),e.addListener("rolesidentified",function(n){t.querySelector(".commentarea").addEventListener("click",function(a){if(a.target.classList.contains("drtrial-insertmention")){a.preventDefault(),a.stopPropagation();for(var i=t.querySelectorAll(".drtrial-modal"),l=i.length;l--;)i[l].remove();i=e.createModal("MENTION SELECTOR"),i.body.classList.add("drtrial-mentionmenu"),i.body.addEventListener("click",r.bind(i.body,a.target),!0),t.body.appendChild(i.body);var o,d;for(l=0;l<e.NAMES.length;l++)l in n&&n[l]in n&&l==n[n[l]]&&(o=t.createElement("a"),o.className="drtrial-mention",i.body.appendChild(o),d=t.createElement("span"),d.className="flair "+e.FLAIRS[l],o.appendChild(d),d=t.createElement("span"),d.className="character-name",d.textContent=e.NAMES[l],o.appendChild(d),d=t.createElement("span"),d.className="user-name",d.textContent="/u/"+n[l],o.appendChild(d))}},!0)}))}(window.DRreddit,document);