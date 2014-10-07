1935c1935,1937
<   return schema + '://' + this.hostname + port + this.path + query;
---
>   console.log("A! " + document.location.href.replace(/\/$/, '') + this.path + query + "  VS  " + schema + '://' + this.hostname + port + this.path + query);
>   return document.location.href.replace(/\/$/, '') + this.path + query;
>   //return schema + '://' + this.hostname + port + this.path + query;
2522d2523
< 
2592c2593,2602
<   return schema + '://' + this.hostname + port + this.path + query;
---
>   var __tmp = document.location.href.replace(/\/$/, '');
>   //var __tmp = document.location.origin;
>   if (document.location.protocol == 'https:') {
>       __tmp = __tmp.replace(/^https/, 'wss');
>   } else {
>       __tmp = __tmp.replace(/^http/, 'ws');
>   }
>   console.log("B! " + __tmp  + this.path + query + "  VS  " + schema + '://' + this.hostname + port + this.path + query);
>   return __tmp + this.path + query;
>   //return schema + '://' + this.hostname + port + this.path + query;
