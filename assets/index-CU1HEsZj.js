(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=1e3,t=1001,n=1002,r=1003,i=1004,a=1005,o=1006,s=1007,c=1008,l=1009,u=1010,d=1011,f=1012,p=1013,m=1014,h=1015,g=1016,_=1017,v=1018,y=1020,b=35902,x=35899,S=1021,C=1022,w=1023,T=1026,E=1027,D=1028,O=1029,k=1030,A=1031,j=1033,M=33776,ee=33777,N=33778,te=33779,P=35840,ne=35841,F=35842,re=35843,ie=36196,ae=37492,oe=37496,se=37488,I=37489,ce=37490,le=37491,ue=37808,de=37809,L=37810,fe=37811,pe=37812,me=37813,he=37814,ge=37815,_e=37816,ve=37817,R=37818,ye=37819,be=37820,xe=37821,Se=36492,Ce=36494,we=36495,Te=36283,Ee=36284,De=36285,Oe=36286,ke=2300,Ae=2301,z=2302,je=2303,Me=2400,Ne=2401,B=2402,Pe=3200,Fe=`srgb`,V=`srgb-linear`,H=`linear`,Ie=`srgb`,Le=7680,Re=35044,ze=2e3;function Be(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Ve(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function He(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Ue(){let e=He(`canvas`);return e.style.display=`block`,e}var We={};function Ge(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Ke(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function U(...e){e=Ke(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function W(...e){e=Ke(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function qe(...e){let t=e.join(` `);t in We||(We[t]=!0,U(...e))}function Je(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var Ye={0:0,2:6,4:4,3:5,1:1,6:2,7:7,5:3},Xe=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},Ze=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),Qe=Math.PI/180,$e=180/Math.PI;function et(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Ze[e&255]+Ze[e>>8&255]+Ze[e>>16&255]+Ze[e>>24&255]+`-`+Ze[t&255]+Ze[t>>8&255]+`-`+Ze[t>>16&15|64]+Ze[t>>24&255]+`-`+Ze[n&63|128]+Ze[n>>8&255]+`-`+Ze[n>>16&255]+Ze[n>>24&255]+Ze[r&255]+Ze[r>>8&255]+Ze[r>>16&255]+Ze[r>>24&255]).toLowerCase()}function G(e,t,n){return Math.max(t,Math.min(n,e))}function tt(e,t){return(e%t+t)%t}function nt(e,t,n){return(1-n)*e+n*t}function rt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function it(e){switch(e.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function at(e,t){if(t.constructor===Float32Array)return e;let n=it(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.max(e/n,-1)}function ot(e,t){if(t.constructor===Float32Array)return e;let n=it(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.round(e*n)}var st=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=G(this.x,e.x,t.x),this.y=G(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=G(this.x,e,t),this.y=G(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(G(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(G(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ct=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:U(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(G(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},K=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ut.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ut.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=G(this.x,e.x,t.x),this.y=G(this.y,e.y,t.y),this.z=G(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=G(this.x,e,t),this.y=G(this.y,e,t),this.z=G(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(G(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return lt.copy(this).projectOnVector(e),this.sub(lt)}reflect(e){return this.sub(lt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(G(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},lt=new K,ut=new ct,q=class{static{this.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return qe(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(dt.makeScale(e,t)),this}rotate(e){return qe(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(dt.makeRotation(-e)),this}translate(e,t){return qe(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(dt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},dt=new q,ft=new q().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),pt=new q().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function mt(){let e={enabled:!0,workingColorSpace:V,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=gt(e.r),e.g=gt(e.g),e.b=gt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=_t(e.r),e.g=_t(e.g),e.b=_t(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?H:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[n].fromXYZ).multiply(this.spaces[t].toXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[V]:{primaries:t,whitePoint:r,transfer:H,toXYZ:ft,fromXYZ:pt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Fe},outputColorSpaceConfig:{drawingBufferColorSpace:Fe}},[Fe]:{primaries:t,whitePoint:r,transfer:Ie,toXYZ:ft,fromXYZ:pt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Fe}}}),e}var ht=mt();function gt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function _t(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var vt,yt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{vt===void 0&&(vt=He(`canvas`)),vt.width=e.width,vt.height=e.height;let t=vt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=vt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=He(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=gt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(gt(t[e]/255)*255):t[e]=gt(t[e]);return{data:t,width:e.width,height:e.height}}return U(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},bt=0,xt=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:bt++}),this.uuid=et(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width||0,t.height||0,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(St(r[t].image)):e.push(St(r[t]))}else e=St(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function St(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?yt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(U(`Texture: Unable to serialize Texture.`),{})}var Ct=0,wt=new K,Tt=class r extends Xe{constructor(e=r.DEFAULT_IMAGE,n=r.DEFAULT_MAPPING,i=t,a=t,s=o,u=c,d=w,f=l,p=r.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ct++}),this.uuid=et(),this.name=``,this.source=new xt(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=u,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=f,this.offset=new st(0,0),this.repeat=new st(1,1),this.center=new st(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new q,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(wt).x}get height(){return this.source.getSize(wt).y}get depth(){return this.source.getSize(wt).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){U(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?U(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(r){if(this.mapping!==300)return r;if(r.applyMatrix3(this.matrix),r.x<0||r.x>1)switch(this.wrapS){case e:r.x-=Math.floor(r.x);break;case t:r.x=r.x<0?0:1;break;case n:Math.abs(Math.floor(r.x)%2)===1?r.x=Math.ceil(r.x)-r.x:r.x-=Math.floor(r.x)}if(r.y<0||r.y>1)switch(this.wrapT){case e:r.y-=Math.floor(r.y);break;case t:r.y=r.y<0?0:1;break;case n:Math.abs(Math.floor(r.y)%2)===1?r.y=Math.ceil(r.y)-r.y:r.y-=Math.floor(r.y)}return this.flipY&&(r.y=1-r.y),r}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Tt.DEFAULT_IMAGE=null,Tt.DEFAULT_MAPPING=300,Tt.DEFAULT_ANISOTROPY=1;var Et=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=G(this.x,e.x,t.x),this.y=G(this.y,e.y,t.y),this.z=G(this.z,e.z,t.z),this.w=G(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=G(this.x,e,t),this.y=G(this.y,e,t),this.z=G(this.z,e,t),this.w=G(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(G(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Dt=class extends Xe{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:o,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Et(0,0,e,t),this.scissorTest=!1,this.viewport=new Et(0,0,e,t),this.textures=[];let r=n.count;for(let i=0;i<r;i++)this.textures[i]=new Tt({width:e,height:t,depth:n.depth}),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:o,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new xt(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Ot=class extends Dt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},kt=class extends Tt{constructor(e=null,n=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},At=class extends Tt{constructor(e=null,n=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},jt=class e{static{this.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Mt.setFromMatrixColumn(e,0).length(),i=1/Mt.setFromMatrixColumn(e,1).length(),a=1/Mt.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Pt,e,Ft)}lookAt(e,t,n){let r=this.elements;return Rt.subVectors(e,t),Rt.lengthSq()===0&&(Rt.z=1),Rt.normalize(),It.crossVectors(n,Rt),It.lengthSq()===0&&(Math.abs(n.z)===1?Rt.x+=1e-4:Rt.z+=1e-4,Rt.normalize(),It.crossVectors(n,Rt)),It.normalize(),Lt.crossVectors(Rt,It),r[0]=It.x,r[4]=Lt.x,r[8]=Rt.x,r[1]=It.y,r[5]=Lt.y,r[9]=Rt.y,r[2]=It.z,r[6]=Lt.z,r[10]=Rt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],ee=r[3],N=r[7],te=r[11],P=r[15];return i[0]=a*x+o*T+s*k+c*ee,i[4]=a*S+o*E+s*A+c*N,i[8]=a*C+o*D+s*j+c*te,i[12]=a*w+o*O+s*M+c*P,i[1]=l*x+u*T+d*k+f*ee,i[5]=l*S+u*E+d*A+f*N,i[9]=l*C+u*D+d*j+f*te,i[13]=l*w+u*O+d*M+f*P,i[2]=p*x+m*T+h*k+g*ee,i[6]=p*S+m*E+h*A+g*N,i[10]=p*C+m*D+h*j+g*te,i[14]=p*w+m*O+h*M+g*P,i[3]=_*x+v*T+y*k+b*ee,i[7]=_*S+v*E+y*A+b*N,i[11]=_*C+v*D+y*j+b*te,i[15]=_*w+v*O+y*M+b*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Mt.set(r[0],r[1],r[2]).length(),o=Mt.set(r[4],r[5],r[6]).length(),s=Mt.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Nt.copy(this);let c=1/a,l=1/o,u=1/s;return Nt.elements[0]*=c,Nt.elements[1]*=c,Nt.elements[2]*=c,Nt.elements[4]*=l,Nt.elements[5]*=l,Nt.elements[6]*=l,Nt.elements[8]*=u,Nt.elements[9]*=u,Nt.elements[10]*=u,t.setFromRotationMatrix(Nt),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=ze,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=ze,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Mt=new K,Nt=new jt,Pt=new K(0,0,0),Ft=new K(1,1,1),It=new K,Lt=new K,Rt=new K,zt=new jt,Bt=new ct,Vt=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(G(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-G(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(G(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-G(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(G(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-G(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:U(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return zt.makeRotationFromQuaternion(e),this.setFromRotationMatrix(zt,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Bt.setFromEuler(this),this.setFromQuaternion(Bt,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Vt.DEFAULT_ORDER=`XYZ`;var Ht=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Ut=0,Wt=new K,Gt=new ct,Kt=new jt,qt=new K,Jt=new K,Yt=new K,Xt=new ct,Zt=new K(1,0,0),Qt=new K(0,1,0),$t=new K(0,0,1),en={type:`added`},tn={type:`removed`},nn={type:`childadded`,child:null},rn={type:`childremoved`,child:null},an=class e extends Xe{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ut++}),this.uuid=et(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new K,n=new Vt,r=new ct,i=new K(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new jt},normalMatrix:{value:new q}}),this.matrix=new jt,this.matrixWorld=new jt,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ht,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Gt.setFromAxisAngle(e,t),this.quaternion.multiply(Gt),this}rotateOnWorldAxis(e,t){return Gt.setFromAxisAngle(e,t),this.quaternion.premultiply(Gt),this}rotateX(e){return this.rotateOnAxis(Zt,e)}rotateY(e){return this.rotateOnAxis(Qt,e)}rotateZ(e){return this.rotateOnAxis($t,e)}translateOnAxis(e,t){return Wt.copy(e).applyQuaternion(this.quaternion),this.position.add(Wt.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Zt,e)}translateY(e){return this.translateOnAxis(Qt,e)}translateZ(e){return this.translateOnAxis($t,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Kt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?qt.copy(e):qt.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Jt.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Kt.lookAt(Jt,qt,this.up):Kt.lookAt(qt,Jt,this.up),this.quaternion.setFromRotationMatrix(Kt),r&&(Kt.extractRotation(r.matrixWorld),Gt.setFromRotationMatrix(Kt),this.quaternion.premultiply(Gt.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(W(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(en),nn.child=e,this.dispatchEvent(nn),nn.child=null):W(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(tn),rn.child=e,this.dispatchEvent(rn),rn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Kt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Kt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Kt),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(en),nn.child=e,this.dispatchEvent(nn),nn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Jt,e,Yt),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Jt,Xt,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};an.DEFAULT_UP=new K(0,1,0),an.DEFAULT_MATRIX_AUTO_UPDATE=!0,an.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var on=class extends an{constructor(){super(),this.isGroup=!0,this.type=`Group`}},sn={type:`move`},cn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new on,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new on,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new K,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new K),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new on,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new K,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new K,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.quaternion,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(sn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new on;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},ln={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},un={h:0,s:0,l:0},dn={h:0,s:0,l:0};function fn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var J=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Fe){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ht.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=ht.workingColorSpace){return this.r=e,this.g=t,this.b=n,ht.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=ht.workingColorSpace){if(e=tt(e,1),t=G(t,0,1),n=G(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=fn(i,r,e+1/3),this.g=fn(i,r,e),this.b=fn(i,r,e-1/3)}return ht.colorSpaceToWorking(this,r),this}setStyle(e,t=Fe){function n(t){t!==void 0&&parseFloat(t)<1&&U(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseFloat(i[1]))/100,Math.min(100,parseFloat(i[2]))/100,Math.min(100,parseFloat(i[3]))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:U(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);U(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Fe){let n=ln[e.toLowerCase()];return n===void 0?U(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=gt(e.r),this.g=gt(e.g),this.b=gt(e.b),this}copyLinearToSRGB(e){return this.r=_t(e.r),this.g=_t(e.g),this.b=_t(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Fe){return ht.workingToColorSpace(pn.copy(this),e),Math.round(G(pn.r*255,0,255))*65536+Math.round(G(pn.g*255,0,255))*256+Math.round(G(pn.b*255,0,255))}getHexString(e=Fe){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ht.workingColorSpace){ht.workingToColorSpace(pn.copy(this),t);let n=pn.r,r=pn.g,i=pn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=ht.workingColorSpace){return ht.workingToColorSpace(pn.copy(this),t),e.r=pn.r,e.g=pn.g,e.b=pn.b,e}getStyle(e=Fe){ht.workingToColorSpace(pn.copy(this),e);let t=pn.r,n=pn.g,r=pn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(un),this.setHSL(un.h+e,un.s+t,un.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(un),e.getHSL(dn);let n=nt(un.h,dn.h,t),r=nt(un.s,dn.s,t),i=nt(un.l,dn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},pn=new J;J.NAMES=ln;var mn=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new J(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},hn=class extends an{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Vt,this.environmentIntensity=1,this.environmentRotation=new Vt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background===null?null:e.background.clone(),this.environment=e.environment===null?null:e.environment.clone(),this.fog=e.fog===null?null:e.fog.clone(),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial===null?null:e.overrideMaterial.clone(),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},gn=new K,_n=new K,vn=new K,yn=new K,bn=new K,xn=new K,Sn=new K,Cn=new K,wn=new K,Tn=new K,En=new Et,Dn=new Et,On=new Et,kn=class e{constructor(e=new K,t=new K,n=new K){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),gn.subVectors(e,t),r.cross(gn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){gn.subVectors(r,t),_n.subVectors(n,t),vn.subVectors(e,t);let a=gn.dot(gn),o=gn.dot(_n),s=gn.dot(vn),c=_n.dot(_n),l=_n.dot(vn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,yn)!==null&&yn.x>=0&&yn.y>=0&&yn.x+yn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,yn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,yn.x),s.addScaledVector(a,yn.y),s.addScaledVector(o,yn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return En.setScalar(0),Dn.setScalar(0),On.setScalar(0),En.fromBufferAttribute(e,t),Dn.fromBufferAttribute(e,n),On.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(En,i.x),a.addScaledVector(Dn,i.y),a.addScaledVector(On,i.z),a}static isFrontFacing(e,t,n,r){return gn.subVectors(n,t),_n.subVectors(e,t),gn.cross(_n).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return gn.subVectors(this.c,this.b),_n.subVectors(this.a,this.b),gn.cross(_n).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;bn.subVectors(r,n),xn.subVectors(i,n),Cn.subVectors(e,n);let s=bn.dot(Cn),c=xn.dot(Cn);if(s<=0&&c<=0)return t.copy(n);wn.subVectors(e,r);let l=bn.dot(wn),u=xn.dot(wn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0&&s-l>0)return a=s/(s-l),t.copy(n).addScaledVector(bn,a);Tn.subVectors(e,i);let f=bn.dot(Tn),p=xn.dot(Tn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(xn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Sn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Sn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(bn,a).addScaledVector(xn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},An=class{constructor(e=new K(1/0,1/0,1/0),t=new K(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Mn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Mn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Mn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Mn):Mn.fromBufferAttribute(r,t),Mn.applyMatrix4(e.matrixWorld),this.expandByPoint(Mn);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Nn.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Nn.copy(e.boundingBox)),Nn.applyMatrix4(e.matrixWorld),this.union(Nn)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Mn),Mn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Bn),Vn.subVectors(this.max,Bn),Pn.subVectors(e.a,Bn),Fn.subVectors(e.b,Bn),In.subVectors(e.c,Bn),Ln.subVectors(Fn,Pn),Rn.subVectors(In,Fn),zn.subVectors(Pn,In);let t=[0,-Ln.z,Ln.y,0,-Rn.z,Rn.y,0,-zn.z,zn.y,Ln.z,0,-Ln.x,Rn.z,0,-Rn.x,zn.z,0,-zn.x,-Ln.y,Ln.x,0,-Rn.y,Rn.x,0,-zn.y,zn.x,0];return!Wn(t,Pn,Fn,In,Vn)||(t=[1,0,0,0,1,0,0,0,1],!Wn(t,Pn,Fn,In,Vn))?!1:(Hn.crossVectors(Ln,Rn),t=[Hn.x,Hn.y,Hn.z],Wn(t,Pn,Fn,In,Vn))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Mn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Mn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(jn)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},jn=[new K,new K,new K,new K,new K,new K,new K,new K],Mn=new K,Nn=new An,Pn=new K,Fn=new K,In=new K,Ln=new K,Rn=new K,zn=new K,Bn=new K,Vn=new K,Hn=new K,Un=new K;function Wn(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Un.fromArray(e,a);let o=i.x*Math.abs(Un.x)+i.y*Math.abs(Un.y)+i.z*Math.abs(Un.z),s=t.dot(Un),c=n.dot(Un),l=r.dot(Un);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Gn=new K,Kn=new st,qn=0,Jn=class extends Xe{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:qn++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Re,this.updateRanges=[],this.gpuType=h,this.version=0,this._normalizationScale=e===void 0?void 0:it(e)}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Kn.fromBufferAttribute(this,t),Kn.applyMatrix3(e),this.setXY(t,Kn.x,Kn.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Gn.fromBufferAttribute(this,t),Gn.applyMatrix3(e),this.setXYZ(t,Gn.x,Gn.y,Gn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Gn.fromBufferAttribute(this,t),Gn.applyMatrix4(e),this.setXYZ(t,Gn.x,Gn.y,Gn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Gn.fromBufferAttribute(this,t),Gn.applyNormalMatrix(e),this.setXYZ(t,Gn.x,Gn.y,Gn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Gn.fromBufferAttribute(this,t),Gn.transformDirection(e),this.setXYZ(t,Gn.x,Gn.y,Gn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}_denormalize(e){let t=this._normalizationScale;return t===void 0?at(e,this.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?ot(e,this.array):Math.round(e*t)}},Yn=class extends Jn{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Xn=class extends Jn{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Zn=class extends Jn{constructor(e,t,n){super(new Float32Array(e),t,n)}},Qn=new An,$n=new K,er=new K,tr=class{constructor(e=new K,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Qn.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;$n.subVectors(e,this.center);let t=$n.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector($n,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(er.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint($n.copy(e.center).add(er)),this.expandByPoint($n.copy(e.center).sub(er))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},nr=0,rr=new jt,ir=new an,ar=new K,or=new An,sr=new An,cr=new K,lr=class e extends Xe{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:nr++}),this.uuid=et(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Be(e)?Xn:Yn)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new q().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return rr.makeRotationFromQuaternion(e),this.applyMatrix4(rr),this}rotateX(e){return rr.makeRotationX(e),this.applyMatrix4(rr),this}rotateY(e){return rr.makeRotationY(e),this.applyMatrix4(rr),this}rotateZ(e){return rr.makeRotationZ(e),this.applyMatrix4(rr),this}translate(e,t,n){return rr.makeTranslation(e,t,n),this.applyMatrix4(rr),this}scale(e,t,n){return rr.makeScale(e,t,n),this.applyMatrix4(rr),this}lookAt(e){return ir.lookAt(e),ir.updateMatrix(),this.applyMatrix4(ir.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ar).negate(),this.translate(ar.x,ar.y,ar.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Zn(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&U(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new An);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)W(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new K(-1/0,-1/0,-1/0),new K(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];or.setFromBufferAttribute(n),this.morphTargetsRelative?(cr.addVectors(this.boundingBox.min,or.min),this.boundingBox.expandByPoint(cr),cr.addVectors(this.boundingBox.max,or.max),this.boundingBox.expandByPoint(cr)):(this.boundingBox.expandByPoint(or.min),this.boundingBox.expandByPoint(or.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&W(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new tr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)W(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new K,1/0);else if(e){let n=this.boundingSphere.center;if(or.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];sr.setFromBufferAttribute(n),this.morphTargetsRelative?(cr.addVectors(or.min,sr.min),or.expandByPoint(cr),cr.addVectors(or.max,sr.max),or.expandByPoint(cr)):(or.expandByPoint(sr.min),or.expandByPoint(sr.max))}or.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)cr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(cr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)cr.fromBufferAttribute(a,t),o&&(ar.fromBufferAttribute(e,t),cr.add(ar)),r=Math.max(r,n.distanceToSquared(cr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&W(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){W(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Jn(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[],c=new Uint8Array(n.count);for(let e=0;e<n.count;e++)o[e]=new K,s[e]=new K;let l=new K,u=new K,d=new K,f=new st,p=new st,m=new st,h=new K,g=new K;function _(e,t,r){c[e]=c[t]=c[r]=1,l.fromBufferAttribute(n,e),u.fromBufferAttribute(n,t),d.fromBufferAttribute(n,r),f.fromBufferAttribute(i,e),p.fromBufferAttribute(i,t),m.fromBufferAttribute(i,r),u.sub(l),d.sub(l),p.sub(f),m.sub(f);let a=1/(p.x*m.y-m.x*p.y);isFinite(a)&&(h.copy(u).multiplyScalar(m.y).addScaledVector(d,-p.y).multiplyScalar(a),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-m.x).multiplyScalar(a),o[e].add(h),o[t].add(h),o[r].add(h),s[e].add(g),s[t].add(g),s[r].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let t=0,n=v.length;t<n;++t){let n=v[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)_(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let y=new K,b=new K,x=new K,S=new K;function C(e){x.fromBufferAttribute(r,e),S.copy(x);let t=o[e];y.copy(t),y.sub(x.multiplyScalar(x.dot(t))).normalize(),b.crossVectors(S,t);let n=b.dot(s[e])<0?-1:1;a.setXYZW(e,y.x,y.y,y.z,n)}for(let e=0,t=n.count;e<t;++e)c[e]&&C(e);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Jn(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new K,i=new K,a=new K,o=new K,s=new K,c=new K,l=new K,u=new K;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)cr.fromBufferAttribute(e,t),cr.normalize(),e.setXYZ(t,cr.x,cr.y,cr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Jn(a,r,i)}if(this.index===null)return U(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},ur=new K,dr=new K,fr=new q,pr=class{constructor(e=new K(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=ur.subVectors(n,t).cross(dr.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(ur),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||fr.getNormalMatrix(e),r=this.coplanarPoint(ur).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},mr=0,hr=class extends Xe{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:mr++}),this.uuid=et(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new J(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Le,this.stencilZFail=Le,this.stencilZPass=Le,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){U(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?U(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new J().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new pr().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new st().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new st().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},gr=new K,_r=new K,vr=new K,yr=new K,br=class{constructor(e=new K,t=new K(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,gr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=gr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(gr.copy(this.origin).addScaledVector(this.direction,t),gr.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){_r.copy(e).add(t).multiplyScalar(.5),vr.copy(t).sub(e).normalize(),yr.copy(this.origin).sub(_r);let i=e.distanceTo(t)*.5,a=-this.direction.dot(vr),o=yr.dot(this.direction),s=-yr.dot(vr),c=yr.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(_r).addScaledVector(vr,d),f}intersectSphere(e,t){if(e.radius<0)return null;gr.subVectors(e.center,this.origin);let n=gr.dot(this.direction),r=gr.dot(gr)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,gr)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,ee;if(y>=b&&y>=x?(w=s,D=u,A=p,ee=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,ee=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,ee=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let N=S/w,te=C/w,P=1/w,ne=T-N*D,F=E-te*D,re=O-N*A,ie=k-te*A,ae=j-N*ee,oe=M-te*ee,se=ae*ie-oe*re,I=ne*oe-F*ae,ce=re*F-ie*ne;if(r){if(se<0||I<0||ce<0)return null}else if((se<0||I<0||ce<0)&&(se>0||I>0||ce>0))return null;let le=se+I+ce;if(le===0)return null;let ue=P*(se*D+I*A+ce*ee);return(le>0?ue<0:ue>0)?null:this.at(ue/le,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},xr=class extends hr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new J(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vt,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Sr=new jt,Cr=new br,wr=new tr,Tr=new K,Er=new K,Dr=new K,Or=new K,kr=new K,Ar=new K,jr=new K,Mr=new K,Nr=class extends an{constructor(e=new lr,t=new xr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Ar.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(kr.fromBufferAttribute(s,e),a?Ar.addScaledVector(kr,r):Ar.addScaledVector(kr.sub(t),r))}t.add(Ar)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),wr.copy(n.boundingSphere),wr.applyMatrix4(i),Cr.copy(e.ray).recast(e.near),wr.containsPoint(Cr.origin)===!1&&(Cr.intersectSphere(wr,Tr)===null||Cr.origin.distanceToSquared(Tr)>(e.far-e.near)**2)||(Sr.copy(i).invert(),Cr.copy(e.ray).applyMatrix4(Sr),(n.boundingBox===null||Cr.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Cr)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Fr(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Fr(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Fr(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Fr(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Pr(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Mr.copy(s),Mr.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Mr);return l<n.near||l>n.far?null:{distance:l,point:Mr.clone(),object:e}}function Fr(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Er),e.getVertexPosition(c,Dr),e.getVertexPosition(l,Or);let u=Pr(e,t,n,r,Er,Dr,Or,jr);if(u){let e=new K;kn.getBarycoord(jr,Er,Dr,Or,e),i&&(u.uv=kn.getInterpolatedAttribute(i,s,c,l,e,new st)),a&&(u.uv1=kn.getInterpolatedAttribute(a,s,c,l,e,new st)),o&&(u.normal=kn.getInterpolatedAttribute(o,s,c,l,e,new K),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new K,materialIndex:0};kn.getNormal(Er,Dr,Or,t.normal),u.face=t,u.barycoord=e}return u}var Ir=class extends Tt{constructor(e=null,t=1,n=1,i,a,o,s,c,l=r,u=r,d,f){super(null,o,s,c,l,u,i,a,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Lr=class extends Jn{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Rr=new jt,zr=new jt,Br=[],Vr=new An,Hr=new jt,Ur=new Nr,Wr=new tr,Gr=class extends Nr{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Lr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Hr)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new An),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Rr),Vr.copy(e.boundingBox).applyMatrix4(Rr),this.boundingBox.union(Vr)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new tr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Rr),Wr.copy(e.boundingSphere).applyMatrix4(Rr),this.boundingSphere.union(Wr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture===null?null:e.morphTexture.clone(),this.instanceColor=e.instanceColor===null?null:e.instanceColor.clone(),this.count=e.count,this.boundingBox=e.boundingBox===null?null:e.boundingBox.clone(),this.boundingSphere=e.boundingSphere===null?null:e.boundingSphere.clone(),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Ur.geometry=this.geometry,Ur.material=this.material,Ur.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Wr.copy(this.boundingSphere),Wr.applyMatrix4(n),e.ray.intersectsSphere(Wr)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Rr),zr.multiplyMatrices(n,Rr),Ur.matrixWorld=zr,Ur.raycast(e,Br);for(let e=0,n=Br.length;e<n;e++){let n=Br[e];n.instanceId=i,n.object=this,t.push(n)}Br.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Lr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ir(new Float32Array(r*this.count),r,this.count,D,h));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Kr=new tr,qr=new st(.5,.5),Jr=new K,Yr=class{constructor(e=new pr,t=new pr,n=new pr,r=new pr,i=new pr,a=new pr){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ze,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Kr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Kr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Kr)}intersectsSprite(e){return Kr.center.set(0,0,0),Kr.radius=.7071067811865476+qr.distanceTo(e.center),Kr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Kr)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Jr.x=r.normal.x>0?e.max.x:e.min.x,Jr.y=r.normal.y>0?e.max.y:e.min.y,Jr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Jr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Xr=new jt,Zr=class e{constructor(){this.coordinateSystem=ze,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let e=0;e<t.length;e++){let r=t[e];Xr.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[e]===void 0&&(n[e]=new Yr),n[e].setFromProjectionMatrix(Xr,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new Yr),t[r].copy(n[r]);return this._count=e._count,this}clone(){return new e().copy(this)}},Qr=class extends Tt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},$r=class extends Tt{constructor(e,t,n=m,i,a,o,s=r,c=r,l,u=T,d=1){if(u!==1026&&u!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},i,a,o,s,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new xt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},ei=class extends $r{constructor(e,t=m,n=301,i,a,o=r,s=r,c,l=T){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,i,a,o,s,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ti=class extends Tt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ni=class e extends lr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Zn(c,3)),this.setAttribute(`normal`,new Zn(l,3)),this.setAttribute(`uv`,new Zn(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new K;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},ri=class e extends lr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Zn(u,3)),this.setAttribute(`normal`,new Zn(d,3)),this.setAttribute(`uv`,new Zn(f,2));function _(){let a=new K,_=new K,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new st,m=new K,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ii=class e extends ri{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ai=class e extends lr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Zn(p,3)),this.setAttribute(`normal`,new Zn(m,3)),this.setAttribute(`uv`,new Zn(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},oi=class e extends lr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new K,d=new K,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Zn(p,3)),this.setAttribute(`normal`,new Zn(m,3)),this.setAttribute(`uv`,new Zn(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function si(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(li(i))i.isRenderTargetTexture?(U(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(li(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function ci(e){let t={};for(let n=0;n<e.length;n++){let r=si(e[n]);for(let e in r)t[e]=r[e]}return t}function li(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function ui(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function di(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ht.workingColorSpace}var fi={clone:si,merge:ci},pi=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,mi=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,hi=class extends hr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pi,this.fragmentShader=mi,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=si(e.uniforms),this.uniformsGroups=ui(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new J().setHex(r.value);break;case`v2`:this.uniforms[n].value=new st().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new K().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Et().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new q().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new jt().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},gi=class extends hi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},_i=class extends hr{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new J(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new J(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new st(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vt,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},vi=class extends hr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Pe,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},yi=class extends hr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function bi(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function xi(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Si=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Ci=class extends Si{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Me,endingEnd:Me}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ne:i=e,o=2*t-n;break;case B:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Ne:a=e,s=2*n-t;break;case B:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},wi=class extends Si{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Ti=class extends Si{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Ei=class extends Si{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=ki(n,t,g,y,r);i[p]=Di(x,o,_,b,m)}return i}};function Di(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Oi(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function ki(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Di(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Oi(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Ai=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=bi(t,this.TimeBufferType),this.values=bi(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:bi(e.times,Array),values:bi(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),xi(e.settings)&&(n.settings={inTangents:bi(e.settings.inTangents,Array),outTangents:bi(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ti(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new wi(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ci(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Ei(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case ke:t=this.InterpolantFactoryMethodDiscrete;break;case Ae:t=this.InterpolantFactoryMethodLinear;break;case z:t=this.InterpolantFactoryMethodSmooth;break;case je:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return U(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ke;case this.InterpolantFactoryMethodLinear:return Ae;case this.InterpolantFactoryMethodSmooth:return z;case this.InterpolantFactoryMethodBezier:return je}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e;xi(this.settings)&&(ji(this.settings.inTangents,e),ji(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;xi(this.settings)&&(Mi(this.settings.inTangents,e),Mi(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(W(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(W(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){W(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){W(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Ve(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){W(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===z,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,xi(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function ji(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]+=t}function Mi(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Ai.prototype.ValueTypeName=``,Ai.prototype.TimeBufferType=Float32Array,Ai.prototype.ValueBufferType=Float32Array,Ai.prototype.DefaultInterpolation=Ae;var Ni=class extends Ai{constructor(e,t,n){super(e,t,n)}};Ni.prototype.ValueTypeName=`bool`,Ni.prototype.ValueBufferType=Array,Ni.prototype.DefaultInterpolation=ke,Ni.prototype.InterpolantFactoryMethodLinear=void 0,Ni.prototype.InterpolantFactoryMethodSmooth=void 0;var Pi=class extends Ai{constructor(e,t,n,r){super(e,t,n,r)}};Pi.prototype.ValueTypeName=`color`;var Fi=class extends Ai{constructor(e,t,n,r){super(e,t,n,r)}};Fi.prototype.ValueTypeName=`number`;var Ii=class extends Si{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)ct.slerpFlat(i,0,a,c-o,a,c,s);return i}},Li=class extends Ai{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Ii(this.times,this.values,this.getValueSize(),e)}};Li.prototype.ValueTypeName=`quaternion`,Li.prototype.InterpolantFactoryMethodSmooth=void 0;var Ri=class extends Ai{constructor(e,t,n){super(e,t,n)}};Ri.prototype.ValueTypeName=`string`,Ri.prototype.ValueBufferType=Array,Ri.prototype.DefaultInterpolation=ke,Ri.prototype.InterpolantFactoryMethodLinear=void 0,Ri.prototype.InterpolantFactoryMethodSmooth=void 0;var zi=class extends Ai{constructor(e,t,n,r){super(e,t,n,r)}};zi.prototype.ValueTypeName=`vector`;var Bi=class extends an{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new J(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Vi=class extends Bi{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(an.DEFAULT_UP),this.updateMatrix(),this.groundColor=new J(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Hi=new jt,Ui=new K,Wi=new K,Gi=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new st(512,512),this.mapType=l,this.map=null,this.mapPass=null,this.matrix=new jt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Yr,this._frameExtents=new st(1,1),this._viewportCount=1,this._viewports=[new Et(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Ui.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ui),Wi.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Wi),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Hi.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Hi,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Hi)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ki=new K,qi=new ct,Ji=new K,Yi=class extends an{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new jt,this.projectionMatrix=new jt,this.projectionMatrixInverse=new jt,this.coordinateSystem=ze,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ki,qi,Ji),Ji.x===1&&Ji.y===1&&Ji.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ki,qi,Ji.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ki,qi,Ji),Ji.x===1&&Ji.y===1&&Ji.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ki,qi,Ji.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Xi=new K,Zi=new st,Qi=new st,$i=class extends Yi{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=$e*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Qe*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return $e*2*Math.atan(Math.tan(Qe*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Xi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Xi.x,Xi.y).multiplyScalar(-e/Xi.z),Xi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Xi.x,Xi.y).multiplyScalar(-e/Xi.z)}getViewSize(e,t){return this.getViewBounds(e,Zi,Qi),t.subVectors(Qi,Zi)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Qe*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ea=class extends Yi{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ta=class extends Gi{constructor(){super(new ea(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},na=class extends Bi{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(an.DEFAULT_UP),this.updateMatrix(),this.target=new an,this.shadow=new ta}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},ra=-90,ia=1,aa=class extends an{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new $i(ra,ia,e,t);r.layers=this.layers,this.add(r);let i=new $i(ra,ia,e,t);i.layers=this.layers,this.add(i);let a=new $i(ra,ia,e,t);a.layers=this.layers,this.add(a);let o=new $i(ra,ia,e,t);o.layers=this.layers,this.add(o);let s=new $i(ra,ia,e,t);s.layers=this.layers,this.add(s);let c=new $i(ra,ia,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},oa=class extends $i{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},sa=`\\[\\]\\.:\\/`,ca=RegExp(`[\\[\\]\\.:\\/]`,`g`),la=`[^\\[\\]\\.:\\/]`,ua=`[^`+sa.replace(`\\.`,``)+`]`,da=`((?:WC+[\\/:])*)`.replace(`WC`,la),fa=`(WCOD+)?`.replace(`WCOD`,ua),pa=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,la),ma=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,la),ha=RegExp(`^`+da+fa+pa+ma+`$`),ga=[`material`,`materials`,`bones`,`map`],_a=class{constructor(e,t,n){let r=n||va.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},va=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(ca,``)}static parseTrackName(e){let t=ha.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);ga.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){U(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){W(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){W(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){W(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){W(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){W(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){W(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){W(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;W(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){W(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){W(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};va.Composite=_a,va.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},va.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},va.prototype.GetterByBindingType=[va.prototype._getValue_direct,va.prototype._getValue_array,va.prototype._getValue_arrayElement,va.prototype._getValue_toArray],va.prototype.SetterByBindingTypeAndVersioning=[[va.prototype._setValue_direct,va.prototype._setValue_direct_setNeedsUpdate,va.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[va.prototype._setValue_array,va.prototype._setValue_array_setNeedsUpdate,va.prototype._setValue_array_setMatrixWorldNeedsUpdate],[va.prototype._setValue_arrayElement,va.prototype._setValue_arrayElement_setNeedsUpdate,va.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[va.prototype._setValue_fromArray,va.prototype._setValue_fromArray_setNeedsUpdate,va.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var ya=new jt,ba=class{constructor(e,t,n=0,r=1/0){this.ray=new br(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Ht,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):W(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return ya.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ya),this}intersectObject(e,t=!0,n=[]){return Sa(e,this,n,t),n.sort(xa),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)Sa(e[r],this,n,t);return n.sort(xa),n}};function xa(e,t){return e.distance-t.distance}function Sa(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)Sa(r[e],t,n,!0)}}(class{static{this.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});function Ca(e,t,n,r){let i=wa(r);switch(n){case S:return e*t;case D:return e*t/i.components*i.byteLength;case O:return e*t/i.components*i.byteLength;case k:return e*t*2/i.components*i.byteLength;case A:return e*t*2/i.components*i.byteLength;case C:return e*t*3/i.components*i.byteLength;case w:return e*t*4/i.components*i.byteLength;case j:return e*t*4/i.components*i.byteLength;case M:case ee:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case N:case te:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ne:case re:return Math.max(e,16)*Math.max(t,8)/4;case P:case F:return Math.max(e,8)*Math.max(t,8)/2;case ie:case ae:case se:case I:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case oe:case ce:case le:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ue:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case de:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case L:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case fe:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case pe:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case me:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case he:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case ge:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case _e:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case ve:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case R:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case ye:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case be:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case xe:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Se:case Ce:case we:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Te:case Ee:return Math.ceil(e/4)*Math.ceil(t/4)*8;case De:case Oe:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function wa(e){switch(e){case l:case u:return{byteLength:1,components:1};case f:case d:case g:return{byteLength:2,components:1};case _:case v:return{byteLength:2,components:4};case m:case p:case h:return{byteLength:4,components:1};case b:case x:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`187`}})),typeof window<`u`&&(window.__THREE__?U(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`187`);function Ta(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Ea(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Da={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Y={common:{diffuse:{value:new J(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new q},alphaMap:{value:null},alphaMapTransform:{value:new q},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new q}},envmap:{envMap:{value:null},envMapRotation:{value:new q},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new q}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new q}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new q},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new q},normalScale:{value:new st(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new q},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new q}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new q}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new q}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new J(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new J(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new q},alphaTest:{value:0},uvTransform:{value:new q}},sprite:{diffuse:{value:new J(16777215)},opacity:{value:1},center:{value:new st(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new q},alphaMap:{value:null},alphaMapTransform:{value:new q},alphaTest:{value:0}}},Oa={basic:{uniforms:ci([Y.common,Y.specularmap,Y.envmap,Y.aomap,Y.lightmap,Y.fog]),vertexShader:Da.meshbasic_vert,fragmentShader:Da.meshbasic_frag},lambert:{uniforms:ci([Y.common,Y.specularmap,Y.envmap,Y.aomap,Y.lightmap,Y.emissivemap,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.fog,Y.lights,{emissive:{value:new J(0)},envMapIntensity:{value:1}}]),vertexShader:Da.meshlambert_vert,fragmentShader:Da.meshlambert_frag},phong:{uniforms:ci([Y.common,Y.specularmap,Y.envmap,Y.aomap,Y.lightmap,Y.emissivemap,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.fog,Y.lights,{emissive:{value:new J(0)},specular:{value:new J(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Da.meshphong_vert,fragmentShader:Da.meshphong_frag},standard:{uniforms:ci([Y.common,Y.envmap,Y.aomap,Y.lightmap,Y.emissivemap,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.roughnessmap,Y.metalnessmap,Y.fog,Y.lights,{emissive:{value:new J(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Da.meshphysical_vert,fragmentShader:Da.meshphysical_frag},toon:{uniforms:ci([Y.common,Y.aomap,Y.lightmap,Y.emissivemap,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.gradientmap,Y.fog,Y.lights,{emissive:{value:new J(0)}}]),vertexShader:Da.meshtoon_vert,fragmentShader:Da.meshtoon_frag},matcap:{uniforms:ci([Y.common,Y.bumpmap,Y.normalmap,Y.displacementmap,Y.fog,{matcap:{value:null}}]),vertexShader:Da.meshmatcap_vert,fragmentShader:Da.meshmatcap_frag},points:{uniforms:ci([Y.points,Y.fog]),vertexShader:Da.points_vert,fragmentShader:Da.points_frag},dashed:{uniforms:ci([Y.common,Y.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Da.linedashed_vert,fragmentShader:Da.linedashed_frag},depth:{uniforms:ci([Y.common,Y.displacementmap]),vertexShader:Da.depth_vert,fragmentShader:Da.depth_frag},normal:{uniforms:ci([Y.common,Y.bumpmap,Y.normalmap,Y.displacementmap,{opacity:{value:1}}]),vertexShader:Da.meshnormal_vert,fragmentShader:Da.meshnormal_frag},sprite:{uniforms:ci([Y.sprite,Y.fog]),vertexShader:Da.sprite_vert,fragmentShader:Da.sprite_frag},background:{uniforms:{uvTransform:{value:new q},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Da.background_vert,fragmentShader:Da.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new q}},vertexShader:Da.backgroundCube_vert,fragmentShader:Da.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Da.cube_vert,fragmentShader:Da.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Da.equirect_vert,fragmentShader:Da.equirect_frag},distance:{uniforms:ci([Y.common,Y.displacementmap,{referencePosition:{value:new K},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Da.distance_vert,fragmentShader:Da.distance_frag},shadow:{uniforms:ci([Y.lights,Y.fog,{color:{value:new J(0)},opacity:{value:1}}]),vertexShader:Da.shadow_vert,fragmentShader:Da.shadow_frag}};Oa.physical={uniforms:ci([Oa.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new q},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new q},clearcoatNormalScale:{value:new st(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new q},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new q},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new q},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new q},sheen:{value:0},sheenColor:{value:new J(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new q},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new q},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new q},transmissionSamplerSize:{value:new st},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new q},attenuationDistance:{value:0},attenuationColor:{value:new J(0)},specularColor:{value:new J(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new q},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new q},anisotropyVector:{value:new st},anisotropyMap:{value:null},anisotropyMapTransform:{value:new q}}]),vertexShader:Da.meshphysical_vert,fragmentShader:Da.meshphysical_frag};var ka={r:0,b:0,g:0},Aa=new jt,ja=new q;ja.set(-1,0,0,0,1,0,0,0,1);function Ma(e,t,n,r,i,a){let o=new J(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&i.isCubeTexture?(l===void 0&&(l=new Nr(new ni(1,1,1),new hi({name:`BackgroundCubeMaterial`,uniforms:si(Oa.backgroundCube.uniforms),vertexShader:Oa.backgroundCube.vertexShader,fragmentShader:Oa.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Aa.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(ja),l.material.toneMapped=ht.getTransfer(i.colorSpace)!==Ie,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Nr(new ai(2,2),new hi({name:`BackgroundMaterial`,uniforms:si(Oa.background.uniforms),vertexShader:Oa.background.vertexShader,fragmentShader:Oa.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=ht.getTransfer(i.colorSpace)!==Ie,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(ka,di(e)),n.buffers.color.setClear(ka.r,ka.g,ka.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Na(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.isInterleavedBuffer===!0?t.stride:t.itemSize,p=s.offset;if(t.isInstancedInterleavedBuffer||t.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Pa(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Fa(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(U(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),f=n.logarithmicDepthBuffer===!0&&d===!1;n.reversedDepthBuffer===!0&&d===!1&&U(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`),n.logarithmicDepthBuffer===!0&&d===!0&&U(`WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Ia(e){let t=this,n=null,r=0,i=!1,a=!1,o=new pr,s=new q,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var La=class extends Ot{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Qr(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new ni(5,5,5),i=new hi({name:`CubemapFromEquirect`,uniforms:si(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Nr(r,i),s=t.minFilter;return t.minFilter===1008&&(t.minFilter=o),new aa(1,10,this).update(e,a),t.minFilter=s,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},Ra=256,za=3,Ba=20,Va=256,Ha=16,Ua=3,Wa=new K,Ga=new J,Ka=class e{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new aa(1,10,null),this._boxMesh=new Nr(new ni(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Wa}=i,s=this._renderer;this._setSize(a);let c=this._allocateTarget(),l=this._getSourceTarget(!0);t>0&&(l.texture.mipmapsAutoUpdate=!1);let u=s.autoClear,d=s.autoClearColor,f=s.autoClearDepth,p=s.autoClearStencil,m=e.background;s.autoClear=!0,s.autoClearColor=!0,s.autoClearDepth=!0,s.autoClearStencil=!0,m===null&&(e.background=s.getClearColor(Ga));let h=new aa(n,r,l);return h.position.copy(o),h.update(s,e),s.autoClear=u,s.autoClearColor=d,s.autoClearDepth=f,s.autoClearStencil=p,e.background=m,t>0&&(l.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$a(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qa(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Ra,rt(e))}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?Ra:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=qa(e,!1,!1),n=Math.log2(e)-za;for(let r=0;r<=n;r++)t.texture.mipmaps.push({width:e>>r,height:e>>r});return t.texture.name=`PMREM`,t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=qa(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let r=this._boxMesh,i=this._cubeCamera;r.material=n,i.renderTarget=e,i.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),i.update(this._renderer,r),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===301||e.mapping===302?(this._cubemapMaterial===null&&(this._cubemapMaterial=$a()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Qa()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=Ya(),this._integrationMaterial=Xa());let n=this._cubeSize,r=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let a=this._integrationMaterial.uniforms;a.envMap.value=this._sourceTarget.texture,a.sourceLod.value=Math.log2(n/Ha);for(let o=0;o<=r;o++){let s=e.lodToRoughness(o,r);if(o>r-Ua)a.roughness.value=s,this._renderCube(t,o,this._integrationMaterial);else{let e=s>0?Math.log2(n)+.5*Math.log2(6/(Va*s**4))+.5:0;i.roughness.value=s,i.lodBias.value=e,this._renderCube(t,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=Za());let n=this._blurMaterial,r=n.uniforms,i=this._sourceTarget;r.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,r.envMap.value=i.texture,this._renderCube(e,0,n),r.envMap.value=e.texture,this._renderCube(i,0,n)}};function qa(e,t,n){return new La(e,{minFilter:c,generateMipmaps:t,type:g,colorSpace:V,depthBuffer:n})}function Ja(e,t,n){return new hi({name:e,uniforms:t,vertexShader:Da.cube_vert,fragmentShader:n,side:1,blending:0,depthTest:!1,depthWrite:!1})}function Ya(){return Ja(`PMREMGGXConvolution`,{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Va}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Xa(){return Ja(`PMREMGGXIntegration`,{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Ha}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Za(){return Ja(`PMREMSphericalGaussianBlur`,{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Ba}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Qa(){return Ja(`PMREMEquirectangularToCubemap`,{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function $a(){return Ja(`PMREMCubemapToCubemap`,{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function eo(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new La(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture&&t.isPMREMTexture!==!0){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Ka(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Ka(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function to(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&qe(`WebGLRenderer: `+e+` extension not supported.`),t}}}function no(e,t,n,r){let i={},a=new WeakMap,o=new FinalizationRegistry(e=>delete i[e]);function s(e){c(e.target)}function c(e){e.index!==null&&t.remove(e.index);for(let n in e.attributes)t.remove(e.attributes[n]);e.removeEventListener(`dispose`,s),delete i[e.id],o.unregister(e);let c=a.get(e);c&&(t.remove(c),a.delete(e)),r.releaseStatesOfGeometry(e),e.isInstancedBufferGeometry===!0&&delete e._maxInstanceCount,n.memory.geometries--}function l(e,t){return i[t.id]===void 0&&(t.addEventListener(`dispose`,s),i[t.id]=new WeakRef(t),o.register(t,t.id,t),n.memory.geometries++),t}function u(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function d(e){let n=e.index,r=e.attributes.position,i=0;if(r===void 0)return;let o=n===null?r.array.length/3-1:n.array.length,s=new(r.count>=65535?Xn:Yn)(Math.ceil(o/3)*6,1),c=s.array;if(n!==null){let e=n.array;i=n.version;for(let t=0,n=0;t<o;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];c[n++]=r,c[n++]=i,c[n++]=i,c[n++]=a,c[n++]=a,c[n++]=r}}else{i=r.version;for(let e=0,t=0;e<o;e+=3){let n=e+0,r=e+1,i=e+2;c[t++]=n,c[t++]=r,c[t++]=r,c[t++]=i,c[t++]=i,c[t++]=n}}s.version=i;let l=a.get(e);l&&t.remove(l),a.set(e,s)}function f(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&d(e)}else d(e);return a.get(e)}function p(){for(let e in i){let t=i[e].deref();t!==void 0&&c(t)}}return{get:l,update:u,getWireframeAttribute:f,dispose:p}}function ro(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function io(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:W(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function ao(e,t,n){let r=new WeakMap,i=new Et;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let g=new Float32Array(p*m*4*u),_=new kt(g,p,m,u);_.type=h,_.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),g[d+s+0]=i.x,g[d+s+1]=i.y,g[d+s+2]=i.z,g[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),g[d+s+4]=i.x,g[d+s+5]=i.y,g[d+s+6]=i.z,g[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),g[d+s+8]=i.x,g[d+s+9]=i.y,g[d+s+10]=i.z,g[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:_,size:new st(p,m)},r.set(o,d);function y(){_.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function oo(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var so={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function co(e,t,n,r,i,a){let o=new Ot(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=null,u=new lr;u.setAttribute(`position`,new Zn([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute(`uv`,new Zn([0,2,0,0,2,0],2));let d=new gi({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new Nr(u,d),p=new ea(-1,1,1,-1,0,1),m=null,h=null,_=!1,v,b=null,x=[],S=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<x.length;n++){let r=x[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){x=e,S=x.length>0&&x[0].isRenderPass===!0;let t=o.width,n=o.height;x.length>0&&s===null&&(s=new Ot(t,n,{type:g,depthBuffer:!1,stencilBuffer:!1}),c=new Ot(t,n,{type:g,depthBuffer:!1,stencilBuffer:!1}));let r=i===!0&&x.some(e=>e.needsDepthTexture===!0);r!==(o.depthTexture!==null)&&(r===!0&&l===null&&(l=new $r(t,n),a===!0&&(l.format=E,l.type=y)),o.dispose(),o.depthTexture=r?l:null,o.resolveDepthBuffer=r,o.storeMultisampledDepthBuffer=r);for(let e=0;e<x.length;e++){let i=x[e];i.setSize&&i.setSize(t,n),r&&i.needsDepthTexture===!0&&i.setDepthTexture&&i.setDepthTexture(l)}},this.begin=function(e,t){if(_||e.toneMapping===0&&x.length===0)return!1;if(b=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return S===!1&&e.setRenderTarget(o),v=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return S},this.end=function(e,t){e.toneMapping=v,_=!0;let n=o,r=s;for(let i=0;i<x.length;i++){let a=x[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(m!==e.outputColorSpace||h!==e.toneMapping){m=e.outputColorSpace,h=e.toneMapping,d.defines={},ht.getTransfer(m)===`srgb`&&(d.defines.SRGB_TRANSFER=``);let t=so[h];t&&(d.defines[t]=``),d.needsUpdate=!0}d.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(b),e.render(f,p),b=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),u.dispose(),d.dispose()}}var lo=new Tt,uo=new $r(1,1),fo=new ei(1),po=new kt,mo=new At,ho=new Qr,go=[],_o=[],vo=new Float32Array(16),yo=new Float32Array(9),bo=new Float32Array(4);function xo(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=go[i];if(a===void 0&&(a=new Float32Array(i),go[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function So(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Co(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function wo(e,t){let n=_o[t];n===void 0&&(n=new Int32Array(t),_o[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function To(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Eo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(So(n,t))return;e.uniform2fv(this.addr,t),Co(n,t)}}function Do(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(So(n,t))return;e.uniform3fv(this.addr,t),Co(n,t)}}function Oo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(So(n,t))return;e.uniform4fv(this.addr,t),Co(n,t)}}function ko(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(So(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Co(n,t)}else{if(So(n,r))return;bo.set(r),e.uniformMatrix2fv(this.addr,!1,bo),Co(n,r)}}function Ao(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(So(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Co(n,t)}else{if(So(n,r))return;yo.set(r),e.uniformMatrix3fv(this.addr,!1,yo),Co(n,r)}}function jo(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(So(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Co(n,t)}else{if(So(n,r))return;vo.set(r),e.uniformMatrix4fv(this.addr,!1,vo),Co(n,r)}}function Mo(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function No(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(So(n,t))return;e.uniform2iv(this.addr,t),Co(n,t)}}function Po(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(So(n,t))return;e.uniform3iv(this.addr,t),Co(n,t)}}function Fo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(So(n,t))return;e.uniform4iv(this.addr,t),Co(n,t)}}function Io(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Lo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(So(n,t))return;e.uniform2uiv(this.addr,t),Co(n,t)}}function Ro(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(So(n,t))return;e.uniform3uiv(this.addr,t),Co(n,t)}}function zo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(So(n,t))return;e.uniform4uiv(this.addr,t),Co(n,t)}}function Bo(e){return e.version===0&&(e.compareFunction=519,e.needsUpdate=!0),e}function Vo(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_2D_SHADOW?Bo(uo):lo,n.setTexture2D(t||a,i)}function Ho(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||mo,i)}function Uo(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_CUBE_SHADOW?Bo(fo):ho,n.setTextureCube(t||a,i)}function Wo(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||po,i)}function Go(e){switch(e){case 5126:return To;case 35664:return Eo;case 35665:return Do;case 35666:return Oo;case 35674:return ko;case 35675:return Ao;case 35676:return jo;case 5124:case 35670:return Mo;case 35667:case 35671:return No;case 35668:case 35672:return Po;case 35669:case 35673:return Fo;case 5125:return Io;case 36294:return Lo;case 36295:return Ro;case 36296:return zo;case 35678:case 36198:case 36298:case 36306:case 35682:return Vo;case 35679:case 36299:case 36307:return Ho;case 35680:case 36300:case 36308:case 36293:return Uo;case 36289:case 36303:case 36311:case 36292:return Wo}}function Ko(e,t){e.uniform1fv(this.addr,t)}function qo(e,t){let n=xo(t,this.size,2);e.uniform2fv(this.addr,n)}function Jo(e,t){let n=xo(t,this.size,3);e.uniform3fv(this.addr,n)}function Yo(e,t){let n=xo(t,this.size,4);e.uniform4fv(this.addr,n)}function Xo(e,t){let n=xo(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Zo(e,t){let n=xo(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Qo(e,t){let n=xo(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function $o(e,t){e.uniform1iv(this.addr,t)}function es(e,t){e.uniform2iv(this.addr,t)}function ts(e,t){e.uniform3iv(this.addr,t)}function ns(e,t){e.uniform4iv(this.addr,t)}function rs(e,t){e.uniform1uiv(this.addr,t)}function is(e,t){e.uniform2uiv(this.addr,t)}function as(e,t){e.uniform3uiv(this.addr,t)}function os(e,t){e.uniform4uiv(this.addr,t)}function ss(e,t,n){let r=this.cache,i=t.length,a=wo(n,i);So(r,a)||(e.uniform1iv(this.addr,a),Co(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Bo(uo):lo;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function cs(e,t,n){let r=this.cache,i=t.length,a=wo(n,i);So(r,a)||(e.uniform1iv(this.addr,a),Co(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||mo,a[e])}function ls(e,t,n){let r=this.cache,i=t.length,a=wo(n,i);So(r,a)||(e.uniform1iv(this.addr,a),Co(r,a));let o;o=this.type===e.SAMPLER_CUBE_SHADOW?Bo(fo):ho;for(let e=0;e!==i;++e)n.setTextureCube(t[e]||o,a[e])}function us(e,t,n){let r=this.cache,i=t.length,a=wo(n,i);So(r,a)||(e.uniform1iv(this.addr,a),Co(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||po,a[e])}function ds(e){switch(e){case 5126:return Ko;case 35664:return qo;case 35665:return Jo;case 35666:return Yo;case 35674:return Xo;case 35675:return Zo;case 35676:return Qo;case 5124:case 35670:return $o;case 35667:case 35671:return es;case 35668:case 35672:return ts;case 35669:case 35673:return ns;case 5125:return rs;case 36294:return is;case 36295:return as;case 36296:return os;case 35678:case 36198:case 36298:case 36306:case 35682:return ss;case 35679:case 36299:case 36307:return cs;case 35680:case 36300:case 36308:case 36293:return ls;case 36289:case 36303:case 36311:case 36292:return us}}var fs=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Go(t.type)}},ps=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ds(t.type)}},ms=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},hs=/(\w+)(\])?(\[|\.)?/g;function gs(e,t){e.seq.push(t),e.map[t.id]=t}function _s(e,t,n){let r=e.name,i=r.length;for(hs.lastIndex=0;;){let a=hs.exec(r),o=hs.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){gs(n,l===void 0?new fs(s,e,t):new ps(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new ms(s),gs(n,e)),n=e}}}var vs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);_s(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function ys(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var bs=37297,xs=0;function Ss(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Cs=new q;function ws(e){ht._getMatrix(Cs,ht.workingColorSpace,e);let t=`mat3( ${Cs.elements.map(e=>e.toFixed(4))} )`;switch(ht.getTransfer(e)){case H:return[t,`LinearTransferOETF`];case Ie:return[t,`sRGBTransferOETF`];default:return U(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Ts(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Ss(e.getShaderSource(t),r)}return i}function Es(e,t){let n=ws(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,`}`].join(`
`)}var Ds={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Os(e,t){let n=Ds[t];return n===void 0?(U(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var ks=new K;function As(){return ht.getLuminanceCoefficients(ks),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${ks.x.toFixed(4)}, ${ks.y.toFixed(4)}, ${ks.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function js(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Ps).join(`
`)}function Ms(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Ns(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Ps(e){return e!==``}function Fs(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function Is(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Ls=/^[ \t]*#include +<([\w\d./]+)>/gm;function Rs(e){return e.replace(Ls,zs)}function zs(e,t){let n=Da[t];if(n===void 0)throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`);return Rs(n)}var Bs=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vs(e){return e.replace(Bs,Hs)}function Hs(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Us(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Ws={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Gs(e){return Ws[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Ks={302:`ENVMAP_MODE_REFRACTION`};function qs(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Ks[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Js={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Ys(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Js[e.combine]||`ENVMAP_BLENDING_NONE`}function Xs(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Gs(n),l=n.envMapPMREM===!0?`ENVMAP_TYPE_PMREM`:`ENVMAP_TYPE_CUBE`,u=qs(n),d=Ys(n),f=js(n),p=Ms(a),m=i.createProgram(),h,g,_=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(h=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(Ps).join(`
`),h.length>0&&(h+=`
`),g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(Ps).join(`
`),g.length>0&&(g+=`
`)):(h=[Us(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.diffuseRoughnessMapUv?`#define DIFFUSE_ROUGHNESSMAP_UV `+n.diffuseRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Ps).join(`
`),g=[Us(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,n.envMapPMREM?`#define ENVMAP_MAX_LOD `+n.envMapMaxLod+`.0`:``,n.envMapPMREM?`#define ENVMAP_SIZE `+n.envMapSize+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughness?`#define USE_DIFFUSE_ROUGHNESS`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Da.tonemapping_pars_fragment,n.toneMapping===0?``:Os(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Da.colorspace_pars_fragment,Es(`linearToOutputTexel`,n.outputColorSpace),As(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Ps).join(`
`)),o=Rs(o),o=Fs(o,n),o=Is(o,n),s=Rs(s),s=Fs(s,n),s=Is(s,n),o=Vs(o),s=Vs(s),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,h=[f,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+h,g=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+g);let v=_+h+o,y=_+g+s,b=ys(i,i.VERTEX_SHADER,v),x=ys(i,i.FRAGMENT_SHADER,y);i.attachShader(m,b),i.attachShader(m,x),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(m,0,`position`):i.bindAttribLocation(m,0,n.index0AttributeName),i.linkProgram(m);function S(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(m)||``,r=i.getShaderInfoLog(b)||``,a=i.getShaderInfoLog(x)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,m,b,x);else{let e=Ts(i,b,`vertex`),n=Ts(i,x,`fragment`);W(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):U(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:h},fragmentShader:{log:c,prefix:g}})}i.deleteShader(b),i.deleteShader(x),C=new vs(i,m),w=Ns(i,m)}let C;this.getUniforms=function(){return C===void 0&&S(this),C};let w;this.getAttributes=function(){return w===void 0&&S(this),w};let T=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=i.getProgramParameter(m,bs)),T},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=xs++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=x,this}var Zs=0,Qs=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new $s(e),t.set(e,n)),n}},$s=class{constructor(e){this.id=Zs++,this.code=e,this.usedTimes=0}};function ec(e){return e===1030||e===37490||e===36285}function tc(e,t,n,r,i,a){let o=new Ht,s=new Qs,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function p(e){return c.add(e),e===0?`uv`:`uv${e}`}function m(i,o,l,u,m,h){let g=u.fog,_=m.geometry,v=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,b=t.get(i.envMap||v,y),x=f[i.type],S=r.precision;i.precision!==null&&(S=r.getMaxPrecision(i.precision),S!==i.precision&&U(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,S,`instead.`));let C=_.morphAttributes.position||_.morphAttributes.normal||_.morphAttributes.color,w=C===void 0?0:C.length,T=0;_.morphAttributes.position!==void 0&&(T=1),_.morphAttributes.normal!==void 0&&(T=2),_.morphAttributes.color!==void 0&&(T=3);let E,D,O,k;if(x){let e=Oa[x];E=e.vertexShader,D=e.fragmentShader}else{E=i.vertexShader,D=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let A=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),M=m.isInstancedMesh===!0,ee=m.isBatchedMesh===!0,N=!!i.map,te=!!i.matcap,P=!!b,ne=P&&b.isPMREMTexture===!0,F=!!i.aoMap,re=!!i.lightMap,ie=!!i.bumpMap&&i.wireframe===!1,ae=!!i.normalMap,oe=!!i.displacementMap,se=!!i.emissiveMap,I=!!i.metalnessMap,ce=!!i.roughnessMap,le=i.anisotropy>0,ue=i.clearcoat>0,de=i.diffuseRoughness>0,L=i.dispersion>0,fe=i.retroreflectivity>0,pe=i.iridescence>0,me=i.sheen>0,he=i.transmission>0,ge=le&&!!i.anisotropyMap,_e=ue&&!!i.clearcoatMap,ve=ue&&!!i.clearcoatNormalMap,R=ue&&!!i.clearcoatRoughnessMap,ye=de&&!!i.diffuseRoughnessMap,be=pe&&!!i.iridescenceMap,xe=pe&&!!i.iridescenceThicknessMap,Se=me&&!!i.sheenColorMap,Ce=me&&!!i.sheenRoughnessMap,we=!!i.specularMap,Te=!!i.specularColorMap,Ee=!!i.specularIntensityMap,De=he&&!!i.transmissionMap,Oe=he&&!!i.thicknessMap,ke=!!i.gradientMap,Ae=!!i.alphaMap,z=i.alphaTest>0,je=!!i.alphaHash,Me=!!i.extensions,Ne=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Ne=e.toneMapping);let B=ne?b.isCompressedCubeTexture?b.image[0].mipmaps:b.mipmaps:null,Pe={shaderID:x,shaderType:i.type,shaderName:i.name,vertexShader:E,fragmentShader:D,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:S,batching:ee,batchingColor:ee&&m._colorsTexture!==null,instancing:M,instancingColor:M&&m.instanceColor!==null,instancingMorph:M&&m.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:ht.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:N,matcap:te,envMap:P,envMapMode:P&&b.mapping,envMapPMREM:ne,envMapMaxLod:ne?B.length-1:null,envMapSize:ne?B[0].width:null,aoMap:F,lightMap:re,bumpMap:ie,normalMap:ae,displacementMap:oe,emissiveMap:se,normalMapObjectSpace:ae&&i.normalMapType===1,normalMapTangentSpace:ae&&i.normalMapType===0,packedNormalMap:ae&&i.normalMapType===0&&ec(i.normalMap.format),metalnessMap:I,roughnessMap:ce,anisotropy:le,anisotropyMap:ge,clearcoat:ue,clearcoatMap:_e,clearcoatNormalMap:ve,clearcoatRoughnessMap:R,diffuseRoughness:de,diffuseRoughnessMap:ye,dispersion:L,retroreflection:fe,iridescence:pe,iridescenceMap:be,iridescenceThicknessMap:xe,sheen:me,sheenColorMap:Se,sheenRoughnessMap:Ce,specularMap:we,specularColorMap:Te,specularIntensityMap:Ee,transmission:he,transmissionMap:De,thicknessMap:Oe,gradientMap:ke,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ae,alphaTest:z,alphaHash:je,combine:i.combine,mapUv:N&&p(i.map.channel),aoMapUv:F&&p(i.aoMap.channel),lightMapUv:re&&p(i.lightMap.channel),bumpMapUv:ie&&p(i.bumpMap.channel),normalMapUv:ae&&p(i.normalMap.channel),displacementMapUv:oe&&p(i.displacementMap.channel),emissiveMapUv:se&&p(i.emissiveMap.channel),metalnessMapUv:I&&p(i.metalnessMap.channel),roughnessMapUv:ce&&p(i.roughnessMap.channel),anisotropyMapUv:ge&&p(i.anisotropyMap.channel),clearcoatMapUv:_e&&p(i.clearcoatMap.channel),clearcoatNormalMapUv:ve&&p(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:R&&p(i.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ye&&p(i.diffuseRoughnessMap.channel),iridescenceMapUv:be&&p(i.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&p(i.iridescenceThicknessMap.channel),sheenColorMapUv:Se&&p(i.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&p(i.sheenRoughnessMap.channel),specularMapUv:we&&p(i.specularMap.channel),specularColorMapUv:Te&&p(i.specularColorMap.channel),specularIntensityMapUv:Ee&&p(i.specularIntensityMap.channel),transmissionMapUv:De&&p(i.transmissionMap.channel),thicknessMapUv:Oe&&p(i.thicknessMap.channel),alphaMapUv:Ae&&p(i.alphaMap.channel),vertexTangents:!!_.attributes.tangent&&(ae||le),vertexNormals:!!_.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!_.attributes.color&&_.attributes.color.itemSize===4,pointsUvs:m.isPoints===!0&&!!_.attributes.uv&&(N||Ae),fog:!!g,useFog:i.fog===!0,fogExp2:!!g&&g.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||_.attributes.normal===void 0&&ae===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:m.isSkinnedMesh===!0,hasPositionAttribute:_.attributes.position!==void 0,morphTargets:_.morphAttributes.position!==void 0,morphNormals:_.morphAttributes.normal!==void 0,morphColors:_.morphAttributes.color!==void 0,morphTargetsCount:w,morphTextureStride:T,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:h.filter(e=>e.texture!==null).length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ne,decodeVideoTexture:N&&i.map.isVideoTexture===!0&&ht.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:se&&i.emissiveMap.isVideoTexture===!0&&ht.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Me&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Me&&i.extensions.multiDraw===!0||ee)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Pe.vertexUv1s=c.has(1),Pe.vertexUv2s=c.has(2),Pe.vertexUv3s=c.has(3),c.clear(),Pe}function h(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(g(n,t),_(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function g(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapPMREM),e.push(t.envMapMaxLod),e.push(t.envMapSize),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.diffuseRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.numLightProbeGrids),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function _(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.diffuseRoughness&&o.enable(25),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function v(e){let t=f[e.type],n;if(t){let e=Oa[t];n=fi.clone(e.uniforms)}else n=e.uniforms;return n}function y(t,n){let r=u.get(n);return r===void 0?(r=new Xs(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function b(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function x(e){s.remove(e)}function S(){s.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:v,acquireProgram:y,releaseProgram:b,releaseShaderCache:x,programs:l,dispose:S}}function nc(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function rc(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function ic(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function ac(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||rc),r.length>1&&r.sort(t||ic),i.length>1&&i.sort(t||ic)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function oc(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new ac,e.set(t,[i])):n>=r.length?(i=new ac,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function sc(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new K,color:new J};break;case`SpotLight`:n={position:new K,direction:new K,color:new J,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new K,color:new J,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new K,skyColor:new J,groundColor:new J};break;case`RectAreaLight`:n={color:new J,position:new K,halfWidth:new K,halfHeight:new K}}return e[t.id]=n,n}}}function cc(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var lc=0;function uc(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function dc(e){let t=new sc,n=cc(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new K);let i=new K,a=new jt,o=new jt;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(uc);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Y.LTC_FLOAT_1,r.rectAreaLTC2=Y.LTC_FLOAT_2):(r.rectAreaLTC1=Y.LTC_HALF_1,r.rectAreaLTC2=Y.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=lc++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function fc(e){let t=new dc(e),n=[],r=[],i=[];function a(e){u.camera=e,n.length=0,r.length=0,i.length=0}function o(e){e.isLightProbeGrid?i.push(e):n.push(e)}function s(e){r.push(e)}function c(){t.setup(n),i.sort((e,t)=>e.priority-t.priority||e.id-t.id)}function l(e){t.setupView(n,e)}let u={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function pc(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new fc(e),t.set(n,[a])):r>=i.length?(a=new fc(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var mc=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,hc=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,gc=[new K(1,0,0),new K(-1,0,0),new K(0,1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1)],_c=[new K(0,-1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1),new K(0,-1,0),new K(0,-1,0)],vc=new jt,yc=new K,bc=new K;function xc(e,t,n){let i=new Yr,a=new st,s=new st,c=new Et,l=new vi,u=new yi,d={},f=n.maxTextureSize,p={0:1,1:0,2:2},_=new hi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new st},radius:{value:4}},vertexShader:mc,fragmentShader:hc}),v=_.clone();v.defines.HORIZONTAL_PASS=1;let y=new lr;y.setAttribute(`position`,new Jn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new Nr(y,_),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,l){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(U(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.state;_.setBlending(0),_.buffers.depth.getReversed()===!0?_.buffers.color.setClear(0,0,0,0):_.buffers.color.setClear(1,1,1,1),_.buffers.depth.setTest(!0),_.setScissorTest(!1);let v=S!==this.type;v&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let u=0,d=t.length;u<d;u++){let d=t[u],p=d.shadow;if(p===void 0){U(`WebGLShadowMap:`,d,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;a.copy(p.mapSize);let y=p.getFrameExtents();a.multiply(y),s.copy(p.mapSize),(a.x>f||a.y>f)&&(a.x>f&&(s.x=Math.floor(f/y.x),a.x=s.x*y.x,p.mapSize.x=s.x),a.y>f&&(s.y=Math.floor(f/y.y),a.y=s.y*y.y,p.mapSize.y=s.y));let b=e.state.buffers.depth.getReversed();if(p.camera._reversedDepth=b,p.map===null||v===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(d.isPointLight){U(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new Ot(a.x,a.y,{format:k,type:g,minFilter:o,magFilter:o,generateMipmaps:!1}),p.map.texture.name=d.name+`.shadowMap`,p.map.depthTexture=new $r(a.x,a.y,h),p.map.depthTexture.name=d.name+`.shadowMapDepth`,p.map.depthTexture.format=T,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r}else d.isPointLight?(p.map=new La(a.x),p.map.depthTexture=new ei(a.x,m)):(p.map=new Ot(a.x,a.y),p.map.depthTexture=new $r(a.x,a.y,m)),p.map.depthTexture.name=d.name+`.shadowMap`,p.map.depthTexture.format=T,this.type===1?(p.map.depthTexture.compareFunction=b?518:515,p.map.depthTexture.minFilter=o,p.map.depthTexture.magFilter=o):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r);p.camera.updateProjectionMatrix()}p.map.isWebGLCubeRenderTarget!==!0&&(p.map.width!==a.x||p.map.height!==a.y)&&p.map.setSize(a.x,a.y);let x=p.map.isWebGLCubeRenderTarget?6:p.getViewportCount();d.isPointLight!==!0&&p.updateMatrices(d,l);let S=p.camera.layers.mask&4294967294?p.camera.layers:l.layers;for(let t=0;t<x;t++){let r=p.getCamera(t);if(d.isPointLight){let e=p.camera,n=p.matrix,r=d.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),yc.setFromMatrixPosition(d.matrixWorld),e.position.copy(yc),bc.copy(e.position),bc.add(gc[t]),e.up.copy(_c[t]),e.lookAt(bc),e.updateMatrixWorld(),n.makeTranslation(-yc.x,-yc.y,-yc.z),vc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),p._frustum.setFromProjectionMatrix(vc,e.coordinateSystem,e.reversedDepth)}if(p.map.isWebGLCubeRenderTarget)e.setRenderTarget(p.map,t),e.clear();else{t===0&&(e.setRenderTarget(p.map),e.clear());let n=p.getViewport(t);c.set(s.x*n.x,s.y*n.y,s.x*n.z,s.y*n.w),_.viewport(c)}i=p.getFrustum(t),E(n,l,r,d,S,this.type)}p.isPointLightShadow!==!0&&this.type===3&&C(p,l),p.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(u,d,p)};function C(n,r){let i=t.update(b);_.defines.VSM_SAMPLES!==n.blurSamples&&(_.defines.VSM_SAMPLES=n.blurSamples,v.defines.VSM_SAMPLES=n.blurSamples,_.needsUpdate=!0,v.needsUpdate=!0),n.mapPass===null?n.mapPass=new Ot(a.x,a.y,{format:k,type:g}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),_.uniforms.shadow_pass.value=n.map.depthTexture,_.uniforms.resolution.value.set(n.map.width,n.map.height),_.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,_,b,null),v.uniforms.shadow_pass.value=n.mapPass.texture,v.uniforms.resolution.value.set(n.map.width,n.map.height),v.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,v,b,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?u:l,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=d[e];r===void 0&&(r={},d[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,D)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?p[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function E(n,r,a,o,s,c){if(n.visible===!1)return;if(n.layers.test(s)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&c===3)&&(!n.frustumCulled||n.intersectsFrustum(i))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let i=t.update(n),s=n.material;if(Array.isArray(s)){let t=i.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=s[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,c);n.onBeforeShadow(e,n,r,a,i,t,u),e.renderBufferDirect(a,null,i,t,n,u),n.onAfterShadow(e,n,r,a,i,t,u)}}}else if(s.visible){let t=w(n,s,o,c);n.onBeforeShadow(e,n,r,a,i,t,null),e.renderBufferDirect(a,null,i,t,n,null),n.onAfterShadow(e,n,r,a,i,t,null)}}let l=n.children;for(let e=0,t=l.length;e<t;e++)E(l[e],r,a,o,s,c)}function D(e){e.target.removeEventListener(`dispose`,D);for(let t in d){let n=d[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Sc(e,t){function n(){let t=!1,n=new Et,r=null,i=new Et(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?I(e.DEPTH_TEST):ce(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Ye[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?I(e.STENCIL_TEST):ce(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c={},l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new J(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),ee=!1,N=0,te=e.getParameter(e.VERSION);te.indexOf(`WebGL`)===-1?te.indexOf(`OpenGL ES`)!==-1&&(N=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),ee=N>=2):(N=parseFloat(/^WebGL (\d)/.exec(te)[1]),ee=N>=1);let P=null,ne={},F=e.getParameter(e.SCISSOR_BOX),re=e.getParameter(e.VIEWPORT),ie=new Et().fromArray(F),ae=new Et().fromArray(re);function oe(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let se={};se[e.TEXTURE_2D]=oe(e.TEXTURE_2D,e.TEXTURE_2D,1),se[e.TEXTURE_CUBE_MAP]=oe(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[e.TEXTURE_2D_ARRAY]=oe(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),se[e.TEXTURE_3D]=oe(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),I(e.DEPTH_TEST),o.setFunc(3),he(!1),ge(1),I(e.CULL_FACE),pe(0);function I(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ce(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function le(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ue(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function de(t){return h!==t&&(e.useProgram(t),h=t,!0)}let L={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};L[103]=e.MIN,L[104]=e.MAX;let fe={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function pe(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(ce(e.BLEND),g=!1);else if(g===!1&&(I(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:W(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:W(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:W(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:W(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(L[n],L[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(fe[r],fe[i],fe[o],fe[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function me(t,n){t.side===2?ce(e.CULL_FACE):I(e.CULL_FACE);let r=t.side===1;n&&(r=!r),he(r),t.blending===1&&t.transparent===!1?pe(0):pe(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ve(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?I(e.SAMPLE_ALPHA_TO_COVERAGE):ce(e.SAMPLE_ALPHA_TO_COVERAGE)}function he(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ge(t){t===0?ce(e.CULL_FACE):(I(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function _e(t){t!==k&&(ee&&e.lineWidth(t),k=t)}function ve(t,n,r){t?(I(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n,r=-r),e.polygonOffset(n,r))):ce(e.POLYGON_OFFSET_FILL)}function R(t){t?I(e.SCISSOR_TEST):ce(e.SCISSOR_TEST)}function ye(t){t===void 0&&(t=e.TEXTURE0+M-1),P!==t&&(e.activeTexture(t),P=t)}function be(t,n,r){r===void 0&&(r=P===null?e.TEXTURE0+M-1:P);let i=ne[r];i===void 0&&(i={type:void 0,texture:void 0},ne[r]=i),(i.type!==t||i.texture!==n)&&(P!==r&&(e.activeTexture(r),P=r),e.bindTexture(t,n||se[t]),i.type=t,i.texture=n)}function xe(){let t=ne[P];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Se(){try{e.compressedTexImage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Ce(){try{e.compressedTexImage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function we(){try{e.texSubImage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Te(){try{e.texSubImage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Ee(){try{e.compressedTexSubImage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function De(){try{e.compressedTexSubImage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Oe(){try{e.texStorage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function ke(){try{e.texStorage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function Ae(){try{e.texImage2D(...arguments)}catch(e){W(`WebGLState:`,e)}}function z(){try{e.texImage3D(...arguments)}catch(e){W(`WebGLState:`,e)}}function je(t){return d[t]===void 0?e.getParameter(t):d[t]}function Me(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Ne(t){ie.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ie.copy(t))}function B(t){ae.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ae.copy(t))}function Pe(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),e.uniformBlockBinding(n,i,i),r.set(t,i))}function Fe(t,n,r){let i=l.get(n).get(t);c[i]!==r&&(e.bindBufferBase(e.UNIFORM_BUFFER,i,r),c[i]=r)}function V(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},P=null,ne={},f={},c={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new J(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ie.set(0,0,e.canvas.width,e.canvas.height),ae.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:I,disable:ce,bindFramebuffer:le,drawBuffers:ue,useProgram:de,setBlending:pe,setMaterial:me,setFlipSided:he,setCullFace:ge,setLineWidth:_e,setPolygonOffset:ve,setScissorTest:R,activeTexture:ye,bindTexture:be,unbindTexture:xe,compressedTexImage2D:Se,compressedTexImage3D:Ce,texImage2D:Ae,texImage3D:z,pixelStorei:Me,getParameter:je,updateUBOMapping:Pe,uniformBlockBinding:Fe,texStorage2D:Oe,texStorage3D:ke,texSubImage2D:we,texSubImage3D:Te,compressedTexSubImage2D:Ee,compressedTexSubImage3D:De,scissor:Ne,viewport:B,reset:V}}function Cc(l,u,d,f,p,m,h){let g=u.has(`WEBGL_multisampled_render_to_texture`)?u.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new st,y=new WeakMap,b=new Set,x,S=new WeakMap,C=new Set,w=new FinalizationRegistry(e=>C.delete(e)),T=!1;try{T=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function D(e,t){return T?new OffscreenCanvas(e,t):He(`canvas`)}function O(e,t,n){let r=1,i=V(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=D(n,a));let o=t?D(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),U(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&U(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function k(e){return e.generateMipmaps}function A(e){l.generateMipmap(e)}function j(e){return e.isWebGLCubeRenderTarget?l.TEXTURE_CUBE_MAP:e.isWebGL3DRenderTarget?l.TEXTURE_3D:e.isWebGLArrayRenderTarget||e.isCompressedArrayTexture?l.TEXTURE_2D_ARRAY:l.TEXTURE_2D}function M(e,t,n,r,i,a=!1){if(e!==null){if(l[e]!==void 0)return l[e];U(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+e+`'`)}let o;r&&(o=u.get(`EXT_texture_norm16`),o||U(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let s=t;if(t===l.RED&&(n===l.FLOAT&&(s=l.R32F),n===l.HALF_FLOAT&&(s=l.R16F),n===l.UNSIGNED_BYTE&&(s=l.R8),n===l.UNSIGNED_SHORT&&o&&(s=o.R16_EXT),n===l.SHORT&&o&&(s=o.R16_SNORM_EXT)),t===l.RED_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.R8UI),n===l.UNSIGNED_SHORT&&(s=l.R16UI),n===l.UNSIGNED_INT&&(s=l.R32UI),n===l.BYTE&&(s=l.R8I),n===l.SHORT&&(s=l.R16I),n===l.INT&&(s=l.R32I)),t===l.RG&&(n===l.FLOAT&&(s=l.RG32F),n===l.HALF_FLOAT&&(s=l.RG16F),n===l.UNSIGNED_BYTE&&(s=l.RG8),n===l.UNSIGNED_SHORT&&o&&(s=o.RG16_EXT),n===l.SHORT&&o&&(s=o.RG16_SNORM_EXT)),t===l.RG_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RG8UI),n===l.UNSIGNED_SHORT&&(s=l.RG16UI),n===l.UNSIGNED_INT&&(s=l.RG32UI),n===l.BYTE&&(s=l.RG8I),n===l.SHORT&&(s=l.RG16I),n===l.INT&&(s=l.RG32I)),t===l.RGB_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGB8UI),n===l.UNSIGNED_SHORT&&(s=l.RGB16UI),n===l.UNSIGNED_INT&&(s=l.RGB32UI),n===l.BYTE&&(s=l.RGB8I),n===l.SHORT&&(s=l.RGB16I),n===l.INT&&(s=l.RGB32I)),t===l.RGBA_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGBA8UI),n===l.UNSIGNED_SHORT&&(s=l.RGBA16UI),n===l.UNSIGNED_INT&&(s=l.RGBA32UI),n===l.BYTE&&(s=l.RGBA8I),n===l.SHORT&&(s=l.RGBA16I),n===l.INT&&(s=l.RGBA32I)),t===l.RGB&&(n===l.UNSIGNED_SHORT&&o&&(s=o.RGB16_EXT),n===l.SHORT&&o&&(s=o.RGB16_SNORM_EXT),n===l.UNSIGNED_INT_5_9_9_9_REV&&(s=l.RGB9_E5),n===l.UNSIGNED_INT_10F_11F_11F_REV&&(s=l.R11F_G11F_B10F)),t===l.RGBA){let e=a?H:ht.getTransfer(i);n===l.FLOAT&&(s=l.RGBA32F),n===l.HALF_FLOAT&&(s=l.RGBA16F),n===l.UNSIGNED_BYTE&&(s=e===`srgb`?l.SRGB8_ALPHA8:l.RGBA8),n===l.UNSIGNED_SHORT&&o&&(s=o.RGBA16_EXT),n===l.SHORT&&o&&(s=o.RGBA16_SNORM_EXT),n===l.UNSIGNED_SHORT_4_4_4_4&&(s=l.RGBA4),n===l.UNSIGNED_SHORT_5_5_5_1&&(s=l.RGB5_A1)}return(s===l.R16F||s===l.R32F||s===l.RG16F||s===l.RG32F||s===l.RGBA16F||s===l.RGBA32F)&&u.get(`EXT_color_buffer_float`),s}function ee(e,t){let n;return e?t===null||t===1014||t===1020?n=l.DEPTH24_STENCIL8:t===1015?n=l.DEPTH32F_STENCIL8:t===1012&&(n=l.DEPTH24_STENCIL8,U(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):t===null||t===1014||t===1020?n=l.DEPTH_COMPONENT24:t===1015?n=l.DEPTH_COMPONENT32F:t===1012&&(n=l.DEPTH_COMPONENT16),n}function N(e,t){return k(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function te(e){let t=new WeakRef(e);f.get(e).__ref=t,C.add(t),w.register(e,t,t)}function P(e){let t=f.get(e).__ref;t!==void 0&&(C.delete(t),w.unregister(t))}function ne(e){re(e.target)}function F(e){ie(e.target)}function re(e){e.removeEventListener(`dispose`,ne),P(e),oe(e),e.isVideoTexture&&y.delete(e),e.isHTMLTexture&&b.delete(e)}function ie(e){e.removeEventListener(`dispose`,F),P(e),I(e)}function ae(){for(let e of C){let t=e.deref();t!==void 0&&(t.isRenderTarget===!0?ie(t):re(t))}C.clear(),b.clear()}function oe(e){let t=f.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=S.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&se(e),Object.keys(r).length===0&&S.delete(n)}f.remove(e)}function se(e){let t=f.get(e);l.deleteTexture(t.__webglTexture);let n=e.source,r=S.get(n);delete r[t.__cacheKey],h.memory.textures--}function I(e){let t=f.get(e);t.__depthDisposeCallback&&t.__depthDisposeCallback();let n=e.depthTexture;if(n&&n.renderTarget===e&&re(n),e.isWebGLCubeRenderTarget)for(let e=0;e<6;e++){if(Array.isArray(t.__webglFramebuffer[e]))for(let n=0;n<t.__webglFramebuffer[e].length;n++)l.deleteFramebuffer(t.__webglFramebuffer[e][n]);else l.deleteFramebuffer(t.__webglFramebuffer[e]);t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer[e])}else{if(Array.isArray(t.__webglFramebuffer))for(let e=0;e<t.__webglFramebuffer.length;e++)l.deleteFramebuffer(t.__webglFramebuffer[e]);else l.deleteFramebuffer(t.__webglFramebuffer);if(t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer),t.__webglMultisampledFramebuffer&&l.deleteFramebuffer(t.__webglMultisampledFramebuffer),t.__webglColorRenderbuffer)for(let e=0;e<t.__webglColorRenderbuffer.length;e++)t.__webglColorRenderbuffer[e]&&l.deleteRenderbuffer(t.__webglColorRenderbuffer[e]);t.__webglDepthRenderbuffer&&l.deleteRenderbuffer(t.__webglDepthRenderbuffer)}let r=e.textures;for(let e=0,t=r.length;e<t;e++){let t=f.get(r[e]);t.__webglTexture&&(l.deleteTexture(t.__webglTexture),h.memory.textures--),f.remove(r[e])}f.remove(e)}let ce=0;function le(){ce=0}function ue(){return ce}function de(e){ce=e}function L(){let e=ce;return e>=p.maxTextures&&U(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+p.maxTextures),ce+=1,e}function fe(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.mipmapsAutoUpdate),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function pe(e,t){let n=f.get(e);if(e.isVideoTexture&&Pe(e),e.isRenderTargetTexture===!1&&e.isExternalTexture!==!0&&e.version>0&&n.__version!==e.version){let r=e.image;if(r===null)U(`WebGLRenderer: Texture marked for update but no image data found.`);else if(r.complete===!1)U(`WebGLRenderer: Texture marked for update but image is incomplete`);else{Ce(n,e,t);return}}else e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null);d.bindTexture(l.TEXTURE_2D,n.__webglTexture,l.TEXTURE0+t)}function me(e,t){let n=f.get(e);e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version?Ce(n,e,t):(e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null),d.bindTexture(l.TEXTURE_2D_ARRAY,n.__webglTexture,l.TEXTURE0+t))}function he(e,t){let n=f.get(e);e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version?Ce(n,e,t):d.bindTexture(l.TEXTURE_3D,n.__webglTexture,l.TEXTURE0+t)}function ge(e,t){let n=f.get(e);e.version>0&&n.__version!==e.version?we(n,e,t):d.bindTexture(l.TEXTURE_CUBE_MAP,n.__webglTexture,l.TEXTURE0+t)}let _e={[e]:l.REPEAT,[t]:l.CLAMP_TO_EDGE,[n]:l.MIRRORED_REPEAT},ve={[r]:l.NEAREST,[i]:l.NEAREST_MIPMAP_NEAREST,[a]:l.NEAREST_MIPMAP_LINEAR,[o]:l.LINEAR,[s]:l.LINEAR_MIPMAP_NEAREST,[c]:l.LINEAR_MIPMAP_LINEAR},R={512:l.NEVER,519:l.ALWAYS,513:l.LESS,515:l.LEQUAL,514:l.EQUAL,518:l.GEQUAL,516:l.GREATER,517:l.NOTEQUAL};function ye(e,t){if(t.type===1015&&u.has(`OES_texture_float_linear`)===!1&&(t.magFilter===1006||t.magFilter===1007||t.magFilter===1005||t.magFilter===1008||t.minFilter===1006||t.minFilter===1007||t.minFilter===1005||t.minFilter===1008)&&U(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),l.texParameteri(e,l.TEXTURE_WRAP_S,_e[t.wrapS]),l.texParameteri(e,l.TEXTURE_WRAP_T,_e[t.wrapT]),(e===l.TEXTURE_3D||e===l.TEXTURE_2D_ARRAY)&&l.texParameteri(e,l.TEXTURE_WRAP_R,_e[t.wrapR]),l.texParameteri(e,l.TEXTURE_MAG_FILTER,ve[t.magFilter]),l.texParameteri(e,l.TEXTURE_MIN_FILTER,ve[t.minFilter]),t.compareFunction&&(l.texParameteri(e,l.TEXTURE_COMPARE_MODE,l.COMPARE_REF_TO_TEXTURE),l.texParameteri(e,l.TEXTURE_COMPARE_FUNC,R[t.compareFunction])),u.has(`EXT_texture_filter_anisotropic`)===!0){if(t.magFilter===1003||t.minFilter!==1005&&t.minFilter!==1008||t.type===1015&&u.has(`OES_texture_float_linear`)===!1)return;if(t.anisotropy>1||f.get(t).__currentAnisotropy){let n=u.get(`EXT_texture_filter_anisotropic`);l.texParameterf(e,n.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(t.anisotropy,p.getMaxAnisotropy())),f.get(t).__currentAnisotropy=t.anisotropy}}}function be(e,t){let n=!1;e.__webglInit===void 0&&(e.__webglInit=!0,t.addEventListener(`dispose`,ne),te(t));let r=t.source,i=S.get(r);i===void 0&&(i={},S.set(r,i));let a=fe(t);if(a!==e.__cacheKey){i[a]===void 0&&(i[a]={texture:l.createTexture(),usedTimes:0},h.memory.textures++,n=!0),i[a].usedTimes++;let r=i[e.__cacheKey];r!==void 0&&(i[e.__cacheKey].usedTimes--,r.usedTimes===0&&se(t)),e.__cacheKey=a,e.__webglTexture=i[a].texture}return n}function xe(e,t,n){return Math.floor(Math.floor(e/n)/t)}function Se(e,t,n,r){let i=e.updateRanges;if(i.length===0)d.texSubImage2D(l.TEXTURE_2D,0,0,0,t.width,t.height,n,r,t.data);else{i.sort((e,t)=>e.start-t.start);let a=0;for(let e=1;e<i.length;e++){let n=i[a],r=i[e],o=n.start+n.count,s=xe(r.start,t.width,4),c=xe(n.start,t.width,4);r.start<=o+1&&s===c&&xe(r.start+r.count-1,t.width,4)===s?n.count=Math.max(n.count,r.start+r.count-n.start):(++a,i[a]=r)}i.length=a+1;let o=d.getParameter(l.UNPACK_ROW_LENGTH),s=d.getParameter(l.UNPACK_SKIP_PIXELS),c=d.getParameter(l.UNPACK_SKIP_ROWS);d.pixelStorei(l.UNPACK_ROW_LENGTH,t.width);for(let e=0,a=i.length;e<a;e++){let a=i[e],o=Math.floor(a.start/4),s=Math.ceil(a.count/4),c=o%t.width,u=Math.floor(o/t.width),f=s;d.pixelStorei(l.UNPACK_SKIP_PIXELS,c),d.pixelStorei(l.UNPACK_SKIP_ROWS,u),d.texSubImage2D(l.TEXTURE_2D,0,c,u,f,1,n,r,t.data)}e.clearUpdateRanges(),d.pixelStorei(l.UNPACK_ROW_LENGTH,o),d.pixelStorei(l.UNPACK_SKIP_PIXELS,s),d.pixelStorei(l.UNPACK_SKIP_ROWS,c)}}function Ce(e,t,n){let r=l.TEXTURE_2D;(t.isDataArrayTexture||t.isCompressedArrayTexture)&&(r=l.TEXTURE_2D_ARRAY),t.isData3DTexture&&(r=l.TEXTURE_3D);let i=be(e,t),a=t.source;d.bindTexture(r,e.__webglTexture,l.TEXTURE0+n);let o=f.get(a);if(a.version!==o.__version||i===!0){if(d.activeTexture(l.TEXTURE0+n),!(typeof ImageBitmap<`u`&&t.image instanceof ImageBitmap)){let e=ht.getPrimaries(ht.workingColorSpace),n=t.colorSpace===``?null:ht.getPrimaries(t.colorSpace),r=t.colorSpace===``||e===n?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,r)}d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment);let e=O(t.image,!1,p.maxTextureSize);e=Fe(t,e);let s=m.convert(t.format,t.colorSpace),c=m.convert(t.type),u=M(t.internalFormat,s,c,t.normalized,t.colorSpace,t.isVideoTexture);ye(r,t);let f,h=t.mipmaps,g=t.isVideoTexture!==!0,_=o.__version===void 0||i===!0,v=a.dataReady,y=N(t,e);if(t.isDepthTexture)u=ee(t.format===E,t.type),_&&(g?d.texStorage2D(l.TEXTURE_2D,1,u,e.width,e.height):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,null));else if(t.isDataTexture){if(h.length>0){g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data);t.generateMipmaps=!1}else g?(_&&d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height),v&&Se(t,e,s,c)):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,e.data)}else if(t.isCompressedTexture){if(t.isCompressedArrayTexture){g&&_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,h[0].width,h[0].height,e.depth);for(let n=0,r=h.length;n<r;n++)if(f=h[n],t.format!==1023){if(s!==null){if(g){if(v){if(t.layerUpdates.size>0){let e=Ca(f.width,f.height,t.format,t.type);for(let r of t.layerUpdates){let t=f.data.subarray(r*e/f.data.BYTES_PER_ELEMENT,(r+1)*e/f.data.BYTES_PER_ELEMENT);d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,r,f.width,f.height,1,s,t)}}else d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,f.data)}}else d.compressedTexImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,f.data,0,0)}else U(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&d.texSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,c,f.data):d.texImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,s,c,f.data);t.layerUpdates.size>0&&t.clearLayerUpdates()}else{g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,n=h.length;e<n;e++)f=h[e],t.format===1023?g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data):s===null?U(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&d.compressedTexSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,f.data):d.compressedTexImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,f.data)}}else if(t.isDataArrayTexture){if(g){if(_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,e.width,e.height,e.depth),v){if(t.layerUpdates.size>0){let n=Ca(e.width,e.height,t.format,t.type);for(let r of t.layerUpdates){let t=e.data.subarray(r*n/e.data.BYTES_PER_ELEMENT,(r+1)*n/e.data.BYTES_PER_ELEMENT);d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,r,e.width,e.height,1,s,c,t)}t.clearLayerUpdates()}else d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)}}else d.texImage3D(l.TEXTURE_2D_ARRAY,0,u,e.width,e.height,e.depth,0,s,c,e.data)}else if(t.isData3DTexture)g?(_&&d.texStorage3D(l.TEXTURE_3D,y,u,e.width,e.height,e.depth),v&&d.texSubImage3D(l.TEXTURE_3D,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)):d.texImage3D(l.TEXTURE_3D,0,u,e.width,e.height,e.depth,0,s,c,e.data);else if(t.isFramebufferTexture){if(_){if(g)d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height);else{let t=e.width,n=e.height;for(let e=0;e<y;e++)d.texImage2D(l.TEXTURE_2D,e,u,t,n,0,s,c,null),t>>=1,n>>=1}}}else if(t.isHTMLTexture){if(`texElementImage2D`in l){let n=l.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),e.parentNode!==n){n.appendChild(e),b.add(t),n.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(l.texElementImage2D.length===3)l.texElementImage2D(l.TEXTURE_2D,l.RGBA8,e);else{let t=l.RGBA,n=l.RGBA,r=l.UNSIGNED_BYTE;l.texElementImage2D(l.TEXTURE_2D,0,t,n,r,e)}l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.LINEAR),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let e=V(h[0]);d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height)}for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,s,c,f):d.texImage2D(l.TEXTURE_2D,e,u,s,c,f);t.generateMipmaps=!1}else if(g){if(_){let t=V(e);d.texStorage2D(l.TEXTURE_2D,y,u,t.width,t.height)}v&&d.texSubImage2D(l.TEXTURE_2D,0,0,0,s,c,e)}else d.texImage2D(l.TEXTURE_2D,0,u,s,c,e);k(t)&&t.mipmapsAutoUpdate===!0&&A(r),o.__version=a.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function we(e,t,n){if(t.image.length!==6)return;let r=be(e,t),i=t.source;d.bindTexture(l.TEXTURE_CUBE_MAP,e.__webglTexture,l.TEXTURE0+n);let a=f.get(i);if(i.version!==a.__version||r===!0){d.activeTexture(l.TEXTURE0+n);let e=ht.getPrimaries(ht.workingColorSpace),o=t.colorSpace===``?null:ht.getPrimaries(t.colorSpace),s=t.colorSpace===``||e===o?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,s);let c=t.isCompressedTexture||t.image[0].isCompressedTexture,u=t.image[0]&&t.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!c&&!u?f[e]=O(t.image[e],!0,p.maxCubemapSize):f[e]=u?t.image[e].image:t.image[e],f[e]=Fe(t,f[e]);let h=f[0],g=m.convert(t.format,t.colorSpace),_=m.convert(t.type),v=M(t.internalFormat,g,_,t.normalized,t.colorSpace),y=t.isVideoTexture!==!0,b=a.__version===void 0||r===!0,x=i.dataReady,S=N(t,h);ye(l.TEXTURE_CUBE_MAP,t);let C;if(t.isDepthTexture){if(v=ee(t.format===E,t.type),b){if(y)d.texStorage2D(l.TEXTURE_CUBE_MAP,1,v,h.width,h.height);else for(let e=0;e<6;e++)d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,h.width,h.height,0,g,_,null)}}else if(c){y&&b&&d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let e=0;e<6;e++){C=f[e].mipmaps;for(let n=0;n<C.length;n++){let r=C[n];t.format===1023?y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,_,r.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,g,_,r.data):g===null?U(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&d.compressedTexSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,r.data):d.compressedTexImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,r.data)}}}else{if(C=t.mipmaps,y&&b){C.length>0&&S++;let e=V(f[0]);d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,e.width,e.height)}for(let e=0;e<6;e++)if(u){y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,f[e].width,f[e].height,g,_,f[e].data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,f[e].width,f[e].height,0,g,_,f[e].data);for(let t=0;t<C.length;t++){let n=C[t].image[e].image;y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,n.width,n.height,g,_,n.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,n.width,n.height,0,g,_,n.data)}}else{y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,g,_,f[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,g,_,f[e]);for(let t=0;t<C.length;t++){let n=C[t];y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,g,_,n.image[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,g,_,n.image[e])}}}k(t)&&t.mipmapsAutoUpdate===!0&&A(l.TEXTURE_CUBE_MAP),a.__version=i.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function Te(e,t,n,r,i,a){let o=m.convert(n.format,n.colorSpace),s=m.convert(n.type),c=M(n.internalFormat,o,s,n.normalized,n.colorSpace),u=f.get(t),p=f.get(n);if(p.__renderTarget=t,!u.__hasExternalTextures){let e=Math.max(1,t.width>>a),n=Math.max(1,t.height>>a);i===l.TEXTURE_3D||i===l.TEXTURE_2D_ARRAY?d.texImage3D(i,a,c,e,n,t.depth,0,o,s,null):d.texImage2D(i,a,c,e,n,0,o,s,null)}d.bindFramebuffer(l.FRAMEBUFFER,e),B(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,r,i,p.__webglTexture,0,Ne(t)):(i===l.TEXTURE_2D||i>=l.TEXTURE_CUBE_MAP_POSITIVE_X&&i<=l.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&l.framebufferTexture2D(l.FRAMEBUFFER,r,i,p.__webglTexture,a),d.bindFramebuffer(l.FRAMEBUFFER,null)}function Ee(e,t,n){if(l.bindRenderbuffer(l.RENDERBUFFER,e),t.depthBuffer){let r=t.depthTexture,i=r&&r.isDepthTexture?r.type:null,a=ee(t.stencilBuffer,i),o=t.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;B(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,Ne(t),a,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,Ne(t),a,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,a,t.width,t.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,o,l.RENDERBUFFER,e)}else{let e=t.textures;for(let r=0;r<e.length;r++){let i=e[r],a=m.convert(i.format,i.colorSpace),o=m.convert(i.type),s=M(i.internalFormat,a,o,i.normalized,i.colorSpace);B(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,Ne(t),s,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,Ne(t),s,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,s,t.width,t.height)}}l.bindRenderbuffer(l.RENDERBUFFER,null)}function De(e,t,n){let r=t.isWebGLCubeRenderTarget===!0;if(d.bindFramebuffer(l.FRAMEBUFFER,e),!(t.depthTexture&&t.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let i=f.get(t.depthTexture);i.__renderTarget=t;let a=r?t.depthTexture.image[0]:t.depthTexture.image;i.__webglTexture&&a.width===t.width&&a.height===t.height||(a.width=t.width,a.height=t.height,t.depthTexture.needsUpdate=!0),r?ge(t.depthTexture,0):pe(t.depthTexture,0);let o=i.__webglTexture,s=Ne(t),c=r?l.TEXTURE_CUBE_MAP_POSITIVE_X+n:l.TEXTURE_2D,u=t.depthTexture.format===1027?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;if(t.depthTexture.format===1026)B(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,u,c,o,0,s):l.framebufferTexture2D(l.FRAMEBUFFER,u,c,o,0);else if(t.depthTexture.format===1027)B(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,u,c,o,0,s):l.framebufferTexture2D(l.FRAMEBUFFER,u,c,o,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Oe(e){let t=f.get(e),n=e.isWebGLCubeRenderTarget===!0;if(t.__boundDepthTexture!==e.depthTexture){let n=e.depthTexture;if(t.__depthDisposeCallback&&t.__depthDisposeCallback(),n){let e=()=>{delete t.__boundDepthTexture,delete t.__depthDisposeCallback,n.removeEventListener(`dispose`,e)};n.addEventListener(`dispose`,e),t.__depthDisposeCallback=e}t.__boundDepthTexture=n}if(e.depthTexture&&!t.__autoAllocateDepthBuffer){if(n)for(let n=0;n<6;n++)De(t.__webglFramebuffer[n],e,n);else e.texture.mipmaps.length>0?De(t.__webglFramebuffer[0],e,0):De(t.__webglFramebuffer,e,0)}else if(n){t.__webglDepthbuffer=[];for(let n=0;n<6;n++)if(d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[n]),t.__webglDepthbuffer[n]===void 0)t.__webglDepthbuffer[n]=l.createRenderbuffer(),Ee(t.__webglDepthbuffer[n],e,!1);else{let r=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,i=t.__webglDepthbuffer[n];l.bindRenderbuffer(l.RENDERBUFFER,i),l.framebufferRenderbuffer(l.FRAMEBUFFER,r,l.RENDERBUFFER,i)}}else if(e.texture.mipmaps.length>0?d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[0]):d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer),t.__webglDepthbuffer===void 0)t.__webglDepthbuffer=l.createRenderbuffer(),Ee(t.__webglDepthbuffer,e,!1);else{let n=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,r=t.__webglDepthbuffer;l.bindRenderbuffer(l.RENDERBUFFER,r),l.framebufferRenderbuffer(l.FRAMEBUFFER,n,l.RENDERBUFFER,r)}d.bindFramebuffer(l.FRAMEBUFFER,null)}function ke(e,t,n){let r=f.get(e);t!==void 0&&Te(r.__webglFramebuffer,e,e.texture,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,0),n!==void 0&&Oe(e)}function Ae(e){let t=e.texture,n=f.get(e),r=f.get(t);e.addEventListener(`dispose`,F),te(e);let i=e.textures,a=e.isWebGLCubeRenderTarget===!0,o=i.length>1;if(o||(r.__webglTexture===void 0&&(r.__webglTexture=l.createTexture()),r.__version=t.version,h.memory.textures++),a){n.__webglFramebuffer=[];for(let e=0;e<6;e++)if(t.mipmaps.length>0){n.__webglFramebuffer[e]=[];for(let r=0;r<t.mipmaps.length;r++)n.__webglFramebuffer[e][r]=l.createFramebuffer()}else n.__webglFramebuffer[e]=l.createFramebuffer()}else{if(t.mipmaps.length>0){n.__webglFramebuffer=[];for(let e=0;e<t.mipmaps.length;e++)n.__webglFramebuffer[e]=l.createFramebuffer()}else n.__webglFramebuffer=l.createFramebuffer();if(o)for(let e=0,t=i.length;e<t;e++){let t=f.get(i[e]);t.__webglTexture===void 0&&(t.__webglTexture=l.createTexture(),h.memory.textures++)}if(e.samples>0&&B(e)===!1){n.__webglMultisampledFramebuffer=l.createFramebuffer(),n.__webglColorRenderbuffer=[],d.bindFramebuffer(l.FRAMEBUFFER,n.__webglMultisampledFramebuffer);for(let t=0;t<i.length;t++){let r=i[t];n.__webglColorRenderbuffer[t]=l.createRenderbuffer(),l.bindRenderbuffer(l.RENDERBUFFER,n.__webglColorRenderbuffer[t]);let a=m.convert(r.format,r.colorSpace),o=m.convert(r.type),s=M(r.internalFormat,a,o,r.normalized,r.colorSpace,e.isXRRenderTarget===!0),c=Ne(e);l.renderbufferStorageMultisample(l.RENDERBUFFER,c,s,e.width,e.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+t,l.RENDERBUFFER,n.__webglColorRenderbuffer[t])}l.bindRenderbuffer(l.RENDERBUFFER,null),e.depthBuffer&&(n.__webglDepthRenderbuffer=l.createRenderbuffer(),Ee(n.__webglDepthRenderbuffer,e,!0)),d.bindFramebuffer(l.FRAMEBUFFER,null)}}if(a){d.bindTexture(l.TEXTURE_CUBE_MAP,r.__webglTexture),ye(l.TEXTURE_CUBE_MAP,t);for(let r=0;r<6;r++)if(t.mipmaps.length>0)for(let i=0;i<t.mipmaps.length;i++)Te(n.__webglFramebuffer[r][i],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,i);else Te(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,0);k(t)?A(l.TEXTURE_CUBE_MAP):t.mipmaps.length>0&&l.texParameteri(l.TEXTURE_CUBE_MAP,l.TEXTURE_MAX_LEVEL,t.mipmaps.length-1),d.unbindTexture()}else if(o){for(let t=0,r=i.length;t<r;t++){let r=i[t],a=f.get(r),o=l.TEXTURE_2D;(e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(o=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(o,a.__webglTexture),ye(o,r),Te(n.__webglFramebuffer,e,r,l.COLOR_ATTACHMENT0+t,o,0),k(r)&&A(o)}d.unbindTexture()}else{let i=l.TEXTURE_2D;if((e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(i=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(i,r.__webglTexture),ye(i,t),t.mipmaps.length>0)for(let r=0;r<t.mipmaps.length;r++)Te(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,i,r);else Te(n.__webglFramebuffer,e,t,l.COLOR_ATTACHMENT0,i,0);k(t)?A(i):t.mipmaps.length>0&&l.texParameteri(i,l.TEXTURE_MAX_LEVEL,t.mipmaps.length-1),d.unbindTexture()}e.depthBuffer&&Oe(e)}function z(e){let t=e.textures;for(let n=0,r=t.length;n<r;n++){let r=t[n];if(k(r)&&r.mipmapsAutoUpdate===!0){let t=j(e),n=f.get(r).__webglTexture;d.bindTexture(t,n),A(t),d.unbindTexture()}}}let je=[];function Me(e){if(e.samples>0){if(B(e)===!1){let t=e.textures,n=e.width,r=e.height,i=l.COLOR_BUFFER_BIT,a=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,o=f.get(e),s=t.length>1;if(s)for(let e=0;e<t.length;e++)d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,null),d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,null,0);d.bindFramebuffer(l.READ_FRAMEBUFFER,o.__webglMultisampledFramebuffer),e.texture.mipmaps.length>0?d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer[0]):d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer);for(let c=0;c<t.length;c++){if(e.resolveDepthBuffer&&(e.depthBuffer&&(i|=l.DEPTH_BUFFER_BIT),e.stencilBuffer&&e.resolveStencilBuffer&&(i|=l.STENCIL_BUFFER_BIT)),s){l.framebufferRenderbuffer(l.READ_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.RENDERBUFFER,o.__webglColorRenderbuffer[c]);let e=f.get(t[c]).__webglTexture;l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,e,0)}l.blitFramebuffer(0,0,n,r,0,0,n,r,i,l.NEAREST),_===!0&&(je.length=0,je.push(l.COLOR_ATTACHMENT0+c),e.depthBuffer&&e.storeMultisampledDepthBuffer===!1&&je.push(a),l.invalidateFramebuffer(l.READ_FRAMEBUFFER,je))}if(d.bindFramebuffer(l.READ_FRAMEBUFFER,null),d.bindFramebuffer(l.DRAW_FRAMEBUFFER,null),s)for(let e=0;e<t.length;e++){d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,o.__webglColorRenderbuffer[e]);let n=f.get(t[e]).__webglTexture;d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,n,0)}d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglMultisampledFramebuffer)}else if(e.depthBuffer&&e.storeMultisampledDepthBuffer===!1&&_){let t=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER,[t])}}}function Ne(e){return Math.min(p.maxSamples,e.samples)}function B(e){let t=f.get(e);return e.samples>0&&u.has(`WEBGL_multisampled_render_to_texture`)===!0&&t.__useRenderToTexture!==!1}function Pe(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Fe(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(ht.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&U(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):W(`WebGLTextures: Unsupported texture color space:`,n)),t}function V(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=L,this.resetTextureUnits=le,this.getTextureUnits=ue,this.setTextureUnits=de,this.setTexture2D=pe,this.setTexture2DArray=me,this.setTexture3D=he,this.setTextureCube=ge,this.rebindTextures=ke,this.setupRenderTarget=Ae,this.updateRenderTargetMipmap=z,this.updateMultisampleRenderTarget=Me,this.setupDepthRenderbuffer=Oe,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=B,this.dispose=ae}function wc(e,t){function n(n,r=``){let i,a=ht.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Tc=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ec=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Dc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ti(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new hi({vertexShader:Tc,fragmentShader:Ec,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Nr(new ai(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Oc=class extends Xe{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,u=null,d=null,f=null,p=null,h=null,g=typeof XRWebGLBinding<`u`,_=new Dc,v={},b=t.getContextAttributes(),x=null,S=null,C=[],D=[],O=new st,k=null,A=null,j=new $i;j.viewport=new Et;let M=new $i;M.viewport=new Et;let ee=[j,M],N=new oa,te=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new cn,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new cn,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new cn,C[e]=t),t.getHandSpace()};function ne(e){let t=D.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function F(){r.removeEventListener(`select`,ne),r.removeEventListener(`selectstart`,ne),r.removeEventListener(`selectend`,ne),r.removeEventListener(`squeeze`,ne),r.removeEventListener(`squeezestart`,ne),r.removeEventListener(`squeezeend`,ne),r.removeEventListener(`end`,F),r.removeEventListener(`inputsourceschange`,re);for(let e=0;e<C.length;e++){let t=D[e];t!==null&&(D[e]=null,C[e].disconnect(t))}te=null,P=null,_.reset();for(let e in v)delete v[e];if(e.setRenderTarget(x),p=null,f=null,d=null,r=null,S=null,I.stop(),n.isPresenting=!1,e.setPixelRatio(k),e.setSize(O.width,O.height,!1),A!==null){let e=A.camera;e.fov=A.fov,e.zoom=A.zoom,e.updateProjectionMatrix(),A=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&U(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&U(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return f===null?p:f},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return h},this.getSession=function(){return r},this.setSession=async function(u){if(r=u,r!==null){if(x=e.getRenderTarget(),r.addEventListener(`select`,ne),r.addEventListener(`selectstart`,ne),r.addEventListener(`selectend`,ne),r.addEventListener(`squeeze`,ne),r.addEventListener(`squeezestart`,ne),r.addEventListener(`squeezeend`,ne),r.addEventListener(`end`,F),r.addEventListener(`inputsourceschange`,re),b.xrCompatible!==!0&&await t.makeXRCompatible(),k=e.getPixelRatio(),e.getSize(O),g&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;b.depth&&(o=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=b.stencil?E:T,a=b.stencil?y:m);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};d=this.getBinding(),f=d.createProjectionLayer(s),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new Ot(f.textureWidth,f.textureHeight,{format:w,type:l,depthTexture:new $r(f.textureWidth,f.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let n={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new Ot(p.framebufferWidth,p.framebufferHeight,{format:w,type:l,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),I.setContext(r),I.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function re(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=D.indexOf(n);r>=0&&(D[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=D.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=D.length){D.push(n),r=e;break}else if(D[e]===null){D[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}function ie(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;_.texture!==null&&(_.depthNear>0&&(t=_.depthNear),_.depthFar>0&&(n=_.depthFar)),N.near=M.near=j.near=t,N.far=M.far=j.far=n,(te!==N.near||P!==N.far)&&(r.updateRenderState({depthNear:N.near,depthFar:N.far}),te=N.near,P=N.far),N.layers.mask=e.layers.mask|6,j.layers.mask=N.layers.mask&-5,M.layers.mask=N.layers.mask&-3;let i=e.parent,a=N.cameras;ie(N,i);for(let e=0;e<a.length;e++)ie(a[e],i);N.projectionMatrix.copy(j.projectionMatrix),N.projectionMatrixInverse.copy(j.projectionMatrixInverse),A===null&&e.isPerspectiveCamera&&(A={camera:e,fov:e.fov,zoom:e.zoom}),ae(e,N,i)};function ae(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=$e*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(f!==null||p!==null)return s},this.setFoveation=function(e){s=e,f!==null&&(f.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(N)},this.getCameraTexture=function(e){return v[e]};let oe=null;function se(t,i){if(u=i.getViewerPose(c||a),h=i,u!==null){let t=u.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let i=!1;t.length!==N.cameras.length&&(N.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=d.getViewSubImage(f,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(S,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(S))}let o=ee[n];o===void 0&&(o=new $i,o.layers.enable(n),o.viewport=new Et,ee[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(N.matrix.copy(o.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),i===!0&&N.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&g){d=n.getBinding();let e=d.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&_.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&g){e.state.unbindTexture(),d=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new ti,v[n]=e);let t=d.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=D[e],n=C[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}oe&&oe(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),h=null}let I=new Ta;I.setAnimationLoop(se),this.setAnimationLoop=function(e){oe=e},this.dispose=function(){}}},kc=new jt,Ac=new q;Ac.set(-1,0,0,0,1,0,0,0,1);function jc(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,di(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(kc.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Ac),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.diffuseRoughness>0&&(e.diffuseRoughness.value=t.diffuseRoughness,t.diffuseRoughnessMap&&(e.diffuseRoughnessMap.value=t.diffuseRoughnessMap,n(t.diffuseRoughnessMap,e.diffuseRoughnessMapTransform))),t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessMinimum,e.iridescenceThicknessMaximum.value=t.iridescenceThicknessMaximum,t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Mc(e,t,n,r){let i={},a={};function o(e,t){let n=t.program;r.uniformBlockBinding(e,n,i[e.id])}function s(e,n){let o=i[e.id];o===void 0&&(m(e),o=c(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let u=t.render.frame;a[e.id]!==u&&(l(e),a[e.id]=u)}function c(t){let n=e.createBuffer(),r=t.__size,i=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,n),e.bufferData(e.UNIFORM_BUFFER,r,i),e.bindBuffer(e.UNIFORM_BUFFER,null),n}function l(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)u(t[n],e,n,a);else u(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function u(t,n,r,i){if(f(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=h(i,!0);d(i,t.__data,e),e+=a.storage/Float32Array.BYTES_PER_ELEMENT}}else d(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function d(e,t,n){typeof e==`number`||typeof e==`boolean`?t[n]=e:e.isMatrix3?(t[n]=e.elements[0],t[n+1]=e.elements[1],t[n+2]=e.elements[2],t[n+3]=0,t[n+4]=e.elements[3],t[n+5]=e.elements[4],t[n+6]=e.elements[5],t[n+7]=0,t[n+8]=e.elements[6],t[n+9]=e.elements[7],t[n+10]=e.elements[8],t[n+11]=0):ArrayBuffer.isView(e)?t.set(e.subarray(0,t.length-n),n):e.toArray(t,n)}function f(e,t,n,r){let i=e.value,a=t+`_`+n;if(Array.isArray(i)){r[a]===void 0&&(r[a]=[]);let e=r[a],t=!1;for(let n=0;n<i.length;n++)p(i[n],e,n)===!0&&(t=!0);return t}return p(i,r,a)}function p(e,t,n){if(t[n]===void 0)return t[n]=typeof e==`number`||typeof e==`boolean`?e:ArrayBuffer.isView(e)?e.slice():e.clone(),!0;{let r=t[n];if(typeof e==`number`||typeof e==`boolean`){if(r!==e)return t[n]=e,!0}else if(ArrayBuffer.isView(e))return!0;else if(r.equals(e)===!1)return r.copy(e),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let i=0,a=r.length;i<a;i++){let a=r[i],o=Array.isArray(a.value)?a.value:[a.value],s=Array.isArray(t[e])||Array.isArray(a.value),c=n;for(let e=0,t=o.length;e<t;e++){let t=o[e],r=h(t,s),i=n%16,a=i%r.boundary,l=i+a;n+=a,l!==0&&16-l<r.storage&&(n+=16-l),e===0&&(c=n),n+=r.storage}a.__data=new(a.type===`int`?Int32Array:a.type===`uint`?Uint32Array:Float32Array)((n-c)/Float32Array.BYTES_PER_ELEMENT),a.__offset=c}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e,t){let n={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(n.boundary=4,n.storage=4):e.isVector2?(n.boundary=8,n.storage=8):e.isVector3||e.isColor?(n.boundary=16,n.storage=12):e.isVector4?(n.boundary=16,n.storage=16):e.isMatrix3?(n.boundary=16,n.storage=48):e.isMatrix4?(n.boundary=16,n.storage=64):e.isTexture?U(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(n.boundary=16,n.storage=e.byteLength):U(`WebGLRenderer: Unsupported uniform value type.`,e),t===!0&&(n.boundary=16,n.storage=Math.ceil(n.storage/16)*16),n}function g(t){let n=t.target;n.removeEventListener(`dispose`,g),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);i={},a={}}return{bind:o,update:s,dispose:_}}var Nc=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Pc=null;function Fc(){return Pc===null&&(Pc=new Ir(Nc,16,16,k,g),Pc.name=`DFG_LUT`,Pc.minFilter=o,Pc.magFilter=o,Pc.wrapS=t,Pc.wrapT=t,Pc.generateMipmaps=!1,Pc.needsUpdate=!0),Pc}var Ic=class{constructor(e={}){let{canvas:t=Ue(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:u=!1,powerPreference:d=`default`,failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:b=l}=e;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);x=n.getContextAttributes().alpha}else x=a;let S=b,C=new Set([j,A,O]),w=new Set([l,m,f,y,_,v]),T=new Uint32Array(4),E=new Int32Array(4),D={textures:[],min:[],max:[],resolution:[]},k=null,M=null,ee=[],N=[],te=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,ne=!1,F=null,re=null,ie=null,ae=null;this._outputColorSpace=Fe;let oe=0,se=0,I=null,ce=-1,le=null,ue=new Et,de=new Et,L=null,fe=new J(0),pe=0,me=t.width,he=t.height,ge=1,_e=null,ve=null,R=new Et(0,0,me,he),ye=new Et(0,0,me,he),be=!1,xe=new Yr,Se=new Zr,Ce=!1,we=!1,Te=new jt,Ee=new K,De=new Et,Oe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ke=!1;function Ae(){return I===null?ge:1}let z=n;function je(e,n){return t.getContext(e,n)}let Me,Ne,B,Pe,V,H,Ie,Le,Re,Be,Ve,He,We,Ke,qe,Ye,Xe,Ze,Qe,$e,et,G,tt;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:p};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r187`),t.addEventListener(`webglcontextlost`,it,!1),t.addEventListener(`webglcontextrestored`,at,!1),t.addEventListener(`webglcontextcreationerror`,ot,!1),z===null){let t=`webgl2`;if(z=je(t,e),z===null)throw je(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}nt()}catch(e){throw t.removeEventListener(`webglcontextlost`,it,!1),t.removeEventListener(`webglcontextrestored`,at,!1),t.removeEventListener(`webglcontextcreationerror`,ot,!1),W(`WebGLRenderer: `+e.message),e}function nt(){Me=new to(z),Me.init(),et=new wc(z,Me),Ne=new Fa(z,Me,e,et),B=new Sc(z,Me),Ne.reversedDepthBuffer&&h&&B.buffers.depth.setReversed(!0),re=z.createFramebuffer(),ie=z.createFramebuffer(),ae=z.createFramebuffer(),Pe=new io(z),V=new nc,H=new Cc(z,Me,B,V,Ne,et,Pe),Ie=new eo(P),Le=new Ea(z),G=new Na(z,Le),Re=new no(z,Le,Pe,G),Be=new oo(z,Re,Le,G,Pe),Ze=new ao(z,Ne,H),qe=new Ia(V),Ve=new tc(P,Ie,Me,Ne,G,qe),He=new jc(P,V),We=new oc,Ke=new pc(Me),Xe=new Ma(P,Ie,B,Be,x,s),Ye=new xc(P,Be,Ne),tt=new Mc(z,Pe,Ne,B),Qe=new Pa(z,Me,Pe),$e=new ro(z,Me,Pe),Pe.programs=Ve.programs,P.capabilities=Ne,P.extensions=Me,P.properties=V,P.renderLists=We,P.shadowMap=Ye,P.state=B,P.info=Pe}S!==1009&&(te=new co(S,t.width,t.height,o,r,i));let rt=new Oc(P,z);this.xr=rt,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let e=Me.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Me.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ge},this.setPixelRatio=function(e){e!==void 0&&(ge=e,this.setSize(me,he,!1))},this.getSize=function(e){return e.set(me,he)},this.setSize=function(e,n,r=!0){rt.isPresenting?U(`WebGLRenderer: Can't change size while VR device is presenting.`):(me=e,he=n,t.width=Math.floor(e*ge),t.height=Math.floor(n*ge),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),te!==null&&te.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(me*ge,he*ge).floor()},this.setDrawingBufferSize=function(e,n,r){me=e,he=n,ge=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(S===1009)W(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){U(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}te.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(ue)},this.getViewport=function(e){return e.copy(R)},this.setViewport=function(e,t,n,r){e.isVector4?R.set(e.x,e.y,e.z,e.w):R.set(e,t,n,r),B.viewport(ue.copy(R).multiplyScalar(Ae()).round())},this.getScissor=function(e){return e.copy(ye)},this.setScissor=function(e,t,n,r){e.isVector4?ye.set(e.x,e.y,e.z,e.w):ye.set(e,t,n,r),B.scissor(de.copy(ye).multiplyScalar(Ae()).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(e){B.setScissorTest(be=e)},this.setOpaqueSort=function(e){_e=e},this.setTransparentSort=function(e){ve=e},this.getClearColor=function(e){return e.copy(Xe.getClearColor())},this.setClearColor=function(){Xe.setClearColor(...arguments)},this.getClearAlpha=function(){return Xe.getClearAlpha()},this.setClearAlpha=function(){Xe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(I!==null){let t=I.texture.format;e=C.has(t)}if(e){let e=I.texture.type,t=w.has(e),n=Xe.getClearColor(),r=Xe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,z.clearBufferuiv(z.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,z.clearBufferiv(z.COLOR,0,E))}else r|=z.COLOR_BUFFER_BIT}t&&(r|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&z.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),F=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,it,!1),t.removeEventListener(`webglcontextrestored`,at,!1),t.removeEventListener(`webglcontextcreationerror`,ot,!1),Xe.dispose(),We.dispose(),Ke.dispose(),H.dispose(),V.dispose(),Ie.dispose(),Be.dispose(),Re.dispose(),G.dispose(),tt.dispose(),Ve.dispose(),rt.dispose(),rt.removeEventListener(`sessionstart`,ft),rt.removeEventListener(`sessionend`,pt),mt.stop()};function it(e){e.preventDefault(),Ge(`WebGLRenderer: Context Lost.`),ne=!0}function at(){Ge(`WebGLRenderer: Context Restored.`),ne=!1;let e=Pe.autoReset,t=Ye.enabled,n=Ye.autoUpdate,r=Ye.needsUpdate,i=Ye.type;nt(),Pe.autoReset=e,Ye.enabled=t,Ye.autoUpdate=n,Ye.needsUpdate=r,Ye.type=i}function ot(e){W(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function st(e){let t=e.target;t.removeEventListener(`dispose`,st),ct(t)}function ct(e){lt(e),V.remove(e)}function lt(e){let t=V.get(e).programs;t!==void 0&&(t.forEach(function(e){Ve.releaseProgram(e)}),e.isShaderMaterial&&Ve.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Oe);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Dt(e,t,n,r,i);B.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Re.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;G.setup(i,r,s,n,c);let h,g=Qe;if(c!==null&&(h=Le.get(c),g=$e,g.setIndex(h)),i.isMesh)r.wireframe===!0?(B.setLineWidth(r.wireframeLinewidth*Ae()),g.setMode(z.LINES)):g.setMode(z.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),B.setLineWidth(e*Ae()),i.isLineSegments?g.setMode(z.LINES):i.isLineLoop?g.setMode(z.LINE_LOOP):g.setMode(z.LINE_STRIP)}else i.isPoints?g.setMode(z.POINTS):i.isSprite&&g.setMode(z.TRIANGLES);if(i.isBatchedMesh){if(Me.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Le.get(c).bytesPerElement:1,o=V.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(z,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function ut(e,t,n,r){F!==null&&e.isNodeMaterial&&F.setObject(r,e),Ce===!0&&qe.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,St(e,t,r),e.side=0,e.needsUpdate=!0,St(e,t,r),e.side=2):St(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),F!==null&&F.renderStart(e,t,n),M=Ke.get(n),M.init(t),N.push(M),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(M.pushLight(e),e.castShadow&&M.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(M.pushLight(e),e.castShadow&&M.pushShadow(e))}),M.setupLights(),F!==null&&F.updateLights(M.state.lightsArray),we=this.localClippingEnabled,Ce=qe.init(this.clippingPlanes,we),Ce===!0&&qe.setGlobalState(this.clippingPlanes,t),F!==null&&Ye.render(M.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];ut(o,n,t,e),r.add(o)}else ut(i,n,t,e),r.add(i)}}),M=N.pop(),F!==null&&F.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=V.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Me.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let q=null;function dt(e){q&&q(e)}function ft(){mt.stop()}function pt(){mt.start()}let mt=new Ta;mt.setAnimationLoop(dt),typeof self<`u`&&mt.setContext(self),this.setAnimationLoop=function(e){q=e,rt.setAnimationLoop(e),e===null?mt.stop():mt.start()},rt.addEventListener(`sessionstart`,ft),rt.addEventListener(`sessionend`,pt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){W(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(ne===!0)return;F!==null&&F.renderStart(e,t);let n=rt.enabled===!0&&rt.isPresenting===!0,r=te!==null&&(I===null||n)&&te.begin(P,I);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),rt.enabled===!0&&rt.isPresenting===!0&&(te===null||te.isCompositing()===!1)&&(rt.cameraAutoUpdate===!0&&rt.updateCamera(t),t=rt.getCamera()),e.isScene===!0&&e.onBeforeRender(P,e,t,I),M=Ke.get(e,N.length),M.init(t),M.state.textureUnits=H.getTextureUnits(),N.push(M),Te.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),t.isArrayCamera?Se.setFromArrayCamera(t):xe.setFromProjectionMatrix(Te,ze,t.reversedDepth),we=this.localClippingEnabled,Ce=qe.init(this.clippingPlanes,we),k=We.get(e,ee.length),k.init(),ee.push(k),this.info.render.frame++,rt.enabled===!0&&rt.isPresenting===!0){let e=P.xr.getDepthSensingMesh();e!==null&&gt(e,t,-1/0,P.sortObjects)}gt(e,t,0,P.sortObjects),k.finish(),F!==null&&F.updateLights(M.state.lightsArray),P.sortObjects===!0&&k.sort(_e,ve),ke=rt.enabled===!1||rt.isPresenting===!1||rt.hasDepthSensing()===!1,ke&&Xe.addToRenderList(k,e),this.info.autoReset===!0&&this.info.reset(),Ce===!0&&qe.beginShadows();let i=M.state.shadowsArray;if(Ye.render(i,e,t),Ce===!0&&qe.endShadows(),(r&&te.hasRenderPass())===!1){let n=k.opaque,r=k.transmissive;if(M.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];vt(n,r,e,a)}ke&&Xe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];_t(k,e,n,n.viewport)}}else r.length>0&&vt(n,r,e,t),ke&&Xe.render(e),_t(k,e,t)}I!==null&&se===0&&(H.updateMultisampleRenderTarget(I),H.updateRenderTargetMipmap(I)),r&&te.end(P),e.isScene===!0&&e.onAfterRender(P,e,t),G.resetDefaultState(),ce=-1,le=null,N.pop(),N.length>0?(M=N[N.length-1],H.setTextureUnits(M.state.textureUnits),Ce===!0&&qe.setGlobalState(P.clippingPlanes,M.state.camera)):M=null,ee.pop(),k=ee.length>0?ee[ee.length-1]:null,F!==null&&F.renderEnd()};function gt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)M.pushLight(e),e.castShadow&&M.pushShadow(e);else if(e.isSprite){let i=t.isArrayCamera?Se:xe;if(!e.frustumCulled||e.intersectsFrustum(i)){r&&De.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Te);let i=Be.update(e),a=e.material;a.visible&&k.push(e,i,a,n,De.z,null,t)}}else if(e.isMesh||e.isLine||e.isPoints){let i=t.isArrayCamera?Se:xe;if(!e.frustumCulled||e.intersectsFrustum(i)){let i=Be.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),De.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),De.copy(e.boundingSphere.center)),De.applyMatrix4(e.matrixWorld).applyMatrix4(Te)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&k.push(e,i,c,n,De.z,s,t)}}else a.visible&&k.push(e,i,a,n,De.z,null,t)}}}let i=e.children;for(let e=0,a=i.length;e<a;e++)gt(i[e],t,n,r)}function _t(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;M.setupLightsView(n),Ce===!0&&qe.setGlobalState(P.clippingPlanes,n),r&&B.viewport(ue.copy(r)),i.length>0&&yt(i,t,n),a.length>0&&yt(a,t,n),o.length>0&&yt(o,t,n),B.buffers.depth.setTest(!0),B.buffers.depth.setMask(!0),B.buffers.color.setMask(!0),B.setPolygonOffset(!1)}function vt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[r.id]===void 0){let e=Me.has(`EXT_color_buffer_half_float`)||Me.has(`EXT_color_buffer_float`);M.state.transmissionRenderTarget[r.id]=new Ot(1,1,{generateMipmaps:!0,type:e?g:l,minFilter:c,samples:Math.max(4,Ne.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ht.workingColorSpace})}let a=M.state.transmissionRenderTarget[r.id],o=r.viewport||ue;a.setSize(o.z*P.transmissionResolutionScale,o.w*P.transmissionResolutionScale);let s=P.getRenderTarget(),u=P.getActiveCubeFace(),d=P.getActiveMipmapLevel();P.setRenderTarget(a),P.getClearColor(fe),pe=P.getClearAlpha(),pe<1&&P.setClearColor(16777215,.5),P.clear(),ke&&Xe.render(n);let f=P.toneMapping;P.toneMapping=0;let p=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),M.setupLightsView(r),Ce===!0&&qe.setGlobalState(P.clippingPlanes,r),yt(e,n,r),H.updateMultisampleRenderTarget(a),H.updateRenderTargetMipmap(a),Me.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,bt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(H.updateMultisampleRenderTarget(a),H.updateRenderTargetMipmap(a))}P.setRenderTarget(s,u,d),P.setClearColor(fe,pe),p!==void 0&&(r.viewport=p),P.toneMapping=f}function yt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&bt(o,t,n,s,l,c)}}function bt(e,t,n,r,i,a){F!==null&&i.isNodeMaterial&&F.setObject(e,i),e.onBeforeRender(P,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(P,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,P.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,P.renderBufferDirect(n,t,r,i,e,a),i.side=2):P.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(P,t,n,r,i,a)}function xt(e){let t=0;for(let n of e)n.texture!==null&&t++;return t}function St(e,t,n){t.isScene!==!0&&(t=Oe);let r=V.get(e),i=M.state.lights,a=M.state.shadowsArray,o=i.state.version,s=Ve.getParameters(e,i.state,a,t,n,M.state.lightProbeGridArray),c=Ve.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Ie.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,st),l=new Map,r.programs=l,r.programVariants=new Map);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Tt(e,s),d}else s.uniforms=Ve.getUniforms(e),F!==null&&e.isNodeMaterial&&F.build(e,n,s),e.onBeforeCompile(s,P),d=Ve.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=qe.uniform),Tt(e,s),r.needsLights=At(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.numLightProbeGrids=xt(M.state.lightProbeGridArray),r.currentProgram=d,r.uniformsList=null,d}function Ct(e,t,n,r,i){let a=V.get(e),o=a.currentProgram.id+`,`+r+`,`+i,s=a.programVariants.get(o);return s===void 0?(s=St(e,t,n),a.programVariants.set(o,s)):(a.currentProgram=s,a.uniformsList=null,a.outputColorSpace=r,a.toneMapping=i),s}function wt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=vs.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Tt(e,t){let n=V.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Dt(e,t,n,r,i){t.isScene!==!0&&(t=Oe),H.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=I===null?P.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:ht.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Ie.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(h=P.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=V.get(r),y=M.state.lights;if(Ce===!0&&(we===!0||e!==le)){let t=e===le&&r.id===ce;qe.setState(r,e,t)}let b=!1,x=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version||i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==qe.numPlanes||v.numIntersection!==qe.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.morphTargetsCount===_&&v.numLightProbeGrids===xt(M.state.lightProbeGridArray)?(v.outputColorSpace!==s||v.toneMapping!==h)&&(x=!0):b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;(b===!0||x===!0)&&(S=x===!0?Ct(r,t,i,s,h):St(r,t,i),F&&r.isNodeMaterial&&F.onUpdateProgram(r,S,v));let C=!1,w=!1,T=!1,E=S.getUniforms(),O=v.uniforms;if(B.useProgram(S.program)&&(C=!0,w=!0,T=!0),r.id!==ce&&(ce=r.id,w=!0),C||le!==e){B.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),E.setValue(z,`projectionMatrix`,e.projectionMatrix),E.setValue(z,`viewMatrix`,e.matrixWorldInverse);let t=E.map.cameraPosition;t!==void 0&&t.setValue(z,Ee.setFromMatrixPosition(e.matrixWorld)),Ne.logarithmicDepthBuffer&&E.setValue(z,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&E.setValue(z,`isOrthographic`,e.isOrthographicCamera===!0),le!==e&&(le=e,w=!0,T=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&E.setValue(z,`sunShadowMap`,y.state.sunShadowMap,H),y.state.directionalShadowMap.length>0&&E.setValue(z,`directionalShadowMap`,y.state.directionalShadowMap,H),y.state.spotShadowMap.length>0&&E.setValue(z,`spotShadowMap`,y.state.spotShadowMap,H),y.state.pointShadowMap.length>0&&E.setValue(z,`pointShadowMap`,y.state.pointShadowMap,H)),i.isSkinnedMesh){E.setOptional(z,i,`bindMatrix`),E.setOptional(z,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),E.setValue(z,`boneTexture`,e.boneTexture,H))}i.isBatchedMesh&&(E.setOptional(z,i,`batchingTexture`),E.setValue(z,`batchingTexture`,i._matricesTexture,H),E.setOptional(z,i,`batchingIdTexture`),E.setValue(z,`batchingIdTexture`,i._indirectTexture,H),E.setOptional(z,i,`batchingColorTexture`),i._colorsTexture!==null&&E.setValue(z,`batchingColorTexture`,i._colorsTexture,H));let k=n.morphAttributes;if((k.position!==void 0||k.normal!==void 0||k.color!==void 0)&&Ze.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,E.setValue(z,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(O.envMapIntensity.value=t.environmentIntensity),O.dfgLUT!==void 0&&(O.dfgLUT.value=Fc()),w){if(E.setValue(z,`toneMappingExposure`,P.toneMappingExposure),v.needsLights&&kt(O,T),a&&r.fog===!0&&He.refreshFogUniforms(O,a),He.refreshMaterialUniforms(O,r,ge,he,M.state.transmissionRenderTarget[e.id]),v.needsLights&&v.numLightProbeGrids>0){let e=D,t=0;for(let n of M.state.lightProbeGridArray)n.texture!==null&&(e.textures[t]=n.texture,e.min[t]=n.boundingBox.min,e.max[t]=n.boundingBox.max,e.resolution[t]=n.resolution,t++);for(let n in e)e[n].length=t;O.probesSH.value=e.textures,O.probesMin.value=e.min,O.probesMax.value=e.max,O.probesResolution.value=e.resolution}vs.upload(z,wt(v),O,H)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(vs.upload(z,wt(v),O,H),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&E.setValue(z,`center`,i.center),E.setValue(z,`modelViewMatrix`,i.modelViewMatrix),E.setValue(z,`normalMatrix`,i.normalMatrix),E.setValue(z,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];tt.update(n,S),tt.bind(n,S)}}return S}function kt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function At(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return oe},this.getActiveMipmapLevel=function(){return se},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(e,t,n){let r=V.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),V.get(e.texture).__webglTexture=t,V.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=V.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){I=e,oe=t,se=n;let r=null,i=!1,a=!1;if(e){let o=V.get(e);if(o.__useDefaultFramebuffer!==void 0){B.bindFramebuffer(z.FRAMEBUFFER,o.__webglFramebuffer),ue.copy(e.viewport),de.copy(e.scissor),L=e.scissorTest,B.viewport(ue),B.scissor(de),B.setScissorTest(L),ce=-1;return}if(o.__webglFramebuffer===void 0)H.setupRenderTarget(e);else if(o.__hasExternalTextures)H.rebindTextures(e,V.get(e.texture).__webglTexture,V.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&V.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);H.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=V.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&H.useMultisampledRTT(e)===!1?V.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,ue.copy(e.viewport),de.copy(e.scissor),L=e.scissorTest}else ue.copy(R).multiplyScalar(ge).floor(),de.copy(ye).multiplyScalar(ge).floor(),L=be;if(n!==0&&(r=re),B.bindFramebuffer(z.FRAMEBUFFER,r)&&B.drawBuffers(e,r),B.viewport(ue),B.scissor(de),B.setScissorTest(L),i){let r=V.get(e.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=V.get(e.textures[t]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=V.get(e.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,t.__webglTexture,n)}ce=-1};function Mt(e){let t=V.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ne.textureFormatReadable(e.format),t.__typeReadable=Ne.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){W(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=V.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){B.bindFramebuffer(z.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+s);let u=Mt(o);if(u.__formatReadable===!1){W(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){W(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&z.readPixels(t,n,r,i,et.convert(c),et.convert(l),a)}finally{let e=I===null?null:V.get(I).__webglFramebuffer;B.bindFramebuffer(z.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=V.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){B.bindFramebuffer(z.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+s);let d=Mt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,f),z.bufferData(z.PIXEL_PACK_BUFFER,a.byteLength,z.STREAM_READ),z.readPixels(t,n,r,i,et.convert(l),et.convert(u),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);let p=I===null?null:V.get(I).__webglFramebuffer;B.bindFramebuffer(z.FRAMEBUFFER,p);let m=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Je(z,m,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,f),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,a),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer(f),z.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;H.setTexture2D(e,0),z.copyTexSubImage2D(z.TEXTURE_2D,n,0,0,o,s,i,a),B.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=et.convert(t.format),_=et.convert(t.type),v;t.isData3DTexture?(H.setTexture3D(t,0),v=z.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(H.setTexture2DArray(t,0),v=z.TEXTURE_2D_ARRAY):(H.setTexture2D(t,0),v=z.TEXTURE_2D),B.activeTexture(z.TEXTURE0),B.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,t.flipY),B.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),B.pixelStorei(z.UNPACK_ALIGNMENT,t.unpackAlignment);let y=B.getParameter(z.UNPACK_ROW_LENGTH),b=B.getParameter(z.UNPACK_IMAGE_HEIGHT),x=B.getParameter(z.UNPACK_SKIP_PIXELS),S=B.getParameter(z.UNPACK_SKIP_ROWS),C=B.getParameter(z.UNPACK_SKIP_IMAGES);B.pixelStorei(z.UNPACK_ROW_LENGTH,h.width),B.pixelStorei(z.UNPACK_IMAGE_HEIGHT,h.height),B.pixelStorei(z.UNPACK_SKIP_PIXELS,l),B.pixelStorei(z.UNPACK_SKIP_ROWS,u),B.pixelStorei(z.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=V.get(e),r=V.get(t),h=V.get(n.__renderTarget),g=V.get(r.__renderTarget);B.bindFramebuffer(z.READ_FRAMEBUFFER,h.__webglFramebuffer),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,V.get(e).__webglTexture,i,d+n),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,V.get(t).__webglTexture,a,m+n)),z.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,z.DEPTH_BUFFER_BIT,z.NEAREST);B.bindFramebuffer(z.READ_FRAMEBUFFER,null),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||V.has(e)){let n=V.get(e),r=V.get(t);B.bindFramebuffer(z.READ_FRAMEBUFFER,ie),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,ae);for(let e=0;e<c;e++)w?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,n.__webglTexture,i),T?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,r.__webglTexture,a),i===0?T?z.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):z.copyTexSubImage2D(v,a,f,p,l,u,o,s):z.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,z.COLOR_BUFFER_BIT,z.NEAREST);B.bindFramebuffer(z.READ_FRAMEBUFFER,null),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?z.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?z.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):z.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):z.texSubImage2D(z.TEXTURE_2D,a,f,p,o,s,g,_,h);B.pixelStorei(z.UNPACK_ROW_LENGTH,y),B.pixelStorei(z.UNPACK_IMAGE_HEIGHT,b),B.pixelStorei(z.UNPACK_SKIP_PIXELS,x),B.pixelStorei(z.UNPACK_SKIP_ROWS,S),B.pixelStorei(z.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps===!0&&t.mipmapsAutoUpdate===!0&&z.generateMipmap(v),B.unbindTexture()},this.initRenderTarget=function(e){V.get(e).__webglFramebuffer===void 0&&H.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?H.setTextureCube(e,0):e.isData3DTexture?H.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?H.setTexture2DArray(e,0):H.setTexture2D(e,0),B.unbindTexture()},this.resetState=function(){oe=0,se=0,I=null,B.reset(),G.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return ze}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ht._getDrawingBufferColorSpace(e),t.unpackColorSpace=ht._getUnpackColorSpace()}},Lc=Math.PI*2;function X(e,t,n){return Math.min(n,Math.max(t,e))}function Rc(e,t,n){return e+(t-e)*n}function zc(e){let t=e%Lc;return t>Math.PI?t-=Lc:t<-Math.PI&&(t+=Lc),t}function Bc(e,t,n){return e+zc(t-e)*n}function Vc(e,t,n,r,i){let a=r.angle??0,o=a===0?1:Math.cos(a),s=a===0?0:Math.sin(a),c=e-r.x,l=t-r.z;if(a!==0){let e=c*o-l*s,t=c*s+l*o;c=e,l=t}let u=X(c,-r.hx,r.hx),d=X(l,-r.hz,r.hz),f=c-u,p=l-d,m=f*f+p*p;if(m>n*n)return!1;if(m>1e-12){let e=Math.sqrt(m),t=1/e;i.nx=f*t,i.nz=p*t,i.depth=n-e}else{let e=r.hx+n-Math.abs(c),t=r.hz+n-Math.abs(l);e<t?(i.nx=Math.sign(c)||1,i.nz=0,i.depth=e):(i.nx=0,i.nz=Math.sign(l)||1,i.depth=t)}if(a!==0){let e=i.nx*o+i.nz*s,t=-i.nx*s+i.nz*o;i.nx=e,i.nz=t}return!0}function Hc(e,t,n){let r=e.angle??0,i=t.angle??0,a=Math.cos(r),o=Math.sin(r),s=Math.cos(i),c=Math.sin(i),l=e.x-t.x,u=e.z-t.z,d=1/0,f=1,p=0;for(let n=0;n<4;n+=1){let r,i;n===0?(r=a,i=-o):n===1?(r=o,i=a):n===2?(r=s,i=-c):(r=c,i=s);let m=l*r+u*i,h=e.hx*Math.abs(a*r-o*i)+e.hz*Math.abs(o*r+a*i)+(t.hx*Math.abs(s*r-c*i)+t.hz*Math.abs(c*r+s*i))-Math.abs(m);if(h<0)return!1;if(h<d){d=h;let e=m<0?-1:1;f=r*e,p=i*e}}return n.nx=f,n.nz=p,n.depth=d,!0}var Uc=class{position={x:0,y:0,z:0};target={x:0,y:0,z:0};frustum;viewHeight;height;backOffset;damp;lookAheadTime;maxLookAhead;constructor(e={}){this.viewHeight=e.viewHeight??62,this.height=e.height??72,this.backOffset=e.backOffset??40,this.damp=e.damp??6,this.lookAheadTime=e.lookAhead??.3,this.maxLookAhead=e.maxLookAhead??5,this.frustum={left:0,right:0,top:this.viewHeight/2,bottom:-this.viewHeight/2,near:e.near??.1,far:e.far??500},this.resize(1,1)}resize(e,t){let n=e/Math.max(1,t);this.frustum.left=-this.viewHeight*n/2,this.frustum.right=this.viewHeight*n/2,this.frustum.top=this.viewHeight/2,this.frustum.bottom=-this.viewHeight/2}snapTo(e,t){this.position.x=e,this.position.y=this.height,this.position.z=t+this.backOffset,this.target.x=e,this.target.y=0,this.target.z=t}update(e,t,n,r,i){let a=t+X(r*this.lookAheadTime,-this.maxLookAhead,this.maxLookAhead),o=n+X(i*this.lookAheadTime,-this.maxLookAhead,this.maxLookAhead),s=1-Math.exp(-this.damp*e);this.position.x+=(a-this.position.x)*s,this.position.z+=(o+this.backOffset-this.position.z)*s,this.position.y=this.height,this.target.x=a,this.target.y=0,this.target.z=o}},Wc=8;function Gc(e){e.hit=!1,e.contacts=0,e.impact=0,e.substeps=0}function Kc(e,t,n,r,i,a,o){Gc(o);let s=Math.sqrt(e.vx*e.vx+e.vz*e.vz)*t,c=1;s>a.maxSweepStep&&(c=Math.ceil(s/a.maxSweepStep)),c>Wc&&(c=Wc),o.substeps=c;let l=t/c,u=Math.max(1,a.collisionIterations),d=e.radius+a.collisionSkin;for(let t=0;t<c;t+=1){e.x+=e.vx*l,e.z+=e.vz*l;let t=0,s=0,c=0;for(let a=0;a<u;a+=1){n.queryCircle(e.x,e.z,d,r);let a=!1;for(let n=0;n<r.length;n+=1)Vc(e.x,e.z,e.radius,r[n],i)&&(e.x+=i.nx*i.depth,e.z+=i.nz*i.depth,a=!0,o.contacts+=1,i.depth>t&&(t=i.depth,s=i.nx,c=i.nz));if(!a)break}if(t>0){o.hit=!0;let t=e.vx*s+e.vz*c;if(t<0){let n=-t;n>o.impact&&(o.impact=n);let r=e.vx-t*s,i=e.vz-t*c,l=n*a.restitution,u=1-a.collisionFriction;e.vx=r*u+l*s,e.vz=i*u+l*c}}}return o}function qc(e,t,n,r,i,a=!0){let o=Math.max(1,i.collisionIterations),s=e.angle??0,c=Math.abs(Math.cos(s)),l=Math.abs(Math.sin(s)),u=e.hx*c+e.hz*l+i.collisionSkin,d=e.hx*l+e.hz*c+i.collisionSkin,f=!1;for(let i=0;i<o;i+=1){t.queryRect(e.x,e.z,u,d,n);let i=!1;for(let t=0;t<n.length;t+=1){let o=n[t];o!==e&&(a&&o.id<0||Hc(e,o,r)&&(e.x+=r.nx*r.depth,e.z+=r.nz*r.depth,i=!0,f=!0))}if(!i)break}return f}var Jc=class{handlers=new Map;on(e,t){let n=this.handlers.get(e);return n||(n=new Set,this.handlers.set(e,n)),n.add(t),()=>this.off(e,t)}off(e,t){this.handlers.get(e)?.delete(t)}emit(e,t){let n=this.handlers.get(e);if(n)for(let r of n)try{r(t)}catch(t){console.error(`EventBus: обработчик события "${String(e)}" завершился ошибкой`,t)}}clear(){this.handlers.clear()}};function Yc(){return{throttle:0,brake:0,steer:0,handbrake:!1,reset:!1}}var Xc={KeyW:`throttle`,ArrowUp:`throttle`,KeyS:`brake`,ArrowDown:`brake`,KeyA:`steerLeft`,ArrowLeft:`steerLeft`,KeyD:`steerRight`,ArrowRight:`steerRight`,Space:`handbrake`,KeyR:`reset`},Zc=new Set([`Space`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`]),Qc=class{down=new Set;pressed=new Set;press(e){this.down.has(e)||this.pressed.add(e),this.down.add(e)}release(e){this.down.delete(e)}clear(){this.down.clear(),this.pressed.clear()}isDown(e){return this.down.has(e)}consume(e){return this.pressed.has(e)?(this.pressed.delete(e),!0):!1}read(e){return e.throttle=+!!this.down.has(`throttle`),e.brake=+!!this.down.has(`brake`),e.steer=+!!this.down.has(`steerLeft`)-!!this.down.has(`steerRight`),e.handbrake=this.down.has(`handbrake`),e.reset=this.consume(`reset`),e}};function $c(e,t){let n=t=>{let n=Xc[t.code];n&&(Zc.has(t.code)&&t.preventDefault(),e.press(n))},r=t=>{let n=Xc[t.code];n&&e.release(n)},i=()=>e.clear();return t.addEventListener(`keydown`,n),t.addEventListener(`keyup`,r),t.addEventListener(`blur`,i),()=>{t.removeEventListener(`keydown`,n),t.removeEventListener(`keyup`,r),t.removeEventListener(`blur`,i)}}var el=class{fixedUpdate;renderFrame;fixedStep;maxSteps;maxFrameDelta;rafId=0;running=!1;paused=!1;lastTime=-1;accumulator=0;overrunCount=0;debtSeconds=0;constructor(e,t,n={}){if(this.fixedUpdate=e,this.renderFrame=t,this.fixedStep=n.fixedStep??.016666666666666666,this.maxSteps=n.maxSteps??5,this.maxFrameDelta=n.maxFrameDelta??.25,!(this.fixedStep>0))throw Error(`GameLoop: fixedStep должен быть > 0`);if(!(this.maxSteps>=1))throw Error(`GameLoop: maxSteps должен быть >= 1`)}get isPaused(){return this.paused}get overrun(){return this.overrunCount}get debt(){return this.debtSeconds}start(){this.running||(this.running=!0,this.lastTime=-1,this.accumulator=0,this.overrunCount=0,this.debtSeconds=0,this.rafId=requestAnimationFrame(this.tick))}stop(){this.running&&(this.running=!1,cancelAnimationFrame(this.rafId),this.rafId=0)}pause(){this.paused||(this.paused=!0,this.accumulator=0,this.lastTime=-1)}resume(){this.paused&&(this.paused=!1,this.accumulator=0,this.lastTime=-1)}tick=e=>{if(!this.running)return;this.rafId=requestAnimationFrame(this.tick);let t=e/1e3;if(this.lastTime<0){this.lastTime=t;return}let n=t-this.lastTime;if(this.lastTime=t,this.paused)return;n>0||(n=0),n>this.maxFrameDelta&&(n=this.maxFrameDelta),this.accumulator+=n;let r=0;for(;this.accumulator>=this.fixedStep&&r<this.maxSteps;)this.fixedUpdate(this.fixedStep),this.accumulator-=this.fixedStep,r+=1;if(this.accumulator>=this.fixedStep){let e=Math.floor(this.accumulator/this.fixedStep);this.overrunCount+=e>0?e:1,this.debtSeconds+=this.accumulator,this.accumulator=0}this.renderFrame(this.accumulator/this.fixedStep,n)}},tl=class{items=[];free=[];factory;constructor(e){this.factory=e}get size(){return this.items.length}get freeCount(){return this.free.length}at(e){return this.items[e]}acquire(){let e=this.free.pop();if(e!==void 0)return this.items[e];let t=this.factory(this.items.length);return this.items.push(t),t}release(e){this.free.push(e.index)}reset(){this.free.length=0;for(let e=0;e<this.items.length;e+=1)this.free.push(e)}},nl=1<<20,rl=4095;function il(e){let t={x:0,z:0,heading:0,vx:0,vz:0,prevX:0,prevZ:0,prevHeading:0};return{index:e,entity:{id:0,kind:`prop`,transform:t,data:e},transform:t,collider:{id:0,x:0,z:0,hx:0,hz:0,angle:0},renderRef:{handle:0,variant:0,visible:!1},generation:0,kind:`prop`,alive:!1,mask:0}}var al=class{pool;hash;pendingSlots=[];kindCounts={player:0,vehicle:0,ped:0,cop:0,projectile:0,marker:0,prop:0};aliveTotal=0;dynamicColliderTotal=0;constructor(e){this.hash=e,this.pool=new tl(il)}create(e){let t=this.pool.acquire();t.generation&=rl,t.kind=e,t.alive=!0,t.mask=1,t.renderRef.visible=!1;let n=t.transform;n.x=0,n.z=0,n.heading=0,n.vx=0,n.vz=0,n.prevX=0,n.prevZ=0,n.prevHeading=0;let r=t.entity;return r.id=t.index+t.generation*nl,r.kind=e,r.data=t.index,this.aliveTotal+=1,this.kindCounts[e]+=1,r}acquire(e){return this.create(e)}destroy(e){let t=this.resolve(e);t&&(t.alive=!1,--this.aliveTotal,--this.kindCounts[t.kind],this.pendingSlots.push(t.index))}release(e){this.destroy(e)}isAlive(e){return this.resolve(e)!==null}get(e){let t=this.resolve(e);return t?t.entity:void 0}query(e,t){t.length=0;let n=this.pool.size;for(let r=0;r<n;r+=1){let n=this.pool.at(r);n.alive&&n.kind===e&&t.push(n.entity)}return t}queryMask(e,t){t.length=0;let n=this.pool.size;for(let r=0;r<n;r+=1){let n=this.pool.at(r);n.alive&&(n.mask&e)===e&&t.push(n.entity)}return t}each(e,t){let n=this.pool.size;for(let r=0;r<n;r+=1){let n=this.pool.at(r);n.alive&&n.kind===e&&t(n.entity)}}count(e){return this.kindCounts[e]}get total(){return this.aliveTotal}get capacity(){return this.pool.size}get freeSlots(){return this.pool.freeCount}get dynamicColliders(){return this.dynamicColliderTotal}hasComponent(e,t){let n=this.resolve(e);return n!==null&&(n.mask&t)!==0}getCollider(e){let t=this.resolve(e);return!t||!(t.mask&2)?null:t.collider}attachCollider(e,t,n,r){let i=this.resolve(e);if(!i)return null;let a=i.collider;return a.hx=t,a.hz=n,a.angle=r??i.transform.heading,this.syncCollider(i),i.mask&2?this.hash.update(a):(a.id=-e-1,i.mask|=2,this.dynamicColliderTotal+=1,this.hash.insert(a)),a}updateCollider(e){let t=this.resolve(e);return!t||!(t.mask&2)?!1:(this.syncCollider(t),this.hash.update(t.collider),!0)}detachCollider(e){let t=this.resolve(e);t&&t.mask&2&&this.removeCollider(t)}attachRenderRef(e,t,n=0){let r=this.resolve(e);return r?(r.mask|=4,r.renderRef.handle=t,r.renderRef.variant=n,r.renderRef.visible=!0,r.renderRef):null}getRenderRef(e){let t=this.resolve(e);return!t||!(t.mask&4)?null:t.renderRef}detachRenderRef(e){let t=this.resolve(e);t&&(t.mask&=-5,t.renderRef.visible=!1)}flush(){for(let e=0;e<this.pendingSlots.length;e+=1){let t=this.pool.at(this.pendingSlots[e]);t.mask&2&&this.removeCollider(t),t.mask=0,t.alive=!1,t.renderRef.visible=!1,t.generation=t.generation+1&rl,this.pool.release(t)}this.pendingSlots.length=0}clear(){let e=this.pool.size;for(let t=0;t<e;t+=1){let e=this.pool.at(t);e.mask&2&&this.removeCollider(e),e.mask=0,e.alive=!1,e.renderRef.visible=!1,e.generation=e.generation+1&rl}this.pendingSlots.length=0,this.aliveTotal=0,this.dynamicColliderTotal=0;for(let e of Object.keys(this.kindCounts))this.kindCounts[e]=0;this.pool.reset()}resolve(e){if(!Number.isInteger(e)||e<0)return null;let t=e%nl;if(t>=this.pool.size)return null;let n=this.pool.at(t);return!n.alive||n.entity.id!==e?null:n}syncCollider(e){let t=e.collider;t.x=e.transform.x,t.z=e.transform.z,t.angle=e.transform.heading}removeCollider(e){this.hash.remove(e.collider),--this.dynamicColliderTotal,e.mask&=-3,e.collider.id=0}};function ol(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function sl(e){let t=ol(e);return{next:t,range:(e,n)=>e+t()*(n-e),int:(e,n)=>e+Math.floor(t()*(n-e+1)),pick:e=>{if(e.length===0)throw Error(`createRng.pick: пустой массив`);return e[Math.floor(t()*e.length)]},chance:e=>t()<e}}var cl=32768,ll=65536,ul=class{cellSizeInv;cells=new Map;records=new Map;stamp=0;constructor(e=8){if(!(e>0))throw Error(`SpatialHash: cellSize должен быть > 0`);this.cellSizeInv=1/e}insert(e){if(this.records.has(e.id)){this.update(e);return}let t={item:e,minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,stamp:0};this.records.set(e.id,t),this.addToCells(t)}update(e){let t=this.records.get(e.id);t?(this.removeFromCells(t),t.item=e,this.addToCells(t)):this.insert(e)}remove(e){let t=this.records.get(e.id);t&&(this.removeFromCells(t),this.records.delete(e.id))}clear(){for(let e of this.cells.values())e.length=0;this.cells.clear(),this.records.clear(),this.stamp=0}get size(){return this.records.size}queryCircle(e,t,n,r){let i=Math.floor((e-n)*this.cellSizeInv),a=Math.floor((e+n)*this.cellSizeInv),o=Math.floor((t-n)*this.cellSizeInv),s=Math.floor((t+n)*this.cellSizeInv);return this.collect(i,a,o,s,r)}queryRect(e,t,n,r,i){let a=Math.floor((e-n)*this.cellSizeInv),o=Math.floor((e+n)*this.cellSizeInv),s=Math.floor((t-r)*this.cellSizeInv),c=Math.floor((t+r)*this.cellSizeInv);return this.collect(a,o,s,c,i)}collect(e,t,n,r,i){i.length=0;let a=this.stamp+1;this.stamp=a;for(let o=e;o<=t;o+=1)for(let e=n;e<=r;e+=1){let t=this.cells.get(dl(o,e));if(t)for(let e=0;e<t.length;e+=1){let n=t[e];n.stamp!==a&&(n.stamp=a,i.push(n.item))}}return i}addToCells(e){let t=e.item,n=t.angle??0,r=Math.abs(Math.cos(n)),i=Math.abs(Math.sin(n)),a=t.hx*r+t.hz*i,o=t.hx*i+t.hz*r,s=Math.floor((t.x-a)*this.cellSizeInv),c=Math.floor((t.x+a)*this.cellSizeInv),l=Math.floor((t.z-o)*this.cellSizeInv),u=Math.floor((t.z+o)*this.cellSizeInv);e.minCellX=s,e.maxCellX=c,e.minCellZ=l,e.maxCellZ=u;for(let t=s;t<=c;t+=1)for(let n=l;n<=u;n+=1){let r=dl(t,n),i=this.cells.get(r);i||(i=[],this.cells.set(r,i)),i.push(e)}}removeFromCells(e){for(let t=e.minCellX;t<=e.maxCellX;t+=1)for(let n=e.minCellZ;n<=e.maxCellZ;n+=1){let r=dl(t,n),i=this.cells.get(r);if(!i)continue;let a=i.indexOf(e);a>=0&&(i[a]=i[i.length-1],i.pop())}}};function dl(e,t){return(e+cl)*ll+(t+cl)}function fl(e,t,n,r,i,a,o,s){return{geometry:e,x:t,y:n,z:r,sx:i,sy:a,sz:o,color:s}}function pl(e,t=.95,n=1.05){return{parts:e,scaleMin:t,scaleMax:n}}var ml={lamp:{variants:[pl([fl(`cylinder`,0,3,0,.22,6,.22,3752009),fl(`box`,.42,6.05,0,.9,.16,.3,16765562)]),pl([fl(`cylinder`,0,2.4,0,.18,4.8,.18,4016708),fl(`box`,.35,4.85,0,.8,.15,.28,16769704)])]},bin:{variants:[pl([fl(`box`,0,.45,0,.55,.9,.55,3107663)]),pl([fl(`box`,0,.4,0,.5,.8,.5,4478571)])]},hydrant:{variants:[pl([fl(`cylinder`,0,.35,0,.5,.7,.5,12600367)],.9,1.1),pl([fl(`cylinder`,0,.3,0,.44,.6,.44,14067258)],.9,1.1)]},tree:{variants:[pl([fl(`cylinder`,0,1.2,0,.44,2.4,.44,5981234),fl(`cone`,0,3.9,0,3.6,3.4,3.6,4160058)],.9,1.15),pl([fl(`cylinder`,0,1.2,0,.44,2.4,.44,5126698),fl(`cone`,0,3.8,0,3.4,3.2,3.4,3499311)],.9,1.15),pl([fl(`cylinder`,0,1.5,0,.4,3,.4,5981234),fl(`cone`,0,4.4,0,3.2,4,3.2,4885060)],.9,1.15)],collider:{hx:.45,hz:.45}},bench:{variants:[pl([fl(`box`,0,.44,0,1.9,.12,.55,9071172),fl(`box`,0,.78,.24,1.9,.45,.1,8019002)]),pl([fl(`box`,0,.44,0,1.9,.12,.55,6056820),fl(`box`,0,.78,.24,1.9,.45,.1,5003875)])]},billboard:{variants:[pl([fl(`box`,-1.6,1.3,0,.2,2.6,.2,4869975),fl(`box`,1.6,1.3,0,.2,2.6,.2,4869975),fl(`box`,0,3.2,0,4.4,2.4,.18,13652031)]),pl([fl(`box`,-1.6,1.3,0,.2,2.6,.2,4869975),fl(`box`,1.6,1.3,0,.2,2.6,.2,4869975),fl(`box`,0,3.2,0,4.4,2.4,.18,4157392)]),pl([fl(`box`,-1.6,1.3,0,.2,2.6,.2,4869975),fl(`box`,1.6,1.3,0,.2,2.6,.2,4869975),fl(`box`,0,3.2,0,4.4,2.4,.18,4170858)])],collider:{hx:2.2,hz:.35}},fence:{variants:[pl([fl(`box`,0,.8,0,.12,1.6,2.95,7041640)],1,1),pl([fl(`box`,0,.8,0,.12,1.6,2.95,8023384)],1,1)],collider:{hx:.1,hz:1.47}}};function hl(e,t){let n=ml[e],r=t>=0&&t<n.variants.length?t:0;return n.variants[r]}function gl(e){return ml[e].collider}var _l=.1,vl=.05,yl=4.2,bl=9,xl=12,Sl=.36,Cl=.7;function wl(e,t){let n=new on;n.name=`city`,e.add(n);let r=new ni(1,1,1),i=new ri(.5,.5,1,8),a=new ii(.5,1,6),o=new _i({color:16777215}),s=new _i({color:t.colors.ground}),c=new _i({color:t.colors.water}),l=new xr({color:t.colors.marking}),u=new ni(.28,.04,yl),d=new an,f=new J,p=new Map,m=new Set,h={chunks:0,meshes:0,instances:0},g=!1,_=-1,v=null,y=[],b=null,x=(e,t,n,r,i,a,o,s,c,l)=>{d.position.set(n,r,i),d.rotation.set(0,a,0),d.scale.set(o,s,c),d.updateMatrix(),e.setMatrixAt(t,d.matrix),e.setColorAt(t,f.setHex(l))},S=(e,t)=>{e[t]+=1},C=e=>{g=!0;let t=e.bounds,r=new Nr(new ai(t.maxX-t.minX,t.maxZ-t.minZ),s);r.rotation.x=-Math.PI/2,r.position.set((t.minX+t.maxX)/2,0,(t.minZ+t.maxZ)/2),r.receiveShadow=!0,r.name=`ground`,n.add(r),v=r;let i=e.minimap.water;for(let e=0;e<i.length;e+=1){let t=i[e],r=new Nr(new ai(t.hx*2,t.hz*2),c);r.rotation.x=-Math.PI/2,r.position.set(t.x,_l,t.z),r.name=`water-${e}`,n.add(r),y.push(r)}let a=e.minimap.roads,o=0;for(let e=0;e<a.length;e+=1){let t=a[e],n=Math.hypot(t.x2-t.x1,t.z2-t.z1);n<=24||(o+=Math.ceil((n-24)/bl))}if(o>0){let e=new Gr(u,l,o);e.instanceMatrix.setUsage(Re);let t=0;for(let n=0;n<a.length;n+=1){let r=a[n],i=r.x2-r.x1,o=r.z2-r.z1,s=Math.hypot(i,o);if(s<=24)continue;let c=i/s,l=o/s,u=Math.atan2(i,o);for(let n=xl;n<s-xl;n+=bl)d.position.set(r.x1+c*n,vl,r.z1+l*n),d.rotation.set(0,u,0),d.scale.set(1,1,1),d.updateMatrix(),e.setMatrixAt(t,d.matrix),t+=1}e.count=t,e.instanceMatrix.needsUpdate=!0,e.frustumCulled=!1,e.name=`markings`,n.add(e),b=e}},w=e=>{let s={box:0,cylinder:0,cone:0},c=e.plates,l=e.buildings,u=e.props;s.box+=c.length+l.length*2;for(let e=0;e<u.length;e+=1){let t=hl(u[e].kind,u[e].variant);for(let e=0;e<t.parts.length;e+=1)S(s,t.parts[e].geometry)}let d=new on;d.name=`chunk-${e.cx}-${e.cz}`,d.matrixAutoUpdate=!1;let f=[],p={box:0,cylinder:0,cone:0},m=(t,n)=>{let r=s[t];if(r<=0)return null;let i=new Gr(n,o,r);return i.instanceMatrix.setUsage(Re),i.castShadow=!0,i.receiveShadow=!0,i.name=`${t}-${e.cx}-${e.cz}`,d.add(i),f.push(i),i},h=m(`box`,r),g=m(`cylinder`,i),_=m(`cone`,a),v=e=>{h&&(x(h,p.box,e.x,t.curbHeight/2,e.z,0,e.w,t.curbHeight,e.d,e.color),p.box+=1)},y=e=>{h&&(x(h,p.box,e.x,t.curbHeight+e.h/2,e.z,0,e.w,e.h,e.d,e.color),p.box+=1,x(h,p.box,e.x,t.curbHeight+e.h+Sl/2,e.z,0,e.w+Cl,Sl,e.d+Cl,e.roofColor),p.box+=1)},b=e=>{let n=hl(e.kind,e.variant),r=Math.cos(e.heading),i=Math.sin(e.heading);for(let a=0;a<n.parts.length;a+=1){let o=n.parts[a],s=o.geometry===`box`?h:o.geometry===`cylinder`?g:_;if(!s)continue;let c=o.x*e.scale,l=o.z*e.scale,u=e.x+c*r+l*i,d=e.z-c*i+l*r,f=t.curbHeight+o.y*e.scale;x(s,p[o.geometry],u,f,d,e.heading,o.sx*e.scale,o.sy*e.scale,o.sz*e.scale,o.color),p[o.geometry]+=1}};for(let e=0;e<c.length;e+=1)v(c[e]);for(let e=0;e<l.length;e+=1)y(l[e]);for(let e=0;e<u.length;e+=1)b(u[e]);for(let e=0;e<f.length;e+=1){let t=f[e];t.instanceMatrix.needsUpdate=!0,t.instanceColor&&(t.instanceColor.needsUpdate=!0),t.computeBoundingSphere()}return n.add(d),{key:e.renderRef,group:d,meshes:f,instances:s.box+s.cylinder+s.cone}},T=e=>{n.remove(e.group);for(let t=0;t<e.meshes.length;t+=1)e.meshes[t].dispose()};return{root:n,stats:h,sync(e){if(g||C(e),e.revision===_)return;_=e.revision,m.clear();let t=e.activeChunks;for(let e=0;e<t.length;e+=1){let n=t[e],r=n.renderRef;m.add(r),p.has(r)||p.set(r,w(n))}for(let e of p)m.has(e[0])||(T(e[1]),p.delete(e[0]));let n=0,r=0;for(let e of p.values())n+=e.meshes.length,r+=e.instances;h.chunks=p.size,h.meshes=n,h.instances=r},dispose(){for(let e of p.values())T(e);p.clear(),v&&=(n.remove(v),v.geometry.dispose(),null);for(let e=0;e<y.length;e+=1){let t=y[e];n.remove(t),t.geometry.dispose()}y.length=0,b&&=(n.remove(b),b.dispose(),null),e.remove(n),r.dispose(),i.dispose(),a.dispose(),u.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose(),h.chunks=0,h.meshes=0,h.instances=0}}}var Tl=48,El=160,Dl=1,Ol=.09,kl=16769162,Al=[`none`,`world`,`vehicle`,`npc`],jl={none:10134706,world:14271626,vehicle:16760952,npc:14212841};function Ml(e){let t=new on;t.name=`effects`,e.add(t);let n=new ni(1,1,1),r=new xr({color:kl,transparent:!0,opacity:.85,depthWrite:!1}),i=new xr({color:16777215,depthWrite:!1}),a=new Gr(n,r,Tl),o=new Gr(n,i,El);for(let e of[a,o])e.frustumCulled=!1,t.add(e);let s=new Float32Array(Tl),c=new Float32Array(Tl),l=new Float32Array(Tl),u=new Float32Array(Tl),d=new Float32Array(Tl),f=new Float32Array(Tl),p=0,m=0,h=new Float32Array(El),g=new Float32Array(El),_=new Float32Array(El),v=new Float32Array(El),y=new Float32Array(El),b=new Float32Array(El),x=new Float32Array(El),S=new Float32Array(El),C=new Float32Array(El),w=new Uint8Array(El),T=0,E=3107839,D=()=>(E=E*1664525+1013904223>>>0,E/4294967296),O=new an,k=new J,A={tracers:0,sparks:0},j=(e,t,n,r,i)=>{let a=n-e,o=r-t,h=Math.hypot(a,o);if(h<.05)return;let g=p;p=(p+1)%Tl,s[g]=(e+n)*.5,c[g]=(t+r)*.5,l[g]=Math.atan2(a,o),u[g]=h,d[g]=.06,f[g]=.06,m<Tl&&(m+=1),i!==`none`&&M(n,r,i,3),M(e,t,`none`,1)},M=(e,t,n,r)=>{for(let i=0;i<r;i+=1){let r=T;T=(T+1)%El,h[r]=e,g[r]=.8,_[r]=t,v[r]=(D()-.5)*3.2,y[r]=1+D()*2.4,b[r]=(D()-.5)*3.2,x[r]=.18+D()*.16,S[r]=x[r],C[r]=n===`none`?.1:.07+D()*.08,w[r]=Al.indexOf(n)}};return{tracer:j,impact:(e,t,n)=>{M(e,t,n,n===`vehicle`?4:3)},sync:e=>{let t=0;for(let n=0;n<Tl;n+=1){let r=d[n];r<=0||(r-=e,r<=0?(d[n]=0,m=Math.max(0,m-1)):(d[n]=r,O.position.set(s[n],Dl,c[n]),O.rotation.set(0,l[n],0),O.scale.set(Ol,Ol,u[n]),O.updateMatrix(),a.setMatrixAt(t,O.matrix),t+=1))}a.count=t,a.instanceMatrix.needsUpdate=!0;let n=0;for(let t=0;t<El;t+=1){let r=x[t];if(r<=0)continue;if(r-=e,r<=0){x[t]=0;continue}x[t]=r,y[t]-=9.8*e,h[t]+=v[t]*e,g[t]+=y[t]*e,_[t]+=b[t]*e,g[t]<.05&&(g[t]=.05,y[t]=0);let i=C[t]*(.6+r/S[t]*1.2);O.position.set(h[t],g[t],_[t]),O.rotation.set(0,0,0),O.scale.set(i,i,i),O.updateMatrix(),o.setMatrixAt(n,O.matrix),k.setHex(jl[Al[w[t]]]),o.setColorAt(n,k),n+=1}o.count=n,o.instanceMatrix.needsUpdate=!0,o.instanceColor&&(o.instanceColor.needsUpdate=!0),A.tracers=t,A.sparks=n},stats:A,dispose(){e.remove(t),n.dispose(),r.dispose(),i.dispose()}}}var Nl=240,Pl=.55,Fl=1.18,Il=.22,Ll=.3,Rl=[5090295,16766011,5361510,16746375,11638780,16221100,13554906],zl=2837131,Bl=15911328,Vl=15911328;function Hl(e){let t=e%(Math.PI*2);return t>Math.PI?t-=Math.PI*2:t<-Math.PI&&(t+=Math.PI*2),t}function Ul(e){let t=new on;t.name=`npcs`,e.add(t);let n=new ri(.26,.32,.9,6),r=new oi(.21,8,6),i=new _i({color:16777215}),a=new _i({color:16777215}),o=new Gr(n,i,Nl),s=new Gr(r,a,Nl);o.castShadow=!0,s.castShadow=!1;for(let e of[o,s])e.frustumCulled=!1,t.add(e);let c=new an,l=new J,u={peds:0,cops:0,down:0},d=new WeakMap,f=(e,t,n)=>{let r=e.transform,i=r.prevX+(r.x-r.prevX)*n,a=r.prevZ+(r.z-r.prevZ)*n,u=r.prevHeading+Hl(r.heading-r.prevHeading)*n,f=e.state===`down`,p=e.speed>.1&&!f,m=d.get(e)??0;m+=p?e.speed*.09:0,d.set(e,m);let h=Math.sin(m)*.06;f?(c.position.set(i,Il,a),c.rotation.set(Math.PI/2,u,0),c.scale.set(1,1,1)):(c.position.set(i,Pl,a),c.rotation.set(h,u,0),c.scale.set(1,1,1)),c.updateMatrix(),o.setMatrixAt(t,c.matrix),l.setHex(e.kind===`cop`?zl:Rl[e.variant%Rl.length]),o.setColorAt(t,l),f?(c.position.set(i,Ll,a),c.rotation.set(Math.PI/2,u,0)):(c.position.set(i,Fl-Math.abs(h)*.3,a),c.rotation.set(0,u,0)),c.updateMatrix(),s.setMatrixAt(t,c.matrix),l.setHex(e.kind===`cop`?Bl:Vl),s.setColorAt(t,l)};return{sync:(e,t,n,r)=>{let i=0,a=0;for(let t=0;t<e.length&&i<Nl;t+=1){let r=e[t];f(r,i,n),r.state===`down`&&(a+=1),i+=1}let c=i;for(let e=0;e<t.length&&i<Nl;e+=1){let r=t[e];f(r,i,n),r.state===`down`&&(a+=1),i+=1}o.count=i,s.count=i,o.instanceMatrix.needsUpdate=!0,s.instanceMatrix.needsUpdate=!0,o.instanceColor&&(o.instanceColor.needsUpdate=!0),s.instanceColor&&(s.instanceColor.needsUpdate=!0),u.peds=c,u.cops=i-c,u.down=a},stats:u,dispose(){e.remove(t),n.dispose(),r.dispose(),i.dispose(),a.dispose()}}}function Wl(e){let t=new on;t.name=`player`;let n=new _i({color:5090295}),r=new _i({color:15911328}),i=new ri(.3,.36,1,8),a=new oi(.25,10,8),o=new Nr(i,n);o.position.y=.55,o.castShadow=!0,t.add(o);let s=new Nr(a,r);s.position.y=1.2,s.castShadow=!0,t.add(s);let c=new ni(.1,.1,.18),l=new Nr(c,r);return l.position.set(0,1.2,.24),t.add(l),e.add(t),{sync(e,n,r,i){t.visible=i,t.position.set(e,0,n),t.rotation.y=r},dispose(){e.remove(t),i.dispose(),a.dispose(),c.dispose(),n.dispose(),r.dispose()}}}var Gl=96,Kl=512,ql=600,Jl=1712688,Yl=.07;function Xl(e,t={}){let n=t.maxVehicles??Gl,r=t.maxSmoke??Kl,i=t.maxSkid??ql,a=new on;a.name=`vehicles`,e.add(a);let o=new ni(1,1,1),s=new ri(.5,.5,1,10);s.rotateZ(Math.PI/2);let c=new _i({color:16777215}),l=new _i({color:Jl}),u=new _i({color:16777215}),d=new _i({color:16777215}),f=new _i({color:1119515}),p=new Gr(o,c,n),m=new Gr(o,l,n),h=new Gr(o,u,n),g=new Gr(o,d,n),_=new Gr(s,f,n*4);p.castShadow=!0,m.castShadow=!0,h.castShadow=!0,g.castShadow=!1,_.castShadow=!0;for(let e of[p,m,h,g,_])e.frustumCulled=!1,a.add(e);let v=new Gr(o,new xr({color:16777215,transparent:!0,opacity:.42,depthWrite:!1}),r);v.frustumCulled=!1,a.add(v);let y=new Float32Array(r),b=new Float32Array(r),x=new Float32Array(r),S=new Float32Array(r),C=new Float32Array(r),w=new Float32Array(r),T=new Float32Array(r),E=new Float32Array(r),D=new Float32Array(r),O=new Float32Array(r),k=new Float32Array(r),A=new Float32Array(r),j=0,M=new Gr(new ai(1,1).rotateX(-Math.PI/2),new xr({color:724498,transparent:!0,opacity:.45,depthWrite:!1}),i);M.frustumCulled=!1,a.add(M);let ee=0,N=0,te=!1,P=new an,ne=new J,F=new Float32Array(n),re=new Float32Array(n),ie=2654435769,ae=()=>(ie=ie*1664525+1013904223>>>0,ie/4294967296),oe=(e,t,n,i,a,o,s,c)=>{let l=j;j=(j+1)%r,y[l]=e+(ae()-.5)*.6,b[l]=t,x[l]=n+(ae()-.5)*.6,S[l]=(ae()-.5)*.8,C[l]=1.1+ae()*1.2,w[l]=(ae()-.5)*.8,T[l]=i,E[l]=i,D[l]=a,O[l]=o,k[l]=s,A[l]=c},se=(e,t,n)=>{let r=10+Math.round(n*10);for(let n=0;n<r;n+=1){let r=n%3==0;oe(e,.8,t,.9+ae()*.7,.7+ae()*.5,r?.95:.32,r?.5:.34,r?.24:.36)}},I=(e,t,n)=>{P.position.set(e,Yl,t),P.rotation.set(0,n,0),P.scale.set(.3,1,1.05),P.updateMatrix(),M.setMatrixAt(ee,P.matrix),ee=(ee+1)%i,N<i&&(N+=1),te=!0},ce={vehicles:0,smoke:0,skid:0,drawCalls:7};return{sync:(e,t,n)=>{let i=0,a=0,o=0,s=0,c=0;for(let r=0;r<e.length;r+=1){let l=e[r],u=l.transform,d=l.config,f=u.prevX+(u.x-u.prevX)*t,v=u.prevZ+(u.z-u.prevZ)*t,y=u.prevHeading+Zl(u.heading-u.prevHeading)*t,b=d.width,x=d.length,S=d.height,C=.62,w=.5,T=.52,E=b*.86,D=x*.44,O=1.05,k=-.1,A=!1,j=0,M=0,ee=0;l.type===`sports`?(C=.5,w=.45,T=.4,E=b*.8,D=x*.38,O=.88,k=-.15):l.type===`van`?(C=1.15,w=.78,T=.5,E=b*.94,D=x*.26,O=1.57,k=x*.24):l.type===`truck`?(C=.72,w=.58,T=.95,E=b*.92,D=x*.2,O=1.42,k=x*.36,A=!0,j=1.55,M=x*.66,ee=1.6):l.type===`police`&&(C=.64,w=.52,T=.5,O=1.06),P.position.set(f,w,v),P.rotation.set(0,y,0),P.scale.set(b,C,x),P.updateMatrix(),p.setMatrixAt(i,P.matrix),ne.setHex(l.color),p.setColorAt(i,ne),i+=1,P.position.set(f+Math.sin(y)*k,O,v+Math.cos(y)*k),P.rotation.set(0,y,0),P.scale.set(E,T,D),P.updateMatrix(),m.setMatrixAt(a,P.matrix),a+=1,A&&(P.position.set(f-Math.sin(y)*x*.16,ee,v-Math.cos(y)*x*.16),P.rotation.set(0,y,0),P.scale.set(b*.98,j,M),P.updateMatrix(),h.setMatrixAt(o,P.matrix),ne.setHex(l.color).multiplyScalar(.82),h.setColorAt(o,ne),o+=1),l.type===`police`&&(P.position.set(f,O+T/2+.12,v),P.rotation.set(0,y,0),P.scale.set(b*.5,.16,.34),P.updateMatrix(),g.setMatrixAt(s,P.matrix),ne.setHex(l.handle%2==0?3107839:16726832),g.setColorAt(s,ne),s+=1);let N=Math.min(.52,Math.max(.3,S*.3)),te=b/2-.02,ie=x/2-Math.min(1.05,x*.22);for(let e=0;e<4;e+=1){let t=e<2?1:-1,n=e%2==0?1:-1,r=t*te,i=n*ie;P.position.set(f+Math.cos(y)*r+Math.sin(y)*i,N,v-Math.sin(y)*r+Math.cos(y)*i),P.rotation.set(0,y,0),P.scale.set(.3,N*2,N*2),P.updateMatrix(),_.setMatrixAt(c,P.matrix),c+=1}let se=l.hp/l.maxHp;if(se<.3){let e=F[r];if(e-=n,e<=0){e=l.wrecked?.045:.07+se*.4;let t=l.wrecked?1.1:S*.75,n=l.wrecked?.22:.34;oe(f,t,v,1.1+ae()*.6,.5+(.3-se),n,n+.02,n+.05)}F[r]=e}else F[r]=0;let ce=Math.hypot(u.vx,u.vz);if((l.slip>.8||ce>3&&l.steer!==0&&l.slip>1.2)&&ce>2.5){let e=re[r]-n;if(e<=0){e=.045;let t=-x*.32,n=b/2-.16;I(f+Math.cos(y)*n+Math.sin(y)*t,v-Math.sin(y)*n+Math.cos(y)*t,y),I(f-Math.cos(y)*n+Math.sin(y)*t,v+Math.sin(y)*n+Math.cos(y)*t,y)}re[r]=e}else re[r]=0}p.count=i,m.count=a,h.count=o,g.count=s,_.count=c,p.instanceMatrix.needsUpdate=!0,m.instanceMatrix.needsUpdate=!0,h.instanceMatrix.needsUpdate=!0,g.instanceMatrix.needsUpdate=!0,_.instanceMatrix.needsUpdate=!0,p.instanceColor&&(p.instanceColor.needsUpdate=!0),h.instanceColor&&(h.instanceColor.needsUpdate=!0),g.instanceColor&&(g.instanceColor.needsUpdate=!0);let l=0;for(let e=0;e<r;e+=1){let t=T[e];if(t<=0)continue;if(t-=n,t<=0){T[e]=0;continue}T[e]=t,y[e]+=S[e]*n,b[e]+=C[e]*n,x[e]+=w[e]*n,C[e]+=.8*n;let r=1-t/E[e],i=D[e]*(1+r*2.4);P.position.set(y[e],b[e],x[e]),P.rotation.set(0,0,0),P.scale.set(i,i,i),P.updateMatrix(),v.setMatrixAt(l,P.matrix),ne.setRGB(O[e],k[e],A[e]),v.setColorAt(l,ne),l+=1}v.count=l,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),ce.smoke=l,M.count=N,te&&=(M.instanceMatrix.needsUpdate=!0,!1),ce.skid=N,ce.vehicles=e.length},burst:se,stats:ce,dispose(){e.remove(a),o.dispose(),s.dispose(),c.dispose(),l.dispose(),u.dispose(),d.dispose(),f.dispose(),v.geometry.dispose(),v.material.dispose(),M.geometry.dispose(),M.material.dispose()}}}function Zl(e){let t=e%(Math.PI*2);return t>Math.PI?t-=Math.PI*2:t<-Math.PI&&(t+=Math.PI*2),t}var Ql={fixedStep:1/60,maxSubsteps:5,maxFrameDelta:.25,spatialCellSize:8,collisionIterations:3,restitution:.2,collisionFriction:.12,maxSweepStep:.4,collisionSkin:.02,stressStaticColliders:300,stressMovingColliders:50},$l={seed:20261123,sizeMeters:1200,chunkSize:128,blockStep:100,blockHalf:40,sidewalkWidth:3,roadWidth:20,laneWidth:3.4,curbHeight:.18,waterfrontPromenadeWidth:50,waterfrontWaterWidth:40,streamRadius:2,streamHysteresis:0,maxChunksPerUpdate:4,propsDensity:1,colors:{ground:3093821,sidewalk:4870749,park:3823419,parking:3883595,water:1788506,marking:14278888},districts:{center:{weight:.7,heightMin:7,heightMax:48,buildingColors:[9147297,10260352,8228511,10721415,7306120,10134706],roofColors:[6120816,7037269,5529195,7234905]},industrial:{weight:.2,heightMin:5,heightMax:11,buildingColors:[8221541,9076589,7236194,8747370],roofColors:[5460042,6051405,4933698]},waterfront:{weight:.1,heightMin:6,heightMax:12,buildingColors:[10134443,9411222,11051151],roofColors:[6449778,7041645]}}};function eu(e){return Math.hypot(e.width,e.length)*.375}var tu={sedan:{id:`sedan`,label:`Седан`,mass:1200,accel:22,maxSpeed:30,maxReverse:9,steerRate:2.6,grip:6.5,handbrakeGrip:.8,brake:34,hp:100,seats:4,length:4.4,width:1.9,height:1.35,colors:[16735324,5090295,15134195,5361510,16766011,8675063]},sports:{id:`sports`,label:`Спорткар`,mass:1e3,accel:30,maxSpeed:38,maxReverse:10,steerRate:3.1,grip:7.2,handbrakeGrip:.55,brake:38,hp:90,seats:2,length:4.3,width:1.95,height:1.12,colors:[16726832,16766474,3199320,689407,16119287]},van:{id:`van`,label:`Фургон`,mass:1800,accel:17,maxSpeed:24,maxReverse:8,steerRate:2.05,grip:5.6,handbrakeGrip:.9,brake:28,hp:130,seats:6,length:5.2,width:2.1,height:2.1,colors:[11384253,7651580,16755021,13554906]},truck:{id:`truck`,label:`Грузовик`,mass:3200,accel:13.5,maxSpeed:19,maxReverse:7,steerRate:1.6,grip:4.8,handbrakeGrip:1,brake:22,hp:190,seats:2,length:7,width:2.4,height:2.6,colors:[9147297,14239759,4804695,15764480]},police:{id:`police`,label:`Полицейская машина`,mass:1350,accel:26,maxSpeed:34,maxReverse:9,steerRate:2.8,grip:7,handbrakeGrip:.7,brake:36,hp:120,seats:4,length:4.6,width:1.95,height:1.42,colors:[15134195,1779259]}},nu=[`sedan`,`sports`,`van`,`truck`,`police`];function ru(e){return e===`sedan`||e===`sports`||e===`van`||e===`truck`||e===`police`}var iu={drag:.55,rollingResistance:2.2,reverseAccel:.65,steerSpeedRef:6,impactMinSpeed:2.5,impactDamagePerSpeed:4.5,impactTransfer:.55,impactPush:.35,smokeRatio:.3,boundsMargin:1.5,parkedSpeed:.02,referenceMass:1200,damageScaleMin:.55,damageScaleMax:1.6},au={radius:.45,moveSpeed:5,accel:18,enterRadius:3,exitGap:.7,boundsMargin:.5,height:1.1},ou=[[1,0],[-1,0],[0,-1],[0,1],[.7,.7],[-.7,.7],[.7,-.7],[-.7,-.7]],su={pistol:{id:`pistol`,label:`Пистолет`,damage:14,rate:3.5,spread:.02,pellets:1,range:48,mag:12,reserve:96,reload:1.3,auto:!1,recoil:.25,tracerLife:.06},smg:{id:`smg`,label:`ПП`,damage:9,rate:9,spread:.05,pellets:1,range:40,mag:30,reserve:180,reload:1.9,auto:!0,recoil:.14,tracerLife:.05},shotgun:{id:`shotgun`,label:`Дробовик`,damage:9,rate:1.1,spread:.14,pellets:6,range:24,mag:6,reserve:48,reload:2.3,auto:!1,recoil:.6,tracerLife:.07}},cu=[`pistol`,`smg`,`shotgun`];function lu(e){return e===`pistol`||e===`smg`||e===`shotgun`}var Z={maxVehicles:60,spawnInterval:.5,carsPerSpawn:2,spawnMinDistance:110,spawnMaxDistance:220,despawnDistance:240,nearDistance:120,farStride:2,safeRadius:55,safeTime:5,laneLookAhead:9,speedScale:.82,scanAhead:16,gapSkin:1.6,gapStop:4.2,gapSlow:12,lightZone:20,lightStopT:.9,lightCycle:16,lightGreenShare:.42,lightYellowShare:.07,intersectionRadius:12,yieldOffset:1.7,sirenRadius:45,sirenSpeedFactor:.35,honkInterval:4,offLaneLimit:14,typeWeights:[`sedan`,`sedan`,`sports`,`van`,`truck`]},Q={maxPeds:200,spawnInterval:.4,pedsPerSpawn:3,spawnMinDistance:70,spawnMaxDistance:170,despawnDistance:210,closeSpawnDistance:30,nearTarget:10,nearRadius:45,nearDistance:80,farStride:4,safeRadius:30,safeTime:5,radius:.35,walkSpeed:1.35,walkSpeedSpread:.3,fleeSpeed:4.4,panicSpeed:5.2,copSpeed:5.2,turnRate:7,arriveDistance:.8,idleChance:.16,idleMin:1.2,idleMax:3.6,alertTime:1.5,fleeTime:5.5,panicTime:4.5,downTime:3.4,crossingChance:.35,sidewalkInset:1.6,carThreatRadius:7,carHitSpeed:5,gunshotPanicRadius:28,gunshotAlertRadius:55,sirenAlertRadius:40,routeCapacity:8},$={maxCops:8,thresholds:[7,18,34,56,82],crimes:{shot:6,pedHit:5,pedDown:12,copShot:16,copCarHit:10,vehicleShot:2,ramCop:10},crimePause:7,coolRate:1.4,coverDelay:9,coverRate:14,seenRadius:140,spawnInterval:2.5,carSpawnMinDistance:35,carSpawnMaxDistance:55,footSpawnMinDistance:35,footSpawnMaxDistance:70,despawnDistance:220,aggressiveLevel:2,roadblockLevel:3,interceptLevel:4,pitRange:9,pitAngle:.9,ramRange:5,arrestRadius:3.2,arrestSpeed:1.8,chaseSpeedFactor:1.02,carsPerLevel:[0,1,2,3,4,5],footPerLevel:[0,0,1,2,3,3],copWeapon:`pistol`,copAccuracy:.9,copFireRange:32,copFireInterval:1.5,copDamageScale:1,playerHealth:100,healthRegen:1.2,healthRegenDelay:8,footLifetime:45},uu=class{list=[];indexById=new Map;nextHandle=0;get size(){return this.list.length}allocHandle(){let e=this.nextHandle;return this.nextHandle+=1,e}add(e){this.indexById.set(e.id,this.list.length),this.list.push(e)}get(e){let t=this.indexById.get(e);return t===void 0?void 0:this.list[t]}remove(e){let t=this.indexById.get(e);if(t===void 0)return null;let n=this.list[t];this.list.splice(t,1),this.indexById.delete(e);for(let e=t;e<this.list.length;e+=1)this.indexById.set(this.list[e].id,e);return n}clear(){this.list.length=0,this.indexById.clear(),this.nextHandle=0}};function du(e,t,n){let r=n.type??`sedan`,i=tu[r],a=t.create(`vehicle`),o=a.transform;o.x=n.x,o.z=n.z,o.heading=n.heading,o.vx=0,o.vz=0,o.prevX=n.x,o.prevZ=n.z,o.prevHeading=n.heading;let s=n.colorIndex===void 0?0:(n.colorIndex%i.colors.length+i.colors.length)%i.colors.length,c=e.allocHandle(),l=t.attachCollider(a.id,i.width/2,i.length/2,n.heading);t.attachRenderRef(a.id,c,s);let u={id:a.id,type:r,config:i,transform:o,collider:l,handle:c,hp:i.hp,maxHp:i.hp,driver:-1,wrecked:!1,justWrecked:!1,forward:0,lateral:0,steer:0,slip:0,rpm:0,lastImpact:0,impactPulse:0,smoking:!1,color:i.colors[s],colorIndex:s};return e.add(u),u}function fu(e,t,n){e.remove(n.id),t.destroy(n.id)}function pu(e,t,n,r,i){let a=t.transform;a.x=n,a.z=r,a.heading=i,a.vx=0,a.vz=0,a.prevX=n,a.prevZ=r,a.prevHeading=i,t.forward=0,t.lateral=0,t.slip=0,t.steer=0,e.updateCollider(t.id)}function mu(e,t){return t<=0||e.wrecked||(e.hp=Math.max(0,e.hp-t),e.smoking=e.hp/e.maxHp<iu.smokeRatio,e.hp>0)?!1:(e.wrecked=!0,e.justWrecked=!0,e.rpm=0,!0)}function hu(e){e.hp=e.maxHp,e.wrecked=!1,e.justWrecked=!1,e.smoking=!1,e.lastImpact=0,e.impactPulse=0}function gu(e){return X(iu.referenceMass/e.config.mass,iu.damageScaleMin,iu.damageScaleMax)}function _u(e){return!e.wrecked&&e.driver===-1}function vu(e,t,n){let r=e.transform,i=t-r.x,a=n-r.z,o=Math.cos(r.heading),s=Math.sin(r.heading),c=i*o-a*s,l=i*s+a*o,u=Math.abs(c)-e.config.width/2,d=Math.abs(l)-e.config.length/2;return u<=0&&d<=0?0:Math.hypot(Math.max(u,0),Math.max(d,0))}function yu(e,t,n,r){let i=null,a=r;for(let r=0;r<e.list.length;r+=1){let o=e.list[r];if(!_u(o))continue;let s=vu(o,t,n);s<=a&&(a=s,i=o)}return i}var bu=class{list=[];indexById=new Map;free=[];capacity;constructor(e=Q.maxPeds+8){this.capacity=e}get size(){return this.list.length}get freeCount(){return this.free.length}acquire(){let e=this.free.pop();if(e)return e;if(this.list.length+this.free.length>=this.capacity)return null;let t=new Float32Array(Q.routeCapacity*2);return{id:0,kind:`ped`,transform:{x:0,z:0,heading:0,vx:0,vz:0,prevX:0,prevZ:0,prevHeading:0},state:`walk`,variant:0,phase:0,speed:0,baseSpeed:Q.walkSpeed,timer:0,downTimer:0,route:t,routeCount:0,routeIndex:0,blockIndex:-1,threatX:0,threatZ:0,hp:1,copCarId:-1,attackTimer:0,aiming:!1,lifeTimer:0}}add(e){this.indexById.set(e.id,this.list.length),this.list.push(e)}get(e){let t=this.indexById.get(e);return t===void 0?void 0:this.list[t]}remove(e){let t=this.indexById.get(e);if(t===void 0)return null;let n=this.list[t];this.list.splice(t,1),this.indexById.delete(e);for(let e=t;e<this.list.length;e+=1)this.indexById.set(this.list[e].id,e);return n.routeCount=0,n.routeIndex=0,this.free.push(n),n}clear(){this.list.length=0,this.indexById.clear()}};function xu(e,t,n){let r=e.acquire();if(!r)return null;let i=t.create(n.kind),a=i.transform;return a.x=n.x,a.z=n.z,a.heading=n.heading,a.vx=0,a.vz=0,a.prevX=n.x,a.prevZ=n.z,a.prevHeading=n.heading,r.id=i.id,r.kind=n.kind,r.transform=a,r.state=`walk`,r.variant=n.variant??0,r.phase=0,r.speed=0,r.baseSpeed=Q.walkSpeed+Q.walkSpeedSpread*(r.variant%5-2)/2,r.timer=0,r.downTimer=0,r.routeCount=0,r.routeIndex=0,r.blockIndex=-1,r.threatX=n.x,r.threatZ=n.z,r.hp=1,r.copCarId=-1,r.attackTimer=0,r.aiming=!1,r.lifeTimer=0,e.add(r),r}function Su(e,t,n){e.remove(n.id),t.destroy(n.id)}function Cu(e,t){return e.state===`down`||t<=0||(e.hp-=t,e.hp>0)?!1:(e.hp=0,e.state=`down`,e.speed=0,e.downTimer=Q.downTime,e.timer=0,e.phase=0,!0)}function wu(e){e.hp=1,e.downTimer=0,e.state=`panic`,e.timer=Q.panicTime}var Tu=Object.freeze({throttle:0,brake:0,steer:0,handbrake:!1}),Eu={engineRpm:()=>void 0,skid:()=>void 0,impact:()=>void 0,explosion:()=>void 0},Du=class{registry;fleet;hash;tuning;audio;bounds;body={x:0,z:0,vx:0,vz:0,radius:1.8};solve={hit:!1,contacts:0,impact:0,substeps:0};contact={nx:0,nz:0,depth:0};candidates=[];neighbors=[];constructor(e,t,n,r,i=null,a=Eu){this.registry=e,this.fleet=t,this.hash=n,this.tuning=r,this.bounds=i,this.audio=a}step(e,t,n){let r=e.transform;r.prevX=r.x,r.prevZ=r.z,r.prevHeading=r.heading;let i=e.config,a=e.wrecked,o=a?0:X(t.throttle,0,1),s=a?0:X(t.brake,0,1),c=a?0:X(t.steer,-1,1),l=!a&&t.handbrake;if(r.vx*r.vx+r.vz*r.vz<iu.parkedSpeed*iu.parkedSpeed&&o===0&&s===0){e.forward=0,e.lateral=0,e.slip=0,e.steer=c,e.rpm=0,e.driver>=0&&this.audio.engineRpm(e.id,0);return}let u=Math.sin(r.heading),d=Math.cos(r.heading),f=r.vx*u+r.vz*d,p=r.vx*d-r.vz*u;o>0&&(f+=i.accel*o*n),s>0&&(f-=f>.5?i.brake*s*n:i.accel*iu.reverseAccel*s*n),f-=f*iu.drag*n,f-=Math.sign(f)*Math.min(Math.abs(f),iu.rollingResistance*n),f=X(f,-i.maxReverse,i.maxSpeed);let m=Math.min(1,Math.abs(f)/iu.steerSpeedRef),h=f<0?-1:1;r.heading+=c*i.steerRate*n*m*h,p*=Math.exp(-(l?i.handbrakeGrip:i.grip)*n),a&&(f*=Math.exp(-2.5*n),p*=Math.exp(-2.5*n)),r.vx=u*f+d*p,r.vz=d*f-u*p;let g=eu(i),_=this.body;_.x=r.x,_.z=r.z,_.vx=r.vx,_.vz=r.vz,_.radius=g;let v=e.collider;if(v&&this.hash.remove(v),Gc(this.solve),Kc(_,n,this.hash,this.candidates,this.contact,this.tuning,this.solve),this.bounds){let e=g+iu.boundsMargin;_.x=X(_.x,this.bounds.minX+e,this.bounds.maxX-e),_.z=X(_.z,this.bounds.minZ+e,this.bounds.maxZ-e)}r.x=_.x,r.z=_.z,r.vx=_.vx,r.vz=_.vz;let y=this.solve.hit?this.solve.impact:0;if(y>iu.impactMinSpeed){let t=mu(e,(y-iu.impactMinSpeed)*iu.impactDamagePerSpeed*gu(e));e.lastImpact=y,y>e.impactPulse&&(e.impactPulse=y),this.audio.impact(e.id,y),t&&this.audio.explosion(e.id),this.pushNeighbors(e,y)}v&&this.registry.updateCollider(e.id),e.forward=f,e.lateral=p,e.slip=Math.abs(p),e.steer=c;let b=a?0:X(.1+Math.abs(f)/i.maxSpeed*.75+o*.15,0,1);e.rpm=b,e.smoking=e.hp/e.maxHp<iu.smokeRatio,e.driver>=0&&(this.audio.engineRpm(e.id,b),(e.slip>.6||l&&Math.abs(f)>3)&&this.audio.skid(e.id,X(e.slip/6,0,1)))}pushNeighbors(e,t){let n=this.body,r=-e.id-1;this.hash.queryCircle(n.x,n.z,n.radius+.35,this.neighbors);for(let i=0;i<this.neighbors.length;i+=1){let a=this.neighbors[i];if(a.id>=0||a.id===r||!Vc(n.x,n.z,n.radius+.15,a,this.contact))continue;let o=-a.id-1;if(o===e.id)continue;let s=this.fleet.get(o);if(!s)continue;let c=e.config.mass/(e.config.mass+s.config.mass),l=t*iu.impactPush*c;s.transform.vx-=this.contact.nx*l,s.transform.vz-=this.contact.nz*l;let u=(t-iu.impactMinSpeed)*iu.impactDamagePerSpeed*iu.impactTransfer;u>0&&mu(s,u*gu(s))}}};function Ou(){let e=!1,t=null,n=null,r=null,i=null,a=null,o=null,s=null,c=()=>{if(e)return!1;if(t)return t.state===`suspended`&&t.resume(),!0;try{let s=window,c=window.AudioContext??s.webkitAudioContext;if(!c)return e=!0,!1;t=new c,n=t.createGain(),n.gain.value=.18,n.connect(t.destination),r=t.createOscillator(),r.type=`sawtooth`,r.frequency.value=48,i=t.createGain(),i.gain.value=0,r.connect(i),i.connect(n),r.start();let l=t.sampleRate,u=Math.floor(l*.5);a=t.createBuffer(1,u,l);let d=a.getChannelData(0);for(let e=0;e<u;e+=1)d[e]=Math.random()*2-1;let f=t.createBufferSource();f.buffer=a,f.loop=!0;let p=t.createBiquadFilter();return p.type=`bandpass`,p.frequency.value=1100,p.Q.value=.8,o=t.createGain(),o.gain.value=0,f.connect(p),p.connect(o),o.connect(n),f.start(),t.state===`suspended`&&t.resume(),!0}catch{return e=!0,t=null,n=null,!1}},l=(r,i,o)=>{if(c()&&t&&n&&a)try{let e=t.currentTime,s=t.createBufferSource();s.buffer=a;let c=t.createBiquadFilter();c.type=`lowpass`,c.frequency.value=o;let l=t.createGain(),u=Math.min(.6,.06+r*.02);l.gain.setValueAtTime(u,e),l.gain.exponentialRampToValueAtTime(1e-4,e+i),s.connect(c),c.connect(l),l.connect(n),s.start(e),s.stop(e+i),s.onended=()=>{s.disconnect(),c.disconnect(),l.disconnect()}}catch{e=!0}};return typeof window>`u`?Eu:{engineRpm:(n,a)=>{if(a<=.001)t&&i&&i.gain.setTargetAtTime(0,t.currentTime,.05);else if(c()&&t&&r&&i)try{let e=t.currentTime;r.frequency.setTargetAtTime(48+a*190,e,.06),i.gain.setTargetAtTime(.015+a*.05,e,.08)}catch{e=!0}},skid:(n,r)=>{if(c()&&t&&o)try{o.gain.setTargetAtTime(Math.min(.4,.08+r*.3),t.currentTime,.03),s!==null&&clearTimeout(s),s=setTimeout(()=>{s=null,t&&o&&o.gain.setTargetAtTime(0,t.currentTime,.09)},140)}catch{e=!0}},impact:(e,t)=>{l(t,.16,240+t*12)},explosion:e=>{l(30,.7,160)}}}var ku=class{playerId;transform;mode=`foot`;vehicle=null;nearest=null;fleet;hash;tuning;bounds;body={x:0,z:0,vx:0,vz:0,radius:au.radius};solve={hit:!1,contacts:0,impact:0,substeps:0};contact={nx:0,nz:0,depth:0};candidates=[];constructor(e,t,n,r,i,a){this.fleet=e,this.hash=t,this.tuning=n,this.bounds=r,this.playerId=i,this.transform=a}startInVehicle(e){this.mode=`driving`,this.vehicle=e,this.nearest=null,e.driver=this.playerId,this.syncInsideVehicle()}stepFoot(e,t){if(this.mode!==`foot`)return;let n=this.transform;n.prevX=n.x,n.prevZ=n.z,n.prevHeading=n.heading;let r=-t.steer,i=-(t.throttle-t.brake),a=Math.hypot(r,i),o=0,s=0;if(a>1e-4){let e=au.moveSpeed/a;o=r*e,s=i*e}let c=1-Math.exp(-au.accel*e);n.vx+=(o-n.vx)*c,n.vz+=(s-n.vz)*c,Math.abs(n.vx)<.01&&(n.vx=0),Math.abs(n.vz)<.01&&(n.vz=0),a>1e-4&&(n.heading=Math.atan2(o,s));let l=this.body;if(l.x=n.x,l.z=n.z,l.vx=n.vx,l.vz=n.vz,l.radius=au.radius,Gc(this.solve),Kc(l,e,this.hash,this.candidates,this.contact,this.tuning,this.solve),this.bounds){let e=au.radius+au.boundsMargin;l.x=X(l.x,this.bounds.minX+e,this.bounds.maxX-e),l.z=X(l.z,this.bounds.minZ+e,this.bounds.maxZ-e)}n.x=l.x,n.z=l.z,n.vx=l.vx,n.vz=l.vz,this.nearest=yu(this.fleet,n.x,n.z,au.enterRadius)}syncInsideVehicle(){let e=this.vehicle;if(this.mode!==`driving`||!e)return;let t=e.transform,n=this.transform;n.x=t.x,n.z=t.z,n.heading=t.heading,n.vx=t.vx,n.vz=t.vz,n.prevX=t.prevX,n.prevZ=t.prevZ,n.prevHeading=t.prevHeading}enterNearest(){if(this.mode!==`foot`)return!1;let e=yu(this.fleet,this.transform.x,this.transform.z,au.enterRadius);return e?(this.mode=`driving`,this.vehicle=e,this.nearest=null,e.driver=this.playerId,e.forward=0,e.lateral=0,this.transform.vx=0,this.transform.vz=0,this.syncInsideVehicle(),!0):!1}exitVehicle(){let e=this.vehicle;if(this.mode!==`driving`||!e)return!1;let t=e.transform,n=Math.cos(t.heading),r=Math.sin(t.heading),i=e.config.width/2,a=e.config.length/2;for(let o=0;o<ou.length;o+=1){let s=ou[o],c=s[0]*(i+au.exitGap),l=s[1]*(a+au.exitGap),u=t.x+n*c+r*l,d=t.z-r*c+n*l;if(!this.isFootSpotFree(u,d))continue;let f=this.transform;return f.x=u,f.z=d,f.heading=t.heading,f.vx=t.vx*.4,f.vz=t.vz*.4,f.prevX=u,f.prevZ=d,f.prevHeading=f.heading,e.driver=-1,e.steer=0,this.vehicle=null,this.mode=`foot`,this.nearest=yu(this.fleet,u,d,au.enterRadius),!0}return!1}toggleVehicle(){return this.mode===`driving`?this.exitVehicle():this.enterNearest()}teleport(e,t){let n=this.transform;n.x=e,n.z=t,n.vx=0,n.vz=0,n.prevX=e,n.prevZ=t,n.prevHeading=n.heading,this.nearest=yu(this.fleet,e,t,au.enterRadius)}isFootSpotFree(e,t){if(this.bounds){let n=au.radius+au.boundsMargin;if(e<this.bounds.minX+n||e>this.bounds.maxX-n||t<this.bounds.minZ+n||t>this.bounds.maxZ-n)return!1}this.hash.queryCircle(e,t,au.radius+this.tuning.collisionSkin,this.candidates);for(let n=0;n<this.candidates.length;n+=1)if(Vc(e,t,au.radius,this.candidates[n],this.contact))return!1;return!0}};function Au(e,t,n,r,i,a,o,s,c){let l=Math.sin(r),u=Math.cos(r),d=o-t,f=s-n,p=Math.hypot(d,f),m=i*l+a*u;if(e.handbrake=!1,c<=.05||p<.6){e.throttle=0,e.brake=1,e.steer=0;return}let h=zc(Math.atan2(d,f)-r);e.steer=X(h*2.2,-1,1);let g=c;Math.abs(h)>.7&&m>5&&(g=Math.min(g,4.5)),m<g-.4?(e.throttle=X((g-m)*.55,.3,1),e.brake=0):m>g+.8?(e.throttle=0,e.brake=X((m-g)/5,.25,1)):(e.throttle=.25,e.brake=0)}var ju=class{stats={vehicles:0,near:0,stopped:0,avgSpeed:0,spawned:0,despawned:0,updateMs:0,maxUpdateMs:0};registry;fleet;hash;graph;physics;bounds;rng;spawnPoints=[];outgoing=[];agents=[];indexById=new Map;candidates=[];contact={nx:0,nz:0,depth:0};laneScratch={x:0,z:0};spawnTimer=0;tick=0;onHonk=null;constructor(e){this.registry=e.registry,this.fleet=e.fleet,this.hash=e.hash,this.graph=e.graph,this.physics=e.physics,this.bounds=e.bounds,this.rng=ol(e.seed??127999772),this.onHonk=e.onHonk??null,this.buildSpawnPoints(),this.buildOutgoing()}get count(){return this.agents.length}owns(e){return this.indexById.has(e)}get(e){let t=this.indexById.get(e);return t===void 0?null:this.agents[t].vehicle}forget(e){let t=this.indexById.get(e);t!==void 0&&this.removeAgentAt(t)}prefill(e,t,n){let r=Z.spawnMinDistance*.55,i=0;for(let a=0;a<e*12&&i<e&&!(this.agents.length>=Z.maxVehicles);a+=1){let e=this.pickSpawnPoint(t,n,r,Z.spawnMaxDistance);e&&this.spawnAt(e,t,n,r)&&(i+=1)}}update(e,t,n,r,i){let a=performance.now();this.tick+=1,this.spawnTimer+=e;let o=0,s=0,c=0;for(let a=0;a<this.agents.length;a+=1){let l=this.agents[a],u=l.vehicle;if(u.driver>=0){this.removeAgentAt(a),--a;continue}let d=u.transform,f=d.x-n,p=d.z-r,m=Math.hypot(f,p);if(m>Z.despawnDistance){this.despawnAgentAt(a,!1),--a;continue}let h=m<Z.nearDistance;h&&(o+=1);let g=u.wrecked;if(g&&(l.wreckTimer+=e,l.wreckTimer>8&&m>45)){this.despawnAgentAt(a,!0),--a;continue}if(l.pendingDt+=e,!(h||(this.tick+l.phase)%Z.farStride===0))continue;let _=l.pendingDt;if(l.pendingDt=0,_<=0)continue;g?(l.input.throttle=0,l.input.brake=1,l.input.steer=0,l.input.handbrake=!1):this.think(l,t,i,e);let v=Math.hypot(d.vx,d.vz);c+=v,v<.6&&(s+=1),this.physics.step(u,l.input,_),this.followUp(l,e,m)&&--a}this.stats.vehicles=this.agents.length,this.stats.near=o,this.stats.stopped=s,this.stats.avgSpeed=this.agents.length>0?c/this.agents.length:0,this.spawnTimer>=Z.spawnInterval&&(this.spawnTimer=0,this.topUp(n,r,t));let l=performance.now()-a;this.stats.updateMs=l,l>this.stats.maxUpdateMs&&(this.stats.maxUpdateMs=l)}clear(){for(let e=this.agents.length-1;e>=0;--e)this.despawnAgentAt(e,!0);this.indexById.clear()}think(e,t,n,r){let i=e.vehicle,a=i.transform,o=this.graph.edges,s=o[e.edge];if(!s&&(this.reassignEdge(e),s=o[e.edge],!s)){e.targetSpeed=0,Au(e.input,a.x,a.z,a.heading,0,0,a.x,a.z,0);return}let c=this.graph.nodes[s.from],l=(this.graph.nodes[s.to].x-c.x)/(s.length||1),u=(this.graph.nodes[s.to].z-c.z)/(s.length||1),d=(a.x-c.x)*l+(a.z-c.z)*u,f=(a.x-c.x)*u-(a.z-c.z)*l;if(d<-6||d>s.length+6||Math.abs(f)>Z.offLaneLimit){this.reassignEdge(e);return}e.t=X(d/(s.length||1),0,1),e.t>=.985&&(this.chooseNextEdge(e),s=o[e.edge]??s);let p=s.lanes;e.lane>=p&&(e.lane=p-1);let m=X(e.t+Z.laneLookAhead/(s.length||1),0,1),h=this.graph.lanePoint(e.edge,m,e.lane,this.laneScratch),g=h.x+u*e.offset,_=h.z-l*e.offset,v=Math.min(s.speed*Z.speedScale,i.config.maxSpeed*.85)*e.cruise,y=(1-e.t)*s.length;y<Z.lightZone&&!this.lightAllows(e.edge,t)&&e.t<Z.lightStopT?v=Math.min(v,Math.max(0,(y-2.5)*.8)):e.t>Z.lightStopT-.02&&y<8&&!this.lightAllows(e.edge,t)&&(v=0),v>.2&&!this.intersectionClear(e)&&(v=Math.min(v,2));let b=this.scanAhead(e,s.length);if(e.blocked=b<Z.gapSlow,b<Z.gapSlow){let e=X((b-Z.gapStop)/(Z.gapSlow-Z.gapStop),0,1);v=Math.min(v,v*e)}if(b<Z.gapStop?(v=0,e.stuck+=r,e.honkTimer-=r,e.stuck>1.2&&e.honkTimer<=0&&(e.honkTimer=Z.honkInterval,this.onHonk&&this.onHonk(a.x,a.z))):e.stuck=Math.max(0,e.stuck-r*.5),e.stuck>2.4&&v<.5&&(e.offset=e.offset===0?(this.rng()<.5?-1:1)*Z.yieldOffset:e.offset),e.offset!==0&&(e.offset*=Math.exp(-.4*r),Math.abs(e.offset)<.05&&(e.offset=0)),n.wantedLevel>=2){let t=a.x-n.sirenX,r=a.z-n.sirenZ;t*t+r*r<Z.sirenRadius*Z.sirenRadius&&(e.yieldTimer=2.5)}e.yieldTimer>0&&(e.yieldTimer-=r,v=Math.min(v,Math.max(1.2,v*Z.sirenSpeedFactor))),e.targetSpeed=v,e.t>.9&&y<2&&v<.3?(e.input.throttle=0,e.input.brake=1,e.input.steer=0,e.input.handbrake=!1):Au(e.input,a.x,a.z,a.heading,a.vx,a.vz,g,_,v)}followUp(e,t,n){let r=e.vehicle.transform;if(this.bounds&&(r.x=X(r.x,this.bounds.minX+2,this.bounds.maxX-2),r.z=X(r.z,this.bounds.minZ+2,this.bounds.maxZ-2)),e.stuck>12&&n>70){let t=this.indexById.get(e.vehicle.id);return t!==void 0&&this.despawnAgentAt(t,!0),!0}return e.stuck>6&&(e.offset*=Math.exp(-.1*t)),!1}lightAllows(e,t){let n=this.graph.edges[e];if(!n)return!0;let r=this.graph.nodes[n.to];if(!r||!r.lights)return!0;let i=(t/Z.lightCycle%1+(r.lightPhase??0))%1,a=Z.lightGreenShare,o=a+Z.lightYellowShare;return i<a?n.axis===0:i<o?!1:i-o<a&&n.axis===1}intersectionClear(e){let t=this.graph.edges[e.edge];if(!t||e.t<.72)return!0;let n=this.graph.nodes[t.to];if(!n||n.lights)return!0;let r=this.indexById.get(e.vehicle.id)??0;for(let t=0;t<this.agents.length&&!(t>=r);t+=1){let r=this.agents[t];if(r.edge===e.edge)continue;let i=this.graph.edges[r.edge];if(!i||i.to!==n.id&&i.from!==n.id)continue;let a=r.vehicle.transform,o=a.x-n.x,s=a.z-n.z;if(!(o*o+s*s>Z.intersectionRadius*Z.intersectionRadius))return!1}return!0}scanAhead(e,t){let n=e.vehicle,r=n.transform,i=Math.sin(r.heading),a=Math.cos(r.heading),o=Math.min(Z.scanAhead,Math.max(6,t*.5)),s=n.config.width*.5+Z.gapSkin,c=r.x+i*o*.5,l=r.z+a*o*.5,u=Math.abs(i)*o*.5+s,d=Math.abs(a)*o*.5+s;this.hash.queryRect(c,l,u,d,this.candidates);let f=o,p=-n.id-1;for(let e=0;e<this.candidates.length;e+=1){let t=this.candidates[e];if(t.id===p)continue;let o=t.x-r.x,c=t.z-r.z,l=o*i+c*a;if(l<=.4||l>f+2)continue;let u=o*a-c*i,d=Math.max(t.hx,t.hz)*.9;if(Math.abs(u)>s+d)continue;let m=l-d-n.config.length*.5;m<f&&(f=m)}return f<0&&(f=0),f}reassignEdge(e){let t=this.graph.nearestEdge(e.vehicle.transform.x,e.vehicle.transform.z);if(t<0)return;let n=this.graph.edges[t];e.edge=t,e.t=0,e.lane=X(Math.floor(this.rng()*n.lanes),0,n.lanes-1),e.offset=0}chooseNextEdge(e){let t=this.graph.edges[e.edge];if(!t)return;let n=t.to,r=this.outgoing[n];if(!r||r.length===0){for(let n=0;n<this.outgoing[t.from].length;n+=1){let r=this.outgoing[t.from][n];if(r!==e.edge){e.edge=r,e.t=0,e.lane=0;return}}return}let i=-1;for(let e=0;e<r.length;e+=1){let n=this.graph.edges[r[e]];if(n&&n.to!==t.from&&Math.abs(zc(n.heading-t.heading))<.35&&this.rng()<.7){i=r[e];break}}if(i<0)for(let e=0;e<r.length;e+=1){let e=r[Math.floor(this.rng()*r.length)%r.length],n=this.graph.edges[e];if(n&&!(n.to===t.from&&r.length>1)){i=e;break}}if(i<0)return;let a=this.graph.edges[i];e.edge=i,e.t=0,e.lane=X(Math.floor(this.rng()*a.lanes),0,a.lanes-1),e.offset=0}buildSpawnPoints(){let e={x:0,z:0},t=this.graph.edges;for(let n=0;n<t.length;n+=1){let r=t[n];for(let t=0;t<3;t+=1){let i=.25+t*.27;for(let t=0;t<r.lanes;t+=1)this.graph.lanePoint(n,i,t,e),this.spawnPoints.push({x:e.x,z:e.z,heading:r.heading,edge:n,t:i,lane:t})}}}buildOutgoing(){let e=this.graph.nodes.length;for(let t=0;t<e;t+=1)this.outgoing.push([]);for(let e=0;e<this.graph.edges.length;e+=1)this.outgoing[this.graph.edges[e].from].push(e)}topUp(e,t,n){if(this.agents.length>=Z.maxVehicles)return;let r=n<Z.safeTime?Z.spawnMinDistance*1.2:Z.spawnMinDistance,i=0;for(let n=0;n<24&&i<Z.carsPerSpawn&&!(this.agents.length>=Z.maxVehicles);n+=1){let n=this.pickSpawnPoint(e,t,r,Z.spawnMaxDistance);n&&this.spawnAt(n,e,t,r)&&(i+=1)}}pickSpawnPoint(e,t,n,r){let i=this.spawnPoints.length;if(i===0)return null;for(let a=0;a<12;a+=1){let a=this.spawnPoints[Math.floor(this.rng()*i)%i],o=a.x-e,s=a.z-t,c=Math.hypot(o,s);if(!(c<n||c>r))return a}return null}spawnAt(e,t,n,r){let i=e.x-t,a=e.z-n;if(i*i+a*a<r*r)return!1;let o=3.2;this.hash.queryCircle(e.x,e.z,o,this.candidates);for(let t=0;t<this.candidates.length;t+=1)if(Vc(e.x,e.z,o,this.candidates[t],this.contact))return!1;let s=Math.floor(this.rng()*Z.typeWeights.length)%Z.typeWeights.length,c=Z.typeWeights[s],l=du(this.fleet,this.registry,{type:c,x:e.x,z:e.z,heading:e.heading,colorIndex:Math.floor(this.rng()*6)}),u={vehicle:l,edge:e.edge,lane:e.lane,t:e.t,offset:0,targetSpeed:0,cruise:.88+this.rng()*.12,phase:this.tick%Z.farStride,pendingDt:0,honkTimer:0,stuck:0,yieldTimer:0,blocked:!1,wreckTimer:0,input:{throttle:0,brake:0,steer:0,handbrake:!1}};return this.indexById.set(l.id,this.agents.length),this.agents.push(u),this.stats.spawned+=1,!0}removeAgentAt(e){let t=this.agents[e];this.indexById.delete(t.vehicle.id),this.agents.splice(e,1);for(let t=e;t<this.agents.length;t+=1)this.indexById.set(this.agents[t].vehicle.id,t)}despawnAgentAt(e,t){let n=this.agents[e];t&&fu(this.fleet,this.registry,n.vehicle),this.removeAgentAt(e),this.stats.despawned+=1}},Mu=3,Nu=class{pool=new bu(Q.maxPeds);stats={total:0,near:0,nearClose:0,nearest:0,idle:0,walking:0,alert:0,fleeing:0,panic:0,down:0,spawned:0,despawned:0,knocked:0,updateMs:0,maxUpdateMs:0};registry;fleet;hash;blocks;usable=[];spawns=[];bounds;playerId;rng;candidates=[];contact={nx:0,nz:0,depth:0};spawnTimer=0;tick=0;sirenTimer=0;onCrime;constructor(e){this.registry=e.registry,this.fleet=e.fleet,this.hash=e.hash,this.blocks=e.blocks,this.bounds=e.bounds,this.playerId=e.playerId,this.rng=ol(e.seed??5369103),this.onCrime=e.onCrime??null,this.markUsable(e.water??[]),this.buildSpawns()}get count(){return this.pool.size}get(e){return this.pool.get(e)}prefill(e,t,n){let r=0;for(let i=0;i<e*8&&r<e;i+=1){let e=this.pickSpawn(t,n,Q.spawnMinDistance*.7,Q.spawnMaxDistance);e&&this.spawnAt(e)&&(r+=1)}}update(e,t,n,r,i,a,o,s){let c=performance.now();this.tick+=1;let l=0,u=0,d=1/0,f=0,p=0,m=0,h=0,g=0,_=0;for(let t=0;t<this.pool.list.length;t+=1){let s=this.pool.list[t],c=s.transform,v=c.x-n,y=c.z-r,b=Math.hypot(v,y);if(b>Q.despawnDistance){this.despawnAt(t),--t;continue}switch(s.state){case`idle`:f+=1;break;case`walk`:p+=1;break;case`alert`:m+=1;break;case`flee`:h+=1;break;case`panic`:g+=1;break;default:_+=1}let x=b<Q.nearDistance;x&&(l+=1),b<Q.nearRadius&&(u+=1),b<d&&(d=b);let S=x?1:Q.farStride;S>1&&(this.tick+s.variant)%S!==0||this.step(s,e*S,x,o,i,a)}if(this.stats.total=this.pool.size,this.stats.near=l,this.stats.nearClose=u,this.stats.nearest=this.pool.size>0?d:0,this.stats.idle=f,this.stats.walking=p,this.stats.alert=m,this.stats.fleeing=h,this.stats.panic=g,this.stats.down=_,this.spawnTimer+=e,this.spawnTimer>=Q.spawnInterval&&(this.spawnTimer=0,this.topUp(n,r,t)),this.sirenTimer-=e,s&&o>=1&&this.sirenTimer<=0){this.sirenTimer=.5;let e=o>=3?`panic`:`flee`;this.alertAt(i,a,Q.sirenAlertRadius,e)}let v=performance.now()-c;this.stats.updateMs=v,v>this.stats.maxUpdateMs&&(this.stats.maxUpdateMs=v)}alertAt(e,t,n,r){let i=0,a=n*n;for(let n=0;n<this.pool.list.length;n+=1){let o=this.pool.list[n];if(o.state===`down`)continue;let s=o.transform.x-e,c=o.transform.z-t;s*s+c*c>a||(this.applyThreat(o,e,t,r),i+=1)}return i}gunshot(e,t){return this.alertAt(e,t,Q.gunshotPanicRadius,`panic`)+this.alertAt(e,t,Q.gunshotAlertRadius,`flee`)}clear(){for(let e=this.pool.list.length-1;e>=0;--e)this.despawnAt(e)}applyThreat(e,t,n,r){if(e.state===`down`)return;e.threatX=t,e.threatZ=n;let i=e.transform.x-t,a=e.transform.z-n,o=1/Math.max(.001,Math.hypot(i,a));if(r===`panic`)e.state=`panic`,e.timer=Q.panicTime,e.speed=Q.panicSpeed,this.setRouteSingle(e,e.transform.x+i*o*14,e.transform.z+a*o*14);else if(r===`flee`){if(e.state===`panic`)return;e.state=`flee`,e.timer=Q.fleeTime,e.speed=Q.fleeSpeed,this.setRouteSingle(e,e.transform.x+i*o*16,e.transform.z+a*o*16)}else(e.state===`walk`||e.state===`idle`)&&(e.state=`alert`,e.timer=Q.alertTime,e.speed=0)}step(e,t,n,r,i,a){let o=e.transform;if(o.prevX=o.x,o.prevZ=o.z,o.prevHeading=o.heading,e.state===`down`){e.downTimer-=t,e.downTimer<=0&&wu(e);return}if(e.timer-=t,n&&this.checkVehicles(e))return;let s=o.x-i,c=o.z-a;switch(n&&r>=2&&s*s+c*c<Q.sirenAlertRadius*Q.sirenAlertRadius&&(e.state===`walk`||e.state===`idle`)&&this.applyThreat(e,i,a,`flee`),e.state){case`idle`:e.speed=0,e.timer<=0&&(e.state=`walk`,this.buildRoute(e));return;case`alert`:{e.speed=0;let n=Math.atan2(e.threatX-o.x,e.threatZ-o.z);o.heading+=zc(n-o.heading)*Math.min(1,6*t),e.timer<=0&&((o.x-e.threatX)*(o.x-e.threatX)+(o.z-e.threatZ)*(o.z-e.threatZ)<900?(e.state=`flee`,e.timer=Q.fleeTime,e.speed=Q.fleeSpeed,this.setRouteSingle(e,o.x+(o.x-e.threatX),o.z+(o.z-e.threatZ))):(e.state=`walk`,this.buildRoute(e)));return}case`flee`:case`panic`:{let n=e.state===`panic`;if(e.speed=n?Q.panicSpeed:Q.fleeSpeed,e.timer<=0){e.state=`walk`,this.buildRoute(e);return}if(n&&this.rng()<.003*t*60){e.state=`down`,e.downTimer=Q.panicTime*.4,e.speed=0;return}break}default:e.speed=e.baseSpeed}if(e.routeIndex>=e.routeCount){if(e.state===`walk`){if(this.buildRoute(e),e.routeIndex>=e.routeCount)return}else if(e.state=`walk`,e.speed=e.baseSpeed,this.buildRoute(e),e.routeIndex>=e.routeCount)return}let l=e.route[e.routeIndex*2],u=e.route[e.routeIndex*2+1],d=l-o.x,f=u-o.z;if(Math.hypot(d,f)<Q.arriveDistance){e.routeIndex+=1;return}let p=zc(Math.atan2(d,f)-o.heading);o.heading+=X(p,-Q.turnRate*t,Q.turnRate*t);let m=e.speed;if(m<=0)return;let h=Math.sin(o.heading)*m*t,g=Math.cos(o.heading)*m*t;o.x+=h,o.z+=g,o.vx=h/t,o.vz=g/t,n&&this.resolveStatics(e),this.bounds&&(o.x=X(o.x,this.bounds.minX+1,this.bounds.maxX-1),o.z=X(o.z,this.bounds.minZ+1,this.bounds.maxZ-1)),e.phase+=m*t*1.6,e.phase>1&&(e.phase-=Math.floor(e.phase))}checkVehicles(e){let t=e.transform,n=Q.carThreatRadius;this.hash.queryCircle(t.x,t.z,n,this.candidates);for(let n=0;n<this.candidates.length;n+=1){let r=this.candidates[n];if(r.id>=0)continue;let i=-r.id-1,a=this.fleet.get(i);if(!a)continue;let o=Math.hypot(a.transform.vx,a.transform.vz);if(!(o<1.2)&&Vc(t.x,t.z,Q.radius+.5,r,this.contact)){if(o>=Q.carHitSpeed)return e.threatX=a.transform.x,e.threatZ=a.transform.z,e.state!==`down`&&(Cu(e,1),this.stats.knocked+=1,this.alertAt(t.x,t.z,12,`panic`),a.driver===this.playerId&&this.onCrime&&(this.onCrime(`pedHit`,t.x,t.z),this.onCrime(`pedDown`,t.x,t.z)),t.x+=Math.sin(a.transform.heading)*.9,t.z+=Math.cos(a.transform.heading)*.9),!0;(e.state===`walk`||e.state===`idle`)&&this.applyThreat(e,a.transform.x,a.transform.z,`alert`)}}return!1}resolveStatics(e){let t=e.transform;this.hash.queryCircle(t.x,t.z,Q.radius+.05,this.candidates);for(let e=0;e<this.candidates.length;e+=1){let n=this.candidates[e];n.id<0||Vc(t.x,t.z,Q.radius,n,this.contact)&&(t.x+=this.contact.nx*this.contact.depth,t.z+=this.contact.nz*this.contact.depth)}}buildRoute(e){let t=e.blockIndex>=0?e.blockIndex:this.nearestUsableBlock(e.transform.x,e.transform.z);if(e.routeCount=0,e.routeIndex=0,t<0){this.setRouteSingle(e,e.transform.x+6,e.transform.z+6);return}e.blockIndex=t;let n=this.blocks[t],r=Math.max(Mu,n.hx-Q.sidewalkInset),i=Math.max(Mu,n.hz-Q.sidewalkInset),a=[n.x-r,n.x+r,n.x+r,n.x-r],o=[n.z-i,n.z-i,n.z+i,n.z+i],s=0,c=1/0;for(let t=0;t<4;t+=1){let n=a[t]-e.transform.x,r=o[t]-e.transform.z,i=n*n+r*r;i<c&&(c=i,s=t)}let l=this.rng()<.5?1:-1,u=2+Math.floor(this.rng()*2),d=s;for(let t=0;t<u;t+=1)d=(d+l+4)%4,this.pushRoute(e,a[d],o[d]);if(this.rng()<Q.crossingChance&&e.routeCount+2<=Q.routeCapacity){let n=this.findNeighbour(t,l>0?d:s);if(n>=0){let t=e.route[(e.routeCount-1)*2],r=e.route[(e.routeCount-1)*2+1],i=this.blocks[n],a=Math.max(Mu,i.hx-Q.sidewalkInset),o=Math.max(Mu,i.hz-Q.sidewalkInset),s=[i.x-a,i.x+a,i.x+a,i.x-a],c=[i.z-o,i.z-o,i.z+o,i.z+o],u=0,d=1/0;for(let e=0;e<4;e+=1){let n=s[e]-t,i=c[e]-r,a=n*n+i*i;a<d&&(d=a,u=e)}this.pushRoute(e,s[u],c[u]);let f=(u+l+4)%4;this.pushRoute(e,s[f],c[f]),e.blockIndex=n}}}pushRoute(e,t,n){e.routeCount>=Q.routeCapacity||(e.route[e.routeCount*2]=t,e.route[e.routeCount*2+1]=n,e.routeCount+=1)}setRouteSingle(e,t,n){e.routeCount=0,e.routeIndex=0,this.pushRoute(e,t,n)}findNeighbour(e,t){let n=this.blocks[e],r=t<2,i=-1,a=1/0;for(let t=0;t<this.blocks.length;t+=1){if(t===e||!this.usable[t])continue;let o=this.blocks[t];if(r){if(Math.abs(o.x-n.x)>Math.max(n.hx,o.hx)*.7)continue;let e=Math.abs(o.z-n.z)-(n.hz+o.hz);e>Mu&&e<30&&e<a&&(a=e,i=t)}else{if(Math.abs(o.z-n.z)>Math.max(n.hz,o.hz)*.7)continue;let e=Math.abs(o.x-n.x)-(n.hx+o.hx);e>Mu&&e<30&&e<a&&(a=e,i=t)}}return i}nearestUsableBlock(e,t){let n=-1,r=1/0;for(let i=0;i<this.blocks.length;i+=1){if(!this.usable[i])continue;let a=this.blocks[i],o=Math.max(Math.abs(e-a.x)-a.hx,0),s=Math.max(Math.abs(t-a.z)-a.hz,0),c=o*o+s*s;c<r&&(r=c,n=i)}return n}markUsable(e){for(let t=0;t<this.blocks.length;t+=1){let n=this.blocks[t],r=n.hx>6&&n.hz>6;if(r)for(let t=0;t<e.length;t+=1){let i=e[t];if(Math.abs(n.x-i.x)<n.hx+i.hx+2&&Math.abs(n.z-i.z)<n.hz+i.hz+2){r=!1;break}}this.usable.push(r)}}buildSpawns(){for(let e=0;e<this.blocks.length;e+=1){if(!this.usable[e])continue;let t=this.blocks[e],n=Math.max(Mu,t.hx-Q.sidewalkInset),r=Math.max(Mu,t.hz-Q.sidewalkInset);for(let i=0;i<4;i+=1)for(let a=0;a<3;a+=1){let o=(a-1)*.55,s,c,l;i===0?(s=t.x+o*n,c=t.z-r,l=Math.PI/2):i===1?(s=t.x+o*n,c=t.z+r,l=-Math.PI/2):i===2?(s=t.x-n,c=t.z+o*r,l=0):(s=t.x+n,c=t.z+o*r,l=Math.PI),this.spawns.push({x:s,z:c,heading:l,block:e})}}}pickSpawn(e,t,n,r){let i=this.spawns.length;if(i===0)return null;for(let a=0;a<14;a+=1){let a=this.spawns[Math.floor(this.rng()*i)%i],o=a.x-e,s=a.z-t,c=Math.hypot(o,s);if(!(c<n||c>r))return a}return null}spawnAt(e){if(this.pool.size>=Q.maxPeds)return!1;this.hash.queryCircle(e.x,e.z,.6,this.candidates);for(let t=0;t<this.candidates.length;t+=1)if(Vc(e.x,e.z,.5,this.candidates[t],this.contact))return!1;let t=xu(this.pool,this.registry,{kind:`ped`,x:e.x,z:e.z,heading:e.heading,variant:Math.floor(this.rng()*7)});return t?(t.blockIndex=e.block,t.state=this.rng()<Q.idleChance?`idle`:`walk`,t.timer=t.state===`idle`?Q.idleMin+this.rng()*(Q.idleMax-Q.idleMin):0,this.buildRoute(t),this.stats.spawned+=1,!0):!1}topUp(e,t,n){if(this.pool.size>=Q.maxPeds)return;let r=n<Q.safeTime,i=!r&&this.stats.nearClose<Q.nearTarget,a=r?Q.spawnMinDistance*1.3:i?Q.closeSpawnDistance:Q.spawnMinDistance,o=Q.spawnMaxDistance,s=0;for(let n=0;n<18&&s<Q.pedsPerSpawn&&!(this.pool.size>=Q.maxPeds);n+=1){let n=this.pickSpawn(e,t,a,o);n&&this.spawnAt(n)&&(s+=1)}}despawnAt(e){let t=this.pool.list[e];Su(this.pool,this.registry,t),this.stats.despawned+=1}},Pu=cu.length;function Fu(e,t,n,r,i,a){let o=i.angle??0,s=Math.cos(o),c=Math.sin(o),l=e-i.x,u=t-i.z,d=l*s-u*c,f=l*c+u*s,p=n*s-r*c,m=n*c+r*s,h=0,g=a;if(Math.abs(p)<1e-8){if(Math.abs(d)>i.hx)return-1}else{let e=1/p,t=(-i.hx-d)*e,n=(i.hx-d)*e;if(t>n){let e=t;t=n,n=e}if(t>h&&(h=t),n<g&&(g=n),h>g)return-1}if(Math.abs(m)<1e-8){if(Math.abs(f)>i.hz)return-1}else{let e=1/m,t=(-i.hz-f)*e,n=(i.hz-f)*e;if(t>n){let e=t;t=n,n=e}if(t>h&&(h=t),n<g&&(g=n),h>g)return-1}return h}function Iu(e,t,n,r,i,a,o,s){let c=i-e,l=a-t,u=c*n+l*r;if(u<0||u>s)return-1;let d=Math.abs(c*r-l*n);if(d>o)return-1;let f=Math.sqrt(Math.max(0,o*o-d*d));return Math.max(0,u-f)}var Lu=class{weapon=`pistol`;recoil=0;hash;fleet;pools;playerId;rng;candidates=[];mags=new Int32Array(Pu);reserves=new Int32Array(Pu);cooldown=0;reloadTimer=0;reloading=!1;heat=0;onShot=null;onImpact=null;onCrime=null;onGunshot=null;constructor(e){this.hash=e.hash,this.fleet=e.fleet,this.pools=e.pools,this.playerId=e.playerId,this.rng=ol(e.seed??12648430);for(let e=0;e<Pu;e+=1){let t=su[cu[e]];this.mags[e]=t.mag,this.reserves[e]=t.reserve}}get weaponSpec(){return su[this.weapon]}get magAmmo(){return this.mags[this.weaponIndex(this.weapon)]}get reserveAmmo(){return this.reserves[this.weaponIndex(this.weapon)]}get isReloading(){return this.reloading}selectWeapon(e){return!lu(e)||e===this.weapon?!1:(this.weapon=e,this.reloading=!1,this.reloadTimer=0,this.cooldown=0,!0)}reload(){let e=this.weaponIndex(this.weapon),t=su[this.weapon];return this.reloading||this.mags[e]>=t.mag||this.reserves[e]<=0?!1:(this.reloading=!0,this.reloadTimer=t.reload,!0)}update(e){if(this.cooldown>0&&(this.cooldown=Math.max(0,this.cooldown-e)),this.recoil>0&&(this.recoil=Math.max(0,this.recoil-e*3)),this.heat>0&&(this.heat=Math.max(0,this.heat-e*.12)),!this.reloading||(this.reloadTimer-=e,this.reloadTimer>0))return;this.reloading=!1;let t=this.weaponIndex(this.weapon),n=su[this.weapon].mag-this.mags[t],r=Math.min(n,this.reserves[t]);this.mags[t]+=r,this.reserves[t]-=r}refill(){for(let e=0;e<Pu;e+=1){let t=su[cu[e]];this.mags[e]=t.mag,this.reserves[e]=t.reserve}}tryFire(e,t,n,r,i=-1){let a=this.weaponIndex(this.weapon),o=su[this.weapon];if(this.reloading||this.cooldown>0)return!1;if(this.mags[a]<=0)return this.reload(),!1;--this.mags[a],this.cooldown=1/o.rate,this.heat=Math.min(.12,this.heat+o.spread*.5),this.recoil=Math.min(1,this.recoil+o.recoil);let s=Math.atan2(n,r),c=o.spread+this.heat;for(let n=0;n<o.pellets;n+=1){let n=s+(this.rng()*2-1)*c,r=this.shoot(e,t,Math.sin(n),Math.cos(n),o.range,o.damage,!0,null,i);this.onShot&&this.onShot(e,t,r.x,r.z,r.hit)}return this.onCrime&&this.onCrime(`shot`,e,t),this.onGunshot&&this.onGunshot(e,t),!0}fireAt(e,t,n,r,i,a,o,s,c=-1){let l=su[i],u=Math.atan2(n-e,r-t),d=(1-X(a,0,1))*.22,f=u+(this.rng()*2-1)*d,p=this.shoot(e,t,Math.sin(f),Math.cos(f),l.range,l.damage*o,!1,s,c);return this.onShot&&this.onShot(e,t,p.x,p.z,p.hit),p}probe(e,t,n,r,i,a){return this.shoot(e,t,n,r,i,a,!1,null)}weaponIndex(e){for(let t=0;t<Pu;t+=1)if(cu[t]===e)return t;return 0}shoot(e,t,n,r,i,a,o,s,c=-1){let l={hit:`none`,x:e+n*i,z:t+r*i,distance:i,targetHit:!1},u=e+n*i*.5,d=t+r*i*.5,f=Math.abs(n)*i*.5+.5,p=Math.abs(r)*i*.5+.5;this.hash.queryRect(u,d,f,p,this.candidates);let m=i,h=null;for(let i=0;i<this.candidates.length;i+=1){let a=this.candidates[i];if(c>=0&&a.id===-c-1)continue;let o=Fu(e,t,n,r,a,m);o<0||o>=m||(m=o,h=a)}let g=null;for(let i=0;i<this.pools.length;i+=1){let a=this.pools[i].list;for(let i=0;i<a.length;i+=1){let o=a[i];if(o.state===`down`)continue;let s=Iu(e,t,n,r,o.transform.x,o.transform.z,.45,m);s<0||s>=m||(m=s,g=o,h=null)}}if(g){l.hit=`npc`,l.distance=m,l.x=e+n*m,l.z=t+r*m;let i=Cu(g,a);if(o&&this.onCrime){let e=g.kind===`cop`?`copShot`:i?`pedDown`:`pedHit`;this.onCrime(e,g.transform.x,g.transform.z)}this.onImpact&&this.onImpact(l.x,l.z,`npc`)}else if(h){if(l.distance=m,l.x=e+n*m,l.z=t+r*m,h.id<0){let e=-h.id-1,t=this.fleet.get(e);l.hit=t?`vehicle`:`world`,t&&(mu(t,a),o&&this.onCrime&&this.onCrime(`vehicleShot`,l.x,l.z))}else l.hit=`world`;this.onImpact&&this.onImpact(l.x,l.z,l.hit)}if(s){let a=Iu(e,t,n,r,s.x,s.z,s.radius,i);a>=0&&a<=m+.05&&(l.targetHit=!0,l.distance=Math.min(l.distance,a))}return l}get shooterId(){return this.playerId}},Ru=class{stats={heat:0,level:0,cars:0,foot:0,health:$.playerHealth,seen:0,unseen:0,crimes:0,spawned:0,despawned:0,arrests:0,copShots:0,copHits:0,nearestCar:0,nearestFoot:0,updateMs:0,maxUpdateMs:0};onPlayerCaught=null;onLevelChanged=null;registry;fleet;hash;graph;physics;combat;pool;rng;candidates=[];laneScratch={x:0,z:0};cops=[];copIndex=new Map;heatPoints=0;levelValue=0;crimeTimer=0;unseenTimer=0;seenNow=!1;spawnTimer=0;footTimer=0;healthValue=$.playerHealth;damageTimer=0;caught=!1;sirenX=0;sirenZ=0;sirenActive=!1;lastPlayerX=0;lastPlayerZ=0;tick=0;constructor(e){this.registry=e.registry,this.fleet=e.fleet,this.hash=e.hash,this.graph=e.graph,this.physics=e.physics,this.combat=e.combat,this.pool=e.npcPool,this.rng=ol(e.seed??10121667)}get heat(){return this.heatPoints}get level(){return this.levelValue}get health(){return this.healthValue}get sirenNear(){return this.sirenActive}get sirenPositionX(){return this.sirenX}get sirenPositionZ(){return this.sirenZ}owns(e){let t=this.copIndex.get(e);return t!==void 0&&this.cops[t].vehicle.driver<0}releaseVehicle(e){let t=this.copIndex.get(e);if(t!==void 0){this.copIndex.delete(e),this.cops.splice(t,1);for(let e=t;e<this.cops.length;e+=1)this.copIndex.set(this.cops[e].vehicle.id,e)}}get(e){return this.pool.get(e)??null}addCrime(e,t,n){let r=$.crimes[e];r>0&&(this.heatPoints=Math.min(100,this.heatPoints+r),this.crimeTimer=0,this.unseenTimer=0,this.stats.crimes+=1,this.refreshLevel(`crime`))}setLevel(e){let t=X(Math.round(e),0,5);if(t===0)this.heatPoints=0;else{let e=$.thresholds[t-1];this.heatPoints=Math.max(this.heatPoints,e+1),this.levelValue>t&&(this.heatPoints=e+1)}this.crimeTimer=0,this.unseenTimer=0,this.refreshLevel(`crime`)}reset(){this.heatPoints=0,this.levelValue=0,this.crimeTimer=0,this.unseenTimer=0,this.healthValue=$.playerHealth,this.damageTimer=0,this.caught=!1,this.stats.level=0,this.stats.heat=0,this.stats.health=this.healthValue}update(e,t){let n=performance.now();if(this.tick+=1,this.lastPlayerX=t.x,this.lastPlayerZ=t.z,this.crimeTimer+=e,this.damageTimer+=e,this.seenNow=this.isPlayerSeen(t.x,t.z),this.stats.seen=+!!this.seenNow,this.seenNow?this.unseenTimer=0:this.unseenTimer+=e,this.stats.unseen=this.unseenTimer,this.crimeTimer>$.crimePause&&!this.seenNow){let t=this.unseenTimer>$.coverDelay,n=t?$.coverRate:$.coolRate;this.heatPoints>0&&(this.heatPoints=Math.max(0,this.heatPoints-n*e),this.refreshLevel(t?`reset`:`evade`))}this.damageTimer>$.healthRegenDelay&&this.healthValue<$.playerHealth&&(this.healthValue=Math.min($.playerHealth,this.healthValue+$.healthRegen*e),this.stats.health=this.healthValue),this.updateCops(e,t),this.updateFootCops(e,t),this.updateArrest(t),this.stats.heat=this.heatPoints,this.stats.level=this.levelValue,this.stats.cars=this.cops.length,this.stats.foot=this.countFootCops(),this.stats.health=this.healthValue;let r=performance.now()-n;this.stats.updateMs=r,r>this.stats.maxUpdateMs&&(this.stats.maxUpdateMs=r)}spawnCop(e,t){let n=this.pickSpawnPoint(e??this.lastPlayerX,t??this.lastPlayerZ,0,30,90,`chase`);return n&&(this.spawnCopCar(n.x,n.z,n.heading,`chase`),this.stats.cars=this.cops.length),this.cops.length}clear(){for(let e=this.cops.length-1;e>=0;--e)this.removeCopAt(e,!0);for(let e=this.pool.list.length-1;e>=0;--e){let t=this.pool.list[e];this.pool.remove(t.id),this.registry.destroy(t.id)}this.copIndex.clear()}refreshLevel(e){let t=0;for(let e=0;e<$.thresholds.length;e+=1)this.heatPoints>=$.thresholds[e]&&(t=e+1);t!==this.levelValue&&(this.levelValue=t,this.onLevelChanged&&this.onLevelChanged(t,e))}isPlayerSeen(e,t){let n=$.seenRadius*$.seenRadius,r=0,i=!1;for(let a=0;a<this.cops.length;a+=1){let o=this.cops[a].vehicle.transform,s=o.x-e,c=o.z-t,l=s*s+c*c;(r===0||l<r)&&(r=l),l<n&&(i=!0)}let a=this.pool.list;for(let o=0;o<a.length;o+=1){let s=a[o].transform.x-e,c=a[o].transform.z-t,l=s*s+c*c;(r===0||l<r)&&(r=l),l<n&&(i=!0)}return this.stats.nearestCar=r>0?Math.sqrt(r):0,this.stats.nearestFoot=this.stats.nearestCar,i}hasLineOfSight(e,t,n,r){let i=n-e,a=r-t,o=Math.hypot(i,a);if(o<.001)return!0;let s=i/o,c=a/o;this.hash.queryCircle((e+n)/2,(t+r)/2,o/2+1,this.candidates);for(let n=0;n<this.candidates.length;n+=1){let r=this.candidates[n];if(r.id<0)continue;let i=Fu(e,t,s,c,r,o);if(i>=0&&i<o-.5)return!1}return!0}updateCops(e,t){let n=this.levelValue>0?$.carsPerLevel[this.levelValue]:0,r=Math.min($.maxCops,n);this.spawnTimer+=e,this.spawnTimer>=$.spawnInterval&&(this.spawnTimer=0,this.cops.length<r?this.spawnWave(t,r):this.cops.length>r&&this.releaseExtra(t));let i=-1,a=1/0;for(let n=0;n<this.cops.length;n+=1){let r=this.cops[n];if(r.life+=e,r.vehicle.driver>=0)continue;let o=r.vehicle.transform,s=Math.hypot(o.x-t.x,o.z-t.z);if(s>$.despawnDistance)this.removeCopAt(n,!0),--n;else if(this.levelValue===0&&r.life>2)this.removeCopAt(n,!0),--n;else{if(s<a&&(a=s,i=n),s>65&&r.life>2){let e=this.pickSpawnPoint(t.x,t.z,t.heading,28,45,`chase`);if(e){o.x=e.x,o.z=e.z,o.heading=e.heading,o.prevX=e.x,o.prevZ=e.z,o.prevHeading=e.heading,o.vx=0,o.vz=0;let t=this.graph.nearestEdge(e.x,e.z);r.edge=t<0?r.edge:t,r.life=0,r.fireTimer=.6}}if(this.driveCop(r,e,t,s),this.checkCopImpact(r,t),s<$.copFireRange&&this.hasLineOfSight(o.x,o.z,t.x,t.z)){if(r.fireTimer-=e,r.fireTimer<=0){r.fireTimer=$.copFireInterval*(.8+this.rng()*.6);let e=o.heading,n=o.x+Math.sin(e)*2.2,i=o.z+Math.cos(e)*2.2;this.combat.fireAt(n,i,t.x,t.z,$.copWeapon,$.copAccuracy*.85,$.copDamageScale,{x:t.x,z:t.z,radius:.5},r.vehicle.id),this.stats.copShots+=1;let a=$.copAccuracy*X(1-s/120,.25,1);if(this.rng()<a){this.stats.copHits+=1;let e=su[$.copWeapon].damage;t.vehicle?mu(t.vehicle,e):this.applyPlayerDamage(e)}}}else r.fireTimer<.5&&(r.fireTimer=.5)}}i>=0&&a<130&&this.levelValue>0?(this.sirenActive=!0,this.sirenX=this.cops[i].vehicle.transform.x,this.sirenZ=this.cops[i].vehicle.transform.z):this.sirenActive=!1}spawnWave(e,t){if(t-this.cops.length<=0)return;let n=this.levelValue;if(n>=$.roadblockLevel&&this.countMode(`block`)===0){let n=this.pickSpawnPoint(e.x,e.z,e.heading,$.carSpawnMinDistance,$.carSpawnMaxDistance,`block`);if(n){let e=Math.cos(n.heading)*1.9,r=-Math.sin(n.heading)*1.9;this.spawnCopCar(n.x+e,n.z+r,n.heading,`block`),this.cops.length<t&&this.spawnCopCar(n.x-e,n.z-r,n.heading,`block`);return}}let r=n>=$.interceptLevel?`intercept`:`chase`,i=this.pickSpawnPoint(e.x,e.z,e.heading,$.carSpawnMinDistance,$.carSpawnMaxDistance,r);i&&this.spawnCopCar(i.x,i.z,i.heading,`chase`)}countMode(e){let t=0;for(let n=0;n<this.cops.length;n+=1)this.cops[n].mode===e&&(t+=1);return t}releaseExtra(e){let t=Math.min($.maxCops,$.carsPerLevel[this.levelValue]??0);for(;this.cops.length>t;){let t=-1,n=-1;for(let r=0;r<this.cops.length;r+=1){if(this.cops[r].life<2)continue;let i=this.cops[r].vehicle.transform,a=Math.hypot(i.x-e.x,i.z-e.z);a>n&&(n=a,t=r)}if(t<0)break;this.removeCopAt(t,!0)}}pickSpawnPoint(e,t,n,r,i,a){let o=this.graph.nodes,s=Math.sin(n),c=Math.cos(n),l=-1,u=-1/0;for(let n=0;n<26;n+=1){let n=Math.floor(this.rng()*o.length)%o.length,d=o[n],f=d.x-e,p=d.z-t,m=Math.hypot(f,p);if(m<r||m>i)continue;let h=f*s+p*c,g=a===`chase`?-Math.abs(m-(r+i)*.5):h;g>u&&(u=g,l=n)}if(l<0)return null;let d=o[l],f=a===`block`?n+Math.PI/2:Math.atan2(e-d.x,t-d.z),p=a===`block`?0:6,m=d.x+Math.sin(f)*p,h=d.z+Math.cos(f)*p;return this.isBlocked(m,h,2.6)?null:{x:m,z:h,heading:f}}isBlocked(e,t,n){this.hash.queryCircle(e,t,n+.2,this.candidates);for(let r=0;r<this.candidates.length;r+=1){let i=this.candidates[r];if(i.id<0)continue;let a=i.x-e,o=i.z-t;if(Math.abs(a)<i.hx+n&&Math.abs(o)<i.hz+n)return!0}return!1}spawnCopCar(e,t,n,r){let i=du(this.fleet,this.registry,{type:`police`,x:e,z:t,heading:n,colorIndex:0}),a=this.graph.nearestEdge(e,t),o={vehicle:i,mode:r,edge:a<0?0:a,t:0,life:0,pitTimer:0,stuck:0,fireTimer:.8+this.rng()*.8,input:{throttle:0,brake:0,steer:0,handbrake:!1}};this.copIndex.set(i.id,this.cops.length),this.cops.push(o),this.stats.spawned+=1}driveCop(e,t,n,r){let i=e.vehicle,a=i.transform,o=n.x-a.x,s=n.z-a.z;if(e.mode===`block`){if(r>26){e.input.throttle=0,e.input.brake=1,e.input.steer=0,e.input.handbrake=!1,this.physics.step(i,e.input,t);return}e.mode=`chase`}let c=this.graph.edges,l=c[e.edge];if(!l){let t=this.graph.nearestEdge(a.x,a.z);if(e.edge=t<0?0:t,l=c[e.edge],!l)return}let u=this.graph.nodes[l.from],d=l.length>1e-6?1/l.length:0,f=(this.graph.nodes[l.to].x-u.x)*d,p=(this.graph.nodes[l.to].z-u.z)*d,m=(a.x-u.x)*f+(a.z-u.z)*p;e.t=X(m*d,0,1),m>l.length-4&&(this.chooseEdgeTowards(e,n),l=c[e.edge]??l);let h=Math.abs(zc(Math.atan2(o,s)-a.heading)),g=r<30&&(h<.75||r<12),_,v,y;if(g){let o=n.vehicle;if(o!==null&&this.levelValue>=$.aggressiveLevel&&r<$.pitRange&&r>2.5){let n=o.transform,r=Math.sin(n.heading),s=Math.cos(n.heading),c=a.x-n.x,l=a.z-n.z,u=c*s-l*r>=0?1:-1,d=o.config.length*.5+.8;_=n.x-r*d+s*u*1.4,v=n.z-s*d-r*u*1.4,y=i.config.maxSpeed,e.pitTimer+=t}else _=n.x,v=n.z,y=r<$.ramRange?i.config.maxSpeed:i.config.maxSpeed*.9}else{let t=X(e.t+16*d,0,1),n=this.graph.lanePoint(e.edge,t,0,this.laneScratch);_=n.x,v=n.z,y=Math.min(l.speed*1.08,i.config.maxSpeed),h>.9&&(y*=.55)}Au(e.input,a.x,a.z,a.heading,a.vx,a.vz,_,v,y*(this.levelValue>=$.aggressiveLevel?$.chaseSpeedFactor:1)),Math.hypot(a.vx,a.vz)<.5?e.stuck+=t:e.stuck=0,e.stuck>2.5&&(e.input.throttle=0,e.input.brake=1,e.stuck>3.5&&(e.stuck=0,e.edge=this.graph.nearestEdge(a.x,a.z))),this.physics.step(i,e.input,t)}chooseEdgeTowards(e,t){let n=this.graph.edges,r=n[e.edge];if(!r)return;let i=this.graph.nodes[r.to],a=-1,o=1/0;for(let e=0;e<n.length;e+=1){let s=n[e];if(s.from!==i.id||s.to===r.from&&n.length>1)continue;let c=this.graph.nodes[s.to],l=c.x-t.x,u=c.z-t.z,d=l*l+u*u;d<o&&(o=d,a=e)}if(a>=0)e.edge=a,e.t=0;else for(let t=0;t<n.length;t+=1)if(n[t].from===r.to){e.edge=t,e.t=0;return}}checkCopImpact(e,t){let n=t.vehicle;if(!n||e.vehicle.lastImpact<3)return;let r=e.vehicle.transform.x-t.x,i=e.vehicle.transform.z-t.z,a=r*r+i*i;if(a>25)return;let o=Math.sqrt(a)||1,s=n.transform.vx,c=n.transform.vz;(s*r+c*i)/o<6||(this.addCrime(`ramCop`,t.x,t.z),mu(n,4),e.vehicle.lastImpact=0)}countFootCops(){let e=0,t=this.pool.list;for(let n=0;n<t.length;n+=1)t[n].kind===`cop`&&(e+=1);return e}updateFootCops(e,t){let n=this.levelValue>0?$.footPerLevel[this.levelValue]:0;this.footTimer+=e,this.footTimer>=1&&this.countFootCops()<n&&(this.footTimer=0,this.spawnFootCop(t));for(let n=this.pool.list.length-1;n>=0;--n){if(n>=this.pool.list.length)continue;let r=this.pool.list[n];r.kind===`cop`&&(this.stepFootCop(r,e,t)||(this.pool.remove(r.id),this.registry.destroy(r.id),this.stats.despawned+=1))}}stepFootCop(e,t,n){let r=e.transform;if(r.prevX=r.x,r.prevZ=r.z,r.prevHeading=r.heading,e.state===`down`)return e.downTimer-=t,e.downTimer<=0&&(e.hp=1,e.state=`chase`,e.downTimer=0),!0;let i=n.x-r.x,a=n.z-r.z,o=Math.hypot(i,a);if(e.lifeTimer+=t,o>60&&e.lifeTimer>2&&this.levelValue>0){let t=this.rng()*Math.PI*2,i=26+this.rng()*10,a=n.x+Math.sin(t)*i,o=n.z+Math.cos(t)*i;this.isBlocked(a,o,.6)||(r.x=a,r.z=o,r.prevX=a,r.prevZ=o,r.heading=Math.atan2(n.x-a,n.z-o),r.prevHeading=r.heading,e.lifeTimer=0)}if(this.levelValue===0||o>120&&e.lifeTimer>$.footLifetime)return!1;e.attackTimer-=t;let s=o<$.copFireRange;e.aiming=s,e.state=s?`aim`:`chase`;let c=0;if((!s||o>16)&&(c=Q.copSpeed),c>0){let n=zc(Math.atan2(i,a)-r.heading);r.heading+=X(n,-Q.turnRate*t,Q.turnRate*t);let o=Math.sin(r.heading)*c*t,s=Math.cos(r.heading)*c*t;r.x+=o,r.z+=s,this.hash.queryCircle(r.x,r.z,.6,this.candidates);for(let e=0;e<this.candidates.length;e+=1){let t=this.candidates[e];if(t.id<0||Math.abs(r.x-t.x)>t.hx+.5||Math.abs(r.z-t.z)>t.hz+.5)continue;let n=r.x-t.x,i=r.z-t.z,a=Math.hypot(n,i)||1;r.x+=n/a*.6,r.z+=i/a*.6}e.phase+=c*t*1.5,e.phase>1&&(e.phase-=Math.floor(e.phase))}if(s&&e.attackTimer<=0){e.attackTimer=$.copFireInterval,this.combat.fireAt(r.x,r.z,n.x,n.z,$.copWeapon,$.copAccuracy,$.copDamageScale,{x:n.x,z:n.z,radius:.5}),this.stats.copShots+=1;let t=$.copAccuracy*X(1-o/120,.25,1);if(this.rng()<t){this.stats.copHits+=1;let e=su[$.copWeapon].damage;n.vehicle?mu(n.vehicle,e):this.applyPlayerDamage(e)}}return!0}spawnFootCop(e){let t=this.graph.nodes[Math.floor(this.rng()*this.graph.nodes.length)%this.graph.nodes.length],n=this.rng()*Math.PI*2,r=$.footSpawnMinDistance+this.rng()*($.footSpawnMaxDistance-$.footSpawnMinDistance),i=e.x+Math.sin(n)*r,a=e.z+Math.cos(n)*r,o=t.x+(i-t.x)*.15,s=t.z+(a-t.z)*.15,c=i*.7+o*.3,l=a*.7+s*.3;if(this.isBlocked(c,l,.6))return!1;let u=xu(this.pool,this.registry,{kind:`cop`,x:c,z:l,heading:Math.atan2(e.x-c,e.z-l),variant:0});return u?(u.state=`chase`,u.baseSpeed=Q.copSpeed,u.hp=2,u.attackTimer=.6+this.rng()*.8,this.stats.spawned+=1,!0):!1}updateArrest(e){if(!e.onFoot||this.levelValue===0||this.caught||Math.hypot(e.vx,e.vz)>$.arrestSpeed)return;let t=this.pool.list,n=$.arrestRadius*$.arrestRadius;for(let r=0;r<t.length;r+=1){let i=t[r];if(i.kind!==`cop`||i.state===`down`)continue;let a=i.transform.x-e.x,o=i.transform.z-e.z;if(!(a*a+o*o>n)){this.arrest(`arrest`,e.x,e.z);return}}}arrest(e,t,n){this.caught||(this.caught=!0,this.stats.arrests+=1,this.onPlayerCaught&&this.onPlayerCaught(e,t,n))}applyPlayerDamage(e){this.caught||e<=0||(this.healthValue=Math.max(0,this.healthValue-e),this.damageTimer=0,this.stats.health=this.healthValue,this.healthValue<=0&&this.arrest(`down`,this.lastPlayerX,this.lastPlayerZ))}removeCopAt(e,t){let n=this.cops[e];this.copIndex.delete(n.vehicle.id),t&&fu(this.fleet,this.registry,n.vehicle),this.cops.splice(e,1);for(let t=e;t<this.cops.length;t+=1)this.copIndex.set(this.cops[t].vehicle.id,t);this.stats.despawned+=1}get ticks(){return this.tick}},zu={version:1,id:`city`,name:`Port Alba`,seed:20261124,size:1200,chunkSize:128,laneWidth:3.4,districts:[{id:`center`,name:`Downtown`,bounds:{x:-120,z:-50,hx:480,hz:550}},{id:`industrial`,name:`Industrial`,bounds:{x:-100,z:400,hx:496,hz:196}},{id:`waterfront`,name:`Waterfront`,bounds:{x:350,z:0,hx:250,hz:600}}],water:[{x:465,z:0,hx:75,hz:600}],roads:[{id:`ring`,kind:`ring`,points:[[-500,-500],[360,-500],[360,500],[-500,500],[-500,-500]],width:18,speed:16,arterial:!0},{id:`arterial_ns`,kind:`arterial`,points:[[0,-500],[0,500]],width:20,speed:18,arterial:!0},{id:`arterial_ew`,kind:`arterial`,points:[[-500,0],[360,0]],width:20,speed:18,arterial:!0},{id:`bridge`,kind:`bridge`,points:[[360,0],[596,0]],width:16,speed:12,arterial:!0},{id:`boulevard`,kind:`boulevard`,points:[[-500,-500],[300,300]],width:18,speed:15,arterial:!0},{id:`street_xm400`,kind:`street`,points:[[-400,-500],[-400,500]],width:12,speed:11,arterial:!1},{id:`street_xm300`,kind:`street`,points:[[-300,-500],[-300,500]],width:12,speed:11,arterial:!1},{id:`street_xm200`,kind:`street`,points:[[-200,-500],[-200,500]],width:12,speed:11,arterial:!1},{id:`street_xm100`,kind:`street`,points:[[-100,-500],[-100,500]],width:12,speed:11,arterial:!1},{id:`street_xp100`,kind:`street`,points:[[100,-500],[100,500]],width:12,speed:11,arterial:!1,oneWay:!0},{id:`street_xp200`,kind:`street`,points:[[200,500],[200,-500]],width:12,speed:11,arterial:!1,oneWay:!0},{id:`street_xp300`,kind:`street`,points:[[300,-500],[300,500]],width:12,speed:11,arterial:!1},{id:`street_zm400`,kind:`street`,points:[[-500,-400],[360,-400]],width:12,speed:11,arterial:!1},{id:`street_zm300`,kind:`street`,points:[[-500,-300],[360,-300]],width:12,speed:11,arterial:!1},{id:`street_zm200`,kind:`street`,points:[[-500,-200],[360,-200]],width:12,speed:11,arterial:!1},{id:`street_zm100`,kind:`street`,points:[[-500,-100],[360,-100]],width:12,speed:11,arterial:!1},{id:`street_zp100`,kind:`street`,points:[[-500,100],[360,100]],width:12,speed:11,arterial:!1},{id:`street_zp200`,kind:`street`,points:[[-500,200],[360,200]],width:12,speed:11,arterial:!1},{id:`street_zp300`,kind:`street`,points:[[-500,300],[360,300]],width:12,speed:11,arterial:!1},{id:`street_zp400`,kind:`street`,points:[[-500,400],[360,400]],width:12,speed:11,arterial:!1}],prefabs:[{id:`downtown_A`,buildings:[{x:-.44,z:-.44,w:.4,d:.4,h:26,color:`#8b93a1`,roof:`#5d6570`},{x:.44,z:-.44,w:.4,d:.4,h:20,color:`#9c8f80`,roof:`#6b6155`},{x:-.44,z:.44,w:.4,d:.4,h:17,color:`#7d8e9f`,roof:`#545e6b`},{x:.44,z:.44,w:.4,d:.4,h:31,color:`#a39887`,roof:`#6e6559`}],props:[{kind:`lamp`,x:0,z:-.9,heading:3.1416},{kind:`lamp`,x:0,z:.9,heading:0},{kind:`lamp`,x:-.9,z:0,heading:1.5708},{kind:`lamp`,x:.9,z:0,heading:-1.5708},{kind:`bin`,x:.82,z:.82,heading:0},{kind:`hydrant`,x:-.82,z:.82,heading:.7854}]},{id:`downtown_B`,buildings:[{x:-.6,z:-.42,w:.28,d:.36,h:13,color:`#9c8f80`,roof:`#6b6155`},{x:0,z:-.42,w:.28,d:.36,h:22,color:`#6f7b88`,roof:`#5d6570`},{x:.6,z:-.42,w:.28,d:.36,h:16,color:`#9aa4b2`,roof:`#545e6b`},{x:-.6,z:.44,w:.28,d:.36,h:11,color:`#7d8e9f`,roof:`#5d6570`},{x:.6,z:.44,w:.28,d:.36,h:14,color:`#8b93a1`,roof:`#6e6559`}],props:[{kind:`lamp`,x:0,z:-.9,heading:3.1416},{kind:`lamp`,x:0,z:.9,heading:0},{kind:`lamp`,x:-.9,z:.5,heading:1.5708},{kind:`lamp`,x:.9,z:-.5,heading:-1.5708},{kind:`tree`,x:.02,z:.02,heading:.4},{kind:`bench`,x:0,z:.9,heading:0},{kind:`bin`,x:-.3,z:.9,heading:0}]},{id:`downtown_C`,buildings:[{x:0,z:-.18,w:.5,d:.42,h:44,color:`#8b93a1`,roof:`#5d6570`},{x:-.58,z:.62,w:.26,d:.24,h:10,color:`#9c8f80`,roof:`#6b6155`},{x:.58,z:.62,w:.26,d:.24,h:12,color:`#9aa4b2`,roof:`#545e6b`}],props:[{kind:`lamp`,x:0,z:-.9,heading:3.1416},{kind:`lamp`,x:0,z:.9,heading:0},{kind:`lamp`,x:-.9,z:0,heading:1.5708},{kind:`lamp`,x:.9,z:0,heading:-1.5708},{kind:`tree`,x:-.84,z:.1,heading:1.2},{kind:`tree`,x:.84,z:.1,heading:2.4},{kind:`billboard`,x:.1,z:.9,heading:0}]},{id:`downtown_D`,buildings:[{x:0,z:-.06,w:.78,d:.5,h:13,color:`#a39887`,roof:`#6e6559`},{x:-.62,z:.72,w:.26,d:.24,h:8,color:`#8b93a1`,roof:`#545e6b`}],props:[{kind:`lamp`,x:-.9,z:-.9,heading:3.1416},{kind:`lamp`,x:.9,z:-.9,heading:3.1416},{kind:`lamp`,x:-.9,z:.9,heading:0},{kind:`lamp`,x:.9,z:.9,heading:0},{kind:`tree`,x:.6,z:.7,heading:.9},{kind:`bin`,x:-.2,z:.86,heading:0},{kind:`hydrant`,x:.3,z:.86,heading:0}]},{id:`garage_A`,buildings:[{x:.12,z:.02,w:.56,d:.46,h:9,color:`#7d8e9f`,roof:`#545e6b`},{x:-.72,z:-.72,w:.22,d:.22,h:6,color:`#9c8f80`,roof:`#6b6155`}],props:[{kind:`fence`,x:-.72,z:.86,heading:1.5708},{kind:`fence`,x:-.65,z:.86,heading:1.5708},{kind:`fence`,x:-.58,z:.86,heading:1.5708},{kind:`fence`,x:-.51,z:.86,heading:1.5708},{kind:`lamp`,x:-.9,z:-.9,heading:3.1416},{kind:`lamp`,x:.9,z:.9,heading:0},{kind:`lamp`,x:.9,z:-.9,heading:3.1416},{kind:`bin`,x:.5,z:.84,heading:0},{kind:`bin`,x:.6,z:.84,heading:0},{kind:`hydrant`,x:.78,z:.7,heading:0}]},{id:`stadium_A`,plate:`#3b424b`,buildings:[{x:0,z:-.62,w:.78,d:.16,h:13,color:`#6f7b88`,roof:`#5d6570`},{x:0,z:.62,w:.78,d:.16,h:13,color:`#6f7b88`,roof:`#5d6570`},{x:-.7,z:0,w:.14,d:.46,h:11,color:`#9aa4b2`,roof:`#545e6b`},{x:.7,z:0,w:.14,d:.46,h:11,color:`#9aa4b2`,roof:`#545e6b`}],props:[{kind:`lamp`,x:-.9,z:-.9,heading:3.1416},{kind:`lamp`,x:.9,z:-.9,heading:3.1416},{kind:`lamp`,x:-.9,z:.9,heading:0},{kind:`lamp`,x:.9,z:.9,heading:0},{kind:`billboard`,x:-.4,z:.9,heading:0}]},{id:`warehouse_A`,buildings:[{x:0,z:-.44,w:.84,d:.3,h:8,color:`#7d7365`,roof:`#53504a`},{x:0,z:.34,w:.84,d:.32,h:6,color:`#8a7f6d`,roof:`#5c564d`}],props:[{kind:`fence`,x:-.75,z:.88,heading:1.5708},{kind:`fence`,x:-.68,z:.88,heading:1.5708},{kind:`fence`,x:-.61,z:.88,heading:1.5708},{kind:`fence`,x:-.54,z:.88,heading:1.5708},{kind:`fence`,x:-.47,z:.88,heading:1.5708},{kind:`fence`,x:-.4,z:.88,heading:1.5708},{kind:`lamp`,x:-.9,z:-.9,heading:3.1416},{kind:`lamp`,x:.9,z:-.9,heading:3.1416},{kind:`billboard`,x:.55,z:.86,heading:0}]},{id:`warehouse_B`,buildings:[{x:-.12,z:.04,w:.6,d:.52,h:9,color:`#6e6a62`,roof:`#4b4842`},{x:.72,z:-.72,w:.18,d:.18,h:5,color:`#85796a`,roof:`#53504a`}],props:[{kind:`lamp`,x:-.9,z:.9,heading:0},{kind:`lamp`,x:.9,z:.9,heading:0},{kind:`billboard`,x:.3,z:-.88,heading:3.1416},{kind:`fence`,x:.55,z:.9,heading:1.5708},{kind:`fence`,x:.62,z:.9,heading:1.5708}]},{id:`factory_A`,buildings:[{x:0,z:-.14,w:.7,d:.5,h:11,color:`#8a7f6d`,roof:`#5c564d`},{x:.6,z:.62,w:.24,d:.24,h:6,color:`#7d7365`,roof:`#53504a`}],props:[{kind:`fence`,x:-.7,z:.88,heading:1.5708},{kind:`fence`,x:-.63,z:.88,heading:1.5708},{kind:`fence`,x:-.56,z:.88,heading:1.5708},{kind:`fence`,x:-.49,z:.88,heading:1.5708},{kind:`billboard`,x:.2,z:.86,heading:0},{kind:`lamp`,x:-.9,z:-.9,heading:3.1416}]},{id:`parking_A`,plate:`#3b424b`,buildings:[],props:[{kind:`lamp`,x:-.9,z:-.9,heading:3.1416},{kind:`lamp`,x:.9,z:-.9,heading:3.1416},{kind:`lamp`,x:-.9,z:.9,heading:0},{kind:`lamp`,x:.9,z:.9,heading:0},{kind:`tree`,x:-.45,z:0,heading:.7},{kind:`tree`,x:.45,z:0,heading:1.9},{kind:`bin`,x:0,z:-.85,heading:0}]},{id:`park_A`,plate:`#3a573b`,buildings:[],props:[{kind:`tree`,x:-.55,z:-.55,heading:.5},{kind:`tree`,x:0,z:-.55,heading:1.5},{kind:`tree`,x:.55,z:-.55,heading:2.5},{kind:`tree`,x:-.55,z:0,heading:3.5},{kind:`tree`,x:.55,z:0,heading:4.5},{kind:`tree`,x:-.55,z:.55,heading:5.5},{kind:`tree`,x:0,z:.55,heading:.9},{kind:`tree`,x:.55,z:.55,heading:1.3},{kind:`bench`,x:-.66,z:0,heading:1.5708},{kind:`bench`,x:.66,z:0,heading:-1.5708},{kind:`bench`,x:0,z:-.72,heading:3.1416},{kind:`lamp`,x:-.92,z:-.92,heading:3.1416},{kind:`lamp`,x:.92,z:-.92,heading:3.1416},{kind:`lamp`,x:-.92,z:.92,heading:0},{kind:`lamp`,x:.92,z:.92,heading:0}]},{id:`park_B`,plate:`#3a573b`,buildings:[],props:[{kind:`tree`,x:-.6,z:-.7,heading:.3},{kind:`tree`,x:0,z:-.7,heading:.8},{kind:`tree`,x:.6,z:-.7,heading:1.1},{kind:`tree`,x:-.6,z:-.25,heading:1.6},{kind:`tree`,x:.6,z:-.25,heading:2.1},{kind:`tree`,x:-.6,z:.25,heading:2.6},{kind:`tree`,x:.6,z:.25,heading:3.1},{kind:`tree`,x:0,z:.7,heading:3.6},{kind:`bench`,x:-.2,z:.72,heading:3.1416},{kind:`bench`,x:.2,z:.72,heading:3.1416},{kind:`lamp`,x:-.92,z:-.9,heading:3.1416},{kind:`lamp`,x:.92,z:.9,heading:0}]},{id:`waterfront_A`,buildings:[{x:.02,z:-.52,w:.7,d:.28,h:8,color:`#9aa3ab`,roof:`#626a72`},{x:-.06,z:.42,w:.66,d:.24,h:6,color:`#8f9a96`,roof:`#6b726d`}],props:[{kind:`bench`,x:.84,z:-.2,heading:1.5708},{kind:`bench`,x:.84,z:.2,heading:1.5708},{kind:`lamp`,x:-.9,z:-.9,heading:3.1416},{kind:`lamp`,x:.9,z:-.9,heading:3.1416},{kind:`lamp`,x:-.9,z:.9,heading:0},{kind:`tree`,x:-.7,z:.1,heading:1.1},{kind:`billboard`,x:.1,z:-.9,heading:3.1416}]},{id:`waterfront_B`,buildings:[{x:0,z:.1,w:.6,d:.4,h:7,color:`#a8a08f`,roof:`#6b726d`}],props:[{kind:`tree`,x:-.72,z:-.6,heading:.4},{kind:`tree`,x:-.72,z:.6,heading:1.6},{kind:`bench`,x:.84,z:0,heading:1.5708},{kind:`lamp`,x:.9,z:-.9,heading:3.1416},{kind:`lamp`,x:.9,z:.9,heading:0},{kind:`bin`,x:.4,z:.86,heading:0}]},{id:`docks_A`,buildings:[{x:.02,z:-.34,w:.84,d:.26,h:9,color:`#7d7365`,roof:`#53504a`},{x:0,z:.36,w:.84,d:.24,h:7,color:`#6e6a62`,roof:`#4b4842`}],props:[{kind:`fence`,x:-.86,z:-.85,heading:0},{kind:`fence`,x:-.86,z:.55,heading:0},{kind:`billboard`,x:.5,z:.1,heading:1.5708},{kind:`lamp`,x:.9,z:-.9,heading:3.1416},{kind:`lamp`,x:.9,z:.9,heading:0}]},{id:`lawn`,plate:`#3a573b`,buildings:[],props:[]}],blocks:[{id:`c0r1`,rect:{x:-448.5,z:-350,hx:41.5,hz:43},district:`center`,kind:`park`,prefab:`park_B`},{id:`c0r2`,rect:{x:-448.5,z:-250,hx:41.5,hz:43},district:`center`,kind:`park`,prefab:`park_A`},{id:`c0r3`,rect:{x:-448.5,z:-150,hx:41.5,hz:43},district:`center`,kind:`build`,prefab:`downtown_C`},{id:`c0r4`,rect:{x:-448.5,z:-52,hx:41.5,hz:41},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c0r5`,rect:{x:-448.5,z:52,hx:41.5,hz:41},district:`center`,kind:`build`,prefab:`downtown_C`},{id:`c0r6`,rect:{x:-448.5,z:150,hx:41.5,hz:43},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c0r7`,rect:{x:-448.5,z:250,hx:41.5,hz:43},district:`center`,kind:`build`,prefab:`downtown_C`},{id:`c0r8`,rect:{x:-448.5,z:350,hx:41.5,hz:43},district:`industrial`,kind:`build`,prefab:`factory_A`},{id:`c0r9`,rect:{x:-448.5,z:448.5,hx:41.5,hz:41.5},district:`industrial`,kind:`build`,prefab:`factory_A`},{id:`c1r0`,rect:{x:-350,z:-448.5,hx:43,hz:41.5},district:`center`,kind:`park`,prefab:`park_B`},{id:`c1r2`,rect:{x:-350,z:-250,hx:43,hz:43},district:`center`,kind:`park`,prefab:`park_B`},{id:`c1r3`,rect:{x:-350,z:-150,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c1r4`,rect:{x:-350,z:-52,hx:43,hz:41},district:`center`,kind:`build`,prefab:`downtown_D`},{id:`c1r5`,rect:{x:-350,z:52,hx:43,hz:41},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c1r6`,rect:{x:-350,z:150,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_D`},{id:`c1r7`,rect:{x:-350,z:250,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c1r8`,rect:{x:-350,z:350,hx:43,hz:43},district:`industrial`,kind:`build`,prefab:`stadium_A`},{id:`c1r9`,rect:{x:-350,z:448.5,hx:43,hz:41.5},district:`industrial`,kind:`build`,prefab:`warehouse_A`},{id:`c2r0`,rect:{x:-250,z:-448.5,hx:43,hz:41.5},district:`center`,kind:`park`,prefab:`park_A`},{id:`c2r1`,rect:{x:-250,z:-350,hx:43,hz:43},district:`center`,kind:`park`,prefab:`park_B`},{id:`c2r3`,rect:{x:-250,z:-150,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_B`},{id:`c2r4`,rect:{x:-250,z:-52,hx:43,hz:41},district:`center`,kind:`build`,prefab:`downtown_B`},{id:`c2r5`,rect:{x:-250,z:52,hx:43,hz:41},district:`center`,kind:`build`,prefab:`downtown_B`},{id:`c2r6`,rect:{x:-250,z:150,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_C`},{id:`c2r7`,rect:{x:-250,z:250,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_B`},{id:`c2r8`,rect:{x:-250,z:350,hx:43,hz:43},district:`industrial`,kind:`build`,prefab:`warehouse_B`},{id:`c2r9`,rect:{x:-250,z:448.5,hx:43,hz:41.5},district:`industrial`,kind:`build`,prefab:`warehouse_B`},{id:`c3r0`,rect:{x:-150,z:-448.5,hx:43,hz:41.5},district:`center`,kind:`build`,prefab:`downtown_C`},{id:`c3r1`,rect:{x:-150,z:-350,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c3r2`,rect:{x:-150,z:-250,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_C`},{id:`c3r4`,rect:{x:-150,z:-52,hx:43,hz:41},district:`center`,kind:`build`,prefab:`downtown_C`},{id:`c3r5`,rect:{x:-150,z:52,hx:43,hz:41},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c3r6`,rect:{x:-150,z:150,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_C`},{id:`c3r7`,rect:{x:-150,z:250,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c3r8`,rect:{x:-150,z:350,hx:43,hz:43},district:`industrial`,kind:`build`,prefab:`factory_A`},{id:`c3r9`,rect:{x:-150,z:448.5,hx:43,hz:41.5},district:`industrial`,kind:`build`,prefab:`factory_A`},{id:`c4r0`,rect:{x:-52,z:-448.5,hx:41,hz:41.5},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c4r1`,rect:{x:-52,z:-350,hx:41,hz:43},district:`center`,kind:`build`,prefab:`downtown_D`},{id:`c4r2`,rect:{x:-52,z:-250,hx:41,hz:43},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c4r3`,rect:{x:-52,z:-150,hx:41,hz:43},district:`center`,kind:`build`,prefab:`downtown_D`},{id:`c4r5`,rect:{x:-52,z:52,hx:41,hz:41},district:`center`,kind:`build`,prefab:`garage_A`},{id:`c4r6`,rect:{x:-52,z:150,hx:41,hz:43},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c4r7`,rect:{x:-52,z:250,hx:41,hz:43},district:`center`,kind:`build`,prefab:`downtown_D`},{id:`c4r8`,rect:{x:-52,z:350,hx:41,hz:43},district:`industrial`,kind:`build`,prefab:`warehouse_A`},{id:`c4r9`,rect:{x:-52,z:448.5,hx:41,hz:41.5},district:`industrial`,kind:`build`,prefab:`warehouse_A`},{id:`c5r0`,rect:{x:52,z:-448.5,hx:41,hz:41.5},district:`center`,kind:`build`,prefab:`downtown_B`},{id:`c5r1`,rect:{x:52,z:-350,hx:41,hz:43},district:`center`,kind:`build`,prefab:`downtown_B`},{id:`c5r2`,rect:{x:52,z:-250,hx:41,hz:43},district:`center`,kind:`build`,prefab:`downtown_B`},{id:`c5r3`,rect:{x:52,z:-150,hx:41,hz:43},district:`center`,kind:`build`,prefab:`downtown_D`},{id:`c5r4`,rect:{x:52,z:-52,hx:41,hz:41},district:`center`,kind:`build`,prefab:`downtown_B`},{id:`c5r6`,rect:{x:52,z:150,hx:41,hz:43},district:`center`,kind:`build`,prefab:`downtown_B`},{id:`c5r7`,rect:{x:52,z:250,hx:41,hz:43},district:`center`,kind:`build`,prefab:`downtown_B`},{id:`c5r8`,rect:{x:52,z:350,hx:41,hz:43},district:`industrial`,kind:`build`,prefab:`warehouse_B`},{id:`c5r9`,rect:{x:52,z:448.5,hx:41,hz:41.5},district:`industrial`,kind:`parking`,prefab:`parking_A`},{id:`c6r0`,rect:{x:150,z:-448.5,hx:43,hz:41.5},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c6r1`,rect:{x:150,z:-350,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_C`},{id:`c6r2`,rect:{x:150,z:-250,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c6r3`,rect:{x:150,z:-150,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_C`},{id:`c6r4`,rect:{x:150,z:-52,hx:43,hz:41},district:`center`,kind:`build`,prefab:`downtown_B`},{id:`c6r5`,rect:{x:150,z:52,hx:43,hz:41},district:`center`,kind:`build`,prefab:`downtown_C`},{id:`c6r7`,rect:{x:150,z:250,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_C`},{id:`c6r8`,rect:{x:150,z:350,hx:43,hz:43},district:`industrial`,kind:`parking`,prefab:`parking_A`},{id:`c6r9`,rect:{x:150,z:448.5,hx:43,hz:41.5},district:`industrial`,kind:`build`,prefab:`factory_A`},{id:`c7r0`,rect:{x:250,z:-448.5,hx:43,hz:41.5},district:`center`,kind:`build`,prefab:`downtown_D`},{id:`c7r1`,rect:{x:250,z:-350,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c7r2`,rect:{x:250,z:-250,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_D`},{id:`c7r3`,rect:{x:250,z:-150,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c7r4`,rect:{x:250,z:-52,hx:43,hz:41},district:`center`,kind:`build`,prefab:`downtown_D`},{id:`c7r5`,rect:{x:250,z:52,hx:43,hz:41},district:`center`,kind:`build`,prefab:`downtown_A`},{id:`c7r6`,rect:{x:250,z:150,hx:43,hz:43},district:`center`,kind:`build`,prefab:`downtown_D`},{id:`c7r8`,rect:{x:250,z:350,hx:43,hz:43},district:`industrial`,kind:`build`,prefab:`warehouse_A`},{id:`c7r9`,rect:{x:250,z:448.5,hx:43,hz:41.5},district:`industrial`,kind:`build`,prefab:`warehouse_A`},{id:`c8r0`,rect:{x:328.5,z:-448.5,hx:21.5,hz:41.5},district:`waterfront`,kind:`build`,prefab:`waterfront_A`},{id:`c8r1`,rect:{x:328.5,z:-350,hx:21.5,hz:43},district:`waterfront`,kind:`park`,prefab:`park_A`},{id:`c8r2`,rect:{x:328.5,z:-250,hx:21.5,hz:43},district:`waterfront`,kind:`build`,prefab:`waterfront_B`},{id:`c8r3`,rect:{x:328.5,z:-150,hx:21.5,hz:43},district:`waterfront`,kind:`park`,prefab:`park_B`},{id:`c8r4`,rect:{x:328.5,z:-52,hx:21.5,hz:41},district:`waterfront`,kind:`build`,prefab:`waterfront_A`},{id:`c8r5`,rect:{x:328.5,z:52,hx:21.5,hz:41},district:`waterfront`,kind:`park`,prefab:`park_A`},{id:`c8r6`,rect:{x:328.5,z:150,hx:21.5,hz:43},district:`waterfront`,kind:`build`,prefab:`waterfront_B`},{id:`c8r7`,rect:{x:328.5,z:250,hx:21.5,hz:43},district:`waterfront`,kind:`park`,prefab:`park_B`},{id:`c8r9`,rect:{x:328.5,z:448.5,hx:21.5,hz:41.5},district:`waterfront`,kind:`park`,prefab:`park_A`},{id:`c0r0_ne`,rect:{x:-424,z:-472,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_A`},{id:`c0r0_sw`,rect:{x:-472,z:-424,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_B`},{id:`c1r1_ne`,rect:{x:-324,z:-376,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_B`},{id:`c1r1_sw`,rect:{x:-376,z:-324,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_A`},{id:`c2r2_ne`,rect:{x:-224,z:-276,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_A`},{id:`c2r2_sw`,rect:{x:-276,z:-224,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_B`},{id:`c3r3_ne`,rect:{x:-124,z:-176,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_B`},{id:`c3r3_sw`,rect:{x:-176,z:-124,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_A`},{id:`c4r4_ne`,rect:{x:-29,z:-76,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_A`},{id:`c4r4_sw`,rect:{x:-76,z:-29,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_B`},{id:`c5r5_ne`,rect:{x:76,z:29,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_B`},{id:`c5r5_sw`,rect:{x:29,z:76,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_A`},{id:`c6r6_ne`,rect:{x:176,z:124,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_A`},{id:`c6r6_sw`,rect:{x:124,z:176,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_B`},{id:`c7r7_ne`,rect:{x:276,z:224,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_B`},{id:`c7r7_sw`,rect:{x:224,z:276,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_A`},{id:`c8r8_ne`,rect:{x:330,z:324,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_A`},{id:`c8r8_sw`,rect:{x:330,z:376,hx:17,hz:17},district:`center`,kind:`park`,prefab:`park_B`},{id:`dock_n`,rect:{x:570,z:82,hx:26,hz:68},district:`waterfront`,kind:`build`,prefab:`docks_A`},{id:`dock_s`,rect:{x:570,z:-82,hx:26,hz:68},district:`waterfront`,kind:`build`,prefab:`docks_A`},{id:`edge_n0`,rect:{x:-403.5,z:-554,hx:108.5,hz:42},district:`center`,kind:`park`,prefab:`lawn`},{id:`edge_s0`,rect:{x:-403.5,z:554,hx:108.5,hz:42},district:`industrial`,kind:`park`,prefab:`lawn`},{id:`edge_n1`,rect:{x:-186.5,z:-554,hx:108.5,hz:42},district:`center`,kind:`park`,prefab:`lawn`},{id:`edge_s1`,rect:{x:-186.5,z:554,hx:108.5,hz:42},district:`industrial`,kind:`park`,prefab:`lawn`},{id:`edge_n2`,rect:{x:30.5,z:-554,hx:108.5,hz:42},district:`center`,kind:`park`,prefab:`lawn`},{id:`edge_s2`,rect:{x:30.5,z:554,hx:108.5,hz:42},district:`industrial`,kind:`park`,prefab:`lawn`},{id:`edge_n3`,rect:{x:247.5,z:-554,hx:108.5,hz:42},district:`center`,kind:`park`,prefab:`lawn`},{id:`edge_s3`,rect:{x:247.5,z:554,hx:108.5,hz:42},district:`industrial`,kind:`park`,prefab:`lawn`},{id:`edge_w0`,rect:{x:-554,z:-384,hx:42,hz:128},district:`center`,kind:`park`,prefab:`lawn`},{id:`edge_w1`,rect:{x:-554,z:-128,hx:42,hz:128},district:`center`,kind:`park`,prefab:`lawn`},{id:`edge_w2`,rect:{x:-554,z:128,hx:42,hz:128},district:`center`,kind:`park`,prefab:`lawn`},{id:`edge_w3`,rect:{x:-554,z:384,hx:42,hz:128},district:`center`,kind:`park`,prefab:`lawn`},{id:`edge_e0`,rect:{x:570,z:378,hx:26,hz:218},district:`waterfront`,kind:`park`,prefab:`lawn`},{id:`edge_e1`,rect:{x:570,z:-378,hx:26,hz:218},district:`waterfront`,kind:`park`,prefab:`lawn`}],landmarks:[{id:`garage`,kind:`garage`,name:`Гараж`,x:-50,z:150,radius:26},{id:`police`,kind:`police`,name:`Полицейский участок`,x:150,z:-50,radius:30},{id:`hospital`,kind:`hospital`,name:`Больница`,x:-250,z:250,radius:30},{id:`stadium`,kind:`stadium`,name:`Стадион`,x:-350,z:350,radius:40},{id:`mall`,kind:`mall`,name:`Торговый центр`,x:50,z:-150,radius:32},{id:`docks`,kind:`docks`,name:`Доки`,x:570,z:82,radius:40},{id:`bridge`,kind:`bridge`,name:`Мост`,x:465,z:0,radius:36}],missions:[{id:`m_garage`,kind:`pickup`,name:`Заказ у гаража`,x:-50,z:110,radius:10},{id:`m_docks`,kind:`delivery`,name:`Доставка в доки`,x:570,z:-82,radius:12},{id:`m_stadium`,kind:`race`,name:`Гонка у стадиона`,x:-350,z:350,radius:14}],spawns:{player:{x:1.67,z:150,heading:0},cars:[{x:101.5,z:-60,heading:0},{x:-98.5,z:240,heading:0},{x:200.5,z:60,heading:3.1416},{x:-140,z:-101.5,heading:1.5708},{x:160,z:301.5,heading:-1.5708},{x:360,z:200,heading:3.1416},{x:-400,z:350,heading:0},{x:460,z:1.5,heading:1.5708}],peds:[{x:-50,z:112,heading:0},{x:150,z:-88,heading:3.1416},{x:-250,z:212,heading:3.1416},{x:50,z:-188,heading:0},{x:-350,z:388,heading:0},{x:583,z:40,heading:1.5708},{x:328,z:-20,heading:0},{x:378,z:-110,heading:1.5708},{x:-120,z:320,heading:1.5708},{x:150,z:120,heading:0}],cops:[{x:203,z:-35,heading:3.1416},{x:3,z:3,heading:0},{x:-97,z:-97,heading:1.5708},{x:148,z:302,heading:-1.5708}]},props:[{kind:`fence`,x:384,z:-588},{kind:`fence`,x:384,z:-584.98},{kind:`fence`,x:384,z:-581.96},{kind:`fence`,x:384,z:-578.94},{kind:`fence`,x:384,z:-575.92},{kind:`fence`,x:384,z:-572.9},{kind:`fence`,x:384,z:-569.88},{kind:`fence`,x:384,z:-566.86},{kind:`fence`,x:384,z:-563.84},{kind:`fence`,x:384,z:-560.82},{kind:`fence`,x:384,z:-557.8},{kind:`fence`,x:384,z:-554.78},{kind:`fence`,x:384,z:-551.76},{kind:`fence`,x:384,z:-548.74},{kind:`fence`,x:384,z:-545.72},{kind:`fence`,x:384,z:-542.7},{kind:`fence`,x:384,z:-539.68},{kind:`fence`,x:384,z:-536.66},{kind:`fence`,x:384,z:-533.64},{kind:`fence`,x:384,z:-530.62},{kind:`fence`,x:384,z:-527.6},{kind:`fence`,x:384,z:-524.58},{kind:`fence`,x:384,z:-521.56},{kind:`fence`,x:384,z:-518.54},{kind:`fence`,x:384,z:-515.52},{kind:`fence`,x:384,z:-512.5},{kind:`fence`,x:384,z:-509.48},{kind:`fence`,x:384,z:-506.46},{kind:`fence`,x:384,z:-503.44},{kind:`fence`,x:384,z:-500.42},{kind:`fence`,x:384,z:-497.4},{kind:`fence`,x:384,z:-494.38},{kind:`fence`,x:384,z:-491.36},{kind:`fence`,x:384,z:-488.34},{kind:`fence`,x:384,z:-485.32},{kind:`fence`,x:384,z:-482.3},{kind:`fence`,x:384,z:-479.28},{kind:`fence`,x:384,z:-476.26},{kind:`fence`,x:384,z:-473.24},{kind:`fence`,x:384,z:-470.22},{kind:`fence`,x:384,z:-467.2},{kind:`fence`,x:384,z:-464.18},{kind:`fence`,x:384,z:-461.16},{kind:`fence`,x:384,z:-458.14},{kind:`fence`,x:384,z:-455.12},{kind:`fence`,x:384,z:-452.1},{kind:`fence`,x:384,z:-449.08},{kind:`fence`,x:384,z:-446.06},{kind:`fence`,x:384,z:-443.04},{kind:`fence`,x:384,z:-440.02},{kind:`fence`,x:384,z:-437},{kind:`fence`,x:384,z:-433.98},{kind:`fence`,x:384,z:-430.96},{kind:`fence`,x:384,z:-427.94},{kind:`fence`,x:384,z:-424.92},{kind:`fence`,x:384,z:-421.9},{kind:`fence`,x:384,z:-418.88},{kind:`fence`,x:384,z:-415.86},{kind:`fence`,x:384,z:-412.84},{kind:`fence`,x:384,z:-409.82},{kind:`fence`,x:384,z:-406.8},{kind:`fence`,x:384,z:-403.78},{kind:`fence`,x:384,z:-400.76},{kind:`fence`,x:384,z:-397.74},{kind:`fence`,x:384,z:-394.72},{kind:`fence`,x:384,z:-391.7},{kind:`fence`,x:384,z:-388.68},{kind:`fence`,x:384,z:-385.66},{kind:`fence`,x:384,z:-382.64},{kind:`fence`,x:384,z:-379.62},{kind:`fence`,x:384,z:-376.6},{kind:`fence`,x:384,z:-373.58},{kind:`fence`,x:384,z:-370.56},{kind:`fence`,x:384,z:-367.54},{kind:`fence`,x:384,z:-364.52},{kind:`fence`,x:384,z:-361.5},{kind:`fence`,x:384,z:-358.48},{kind:`fence`,x:384,z:-355.46},{kind:`fence`,x:384,z:-352.44},{kind:`fence`,x:384,z:-349.42},{kind:`fence`,x:384,z:-346.4},{kind:`fence`,x:384,z:-343.38},{kind:`fence`,x:384,z:-340.36},{kind:`fence`,x:384,z:-337.34},{kind:`fence`,x:384,z:-334.32},{kind:`fence`,x:384,z:-331.3},{kind:`fence`,x:384,z:-328.28},{kind:`fence`,x:384,z:-325.26},{kind:`fence`,x:384,z:-322.24},{kind:`fence`,x:384,z:-319.22},{kind:`fence`,x:384,z:-316.2},{kind:`fence`,x:384,z:-313.18},{kind:`fence`,x:384,z:-310.16},{kind:`fence`,x:384,z:-307.14},{kind:`fence`,x:384,z:-304.12},{kind:`fence`,x:384,z:-301.1},{kind:`fence`,x:384,z:-298.08},{kind:`fence`,x:384,z:-295.06},{kind:`fence`,x:384,z:-292.04},{kind:`fence`,x:384,z:-289.02},{kind:`fence`,x:384,z:-286},{kind:`fence`,x:384,z:-282.98},{kind:`fence`,x:384,z:-279.96},{kind:`fence`,x:384,z:-276.94},{kind:`fence`,x:384,z:-273.92},{kind:`fence`,x:384,z:-270.9},{kind:`fence`,x:384,z:-267.88},{kind:`fence`,x:384,z:-264.86},{kind:`fence`,x:384,z:-261.84},{kind:`fence`,x:384,z:-258.82},{kind:`fence`,x:384,z:-255.8},{kind:`fence`,x:384,z:-252.78},{kind:`fence`,x:384,z:-249.76},{kind:`fence`,x:384,z:-246.74},{kind:`fence`,x:384,z:-243.72},{kind:`fence`,x:384,z:-240.7},{kind:`fence`,x:384,z:-237.68},{kind:`fence`,x:384,z:-234.66},{kind:`fence`,x:384,z:-231.64},{kind:`fence`,x:384,z:-228.62},{kind:`fence`,x:384,z:-225.6},{kind:`fence`,x:384,z:-222.58},{kind:`fence`,x:384,z:-219.56},{kind:`fence`,x:384,z:-216.54},{kind:`fence`,x:384,z:-213.52},{kind:`fence`,x:384,z:-210.5},{kind:`fence`,x:384,z:-207.48},{kind:`fence`,x:384,z:-204.46},{kind:`fence`,x:384,z:-201.44},{kind:`fence`,x:384,z:-198.42},{kind:`fence`,x:384,z:-195.4},{kind:`fence`,x:384,z:-192.38},{kind:`fence`,x:384,z:-189.36},{kind:`fence`,x:384,z:-186.34},{kind:`fence`,x:384,z:-183.32},{kind:`fence`,x:384,z:-180.3},{kind:`fence`,x:384,z:-177.28},{kind:`fence`,x:384,z:-174.26},{kind:`fence`,x:384,z:-171.24},{kind:`fence`,x:384,z:-168.22},{kind:`fence`,x:384,z:-165.2},{kind:`fence`,x:384,z:-162.18},{kind:`fence`,x:384,z:-159.16},{kind:`fence`,x:384,z:-156.14},{kind:`fence`,x:384,z:-153.12},{kind:`fence`,x:384,z:-150.1},{kind:`fence`,x:384,z:-147.08},{kind:`fence`,x:384,z:-144.06},{kind:`fence`,x:384,z:-141.04},{kind:`fence`,x:384,z:-138.02},{kind:`fence`,x:384,z:-135},{kind:`fence`,x:384,z:-131.98},{kind:`fence`,x:384,z:-128.96},{kind:`fence`,x:384,z:-125.94},{kind:`fence`,x:384,z:-122.92},{kind:`fence`,x:384,z:-119.9},{kind:`fence`,x:384,z:-116.88},{kind:`fence`,x:384,z:-113.86},{kind:`fence`,x:384,z:-110.84},{kind:`fence`,x:384,z:-107.82},{kind:`fence`,x:384,z:-104.8},{kind:`fence`,x:384,z:-101.78},{kind:`fence`,x:384,z:-98.76},{kind:`fence`,x:384,z:-95.74},{kind:`fence`,x:384,z:-92.72},{kind:`fence`,x:384,z:-89.7},{kind:`fence`,x:384,z:-86.68},{kind:`fence`,x:384,z:-83.66},{kind:`fence`,x:384,z:-80.64},{kind:`fence`,x:384,z:-77.62},{kind:`fence`,x:384,z:-74.6},{kind:`fence`,x:384,z:-71.58},{kind:`fence`,x:384,z:-68.56},{kind:`fence`,x:384,z:-65.54},{kind:`fence`,x:384,z:-62.52},{kind:`fence`,x:384,z:-59.5},{kind:`fence`,x:384,z:-56.48},{kind:`fence`,x:384,z:-53.46},{kind:`fence`,x:384,z:-50.44},{kind:`fence`,x:384,z:-47.42},{kind:`fence`,x:384,z:-44.4},{kind:`fence`,x:384,z:-41.38},{kind:`fence`,x:384,z:-38.36},{kind:`fence`,x:384,z:-35.34},{kind:`fence`,x:384,z:-32.32},{kind:`fence`,x:384,z:-29.3},{kind:`fence`,x:384,z:-26.28},{kind:`fence`,x:384,z:-23.26},{kind:`fence`,x:384,z:-20.24},{kind:`fence`,x:384,z:-17.22},{kind:`fence`,x:384,z:-14.2},{kind:`fence`,x:384,z:12.98},{kind:`fence`,x:384,z:16},{kind:`fence`,x:384,z:19.02},{kind:`fence`,x:384,z:22.04},{kind:`fence`,x:384,z:25.06},{kind:`fence`,x:384,z:28.08},{kind:`fence`,x:384,z:31.1},{kind:`fence`,x:384,z:34.12},{kind:`fence`,x:384,z:37.14},{kind:`fence`,x:384,z:40.16},{kind:`fence`,x:384,z:43.18},{kind:`fence`,x:384,z:46.2},{kind:`fence`,x:384,z:49.22},{kind:`fence`,x:384,z:52.24},{kind:`fence`,x:384,z:55.26},{kind:`fence`,x:384,z:58.28},{kind:`fence`,x:384,z:61.3},{kind:`fence`,x:384,z:64.32},{kind:`fence`,x:384,z:67.34},{kind:`fence`,x:384,z:70.36},{kind:`fence`,x:384,z:73.38},{kind:`fence`,x:384,z:76.4},{kind:`fence`,x:384,z:79.42},{kind:`fence`,x:384,z:82.44},{kind:`fence`,x:384,z:85.46},{kind:`fence`,x:384,z:88.48},{kind:`fence`,x:384,z:91.5},{kind:`fence`,x:384,z:94.52},{kind:`fence`,x:384,z:97.54},{kind:`fence`,x:384,z:100.56},{kind:`fence`,x:384,z:103.58},{kind:`fence`,x:384,z:106.6},{kind:`fence`,x:384,z:109.62},{kind:`fence`,x:384,z:112.64},{kind:`fence`,x:384,z:115.66},{kind:`fence`,x:384,z:118.68},{kind:`fence`,x:384,z:121.7},{kind:`fence`,x:384,z:124.72},{kind:`fence`,x:384,z:127.74},{kind:`fence`,x:384,z:130.76},{kind:`fence`,x:384,z:133.78},{kind:`fence`,x:384,z:136.8},{kind:`fence`,x:384,z:139.82},{kind:`fence`,x:384,z:142.84},{kind:`fence`,x:384,z:145.86},{kind:`fence`,x:384,z:148.88},{kind:`fence`,x:384,z:151.9},{kind:`fence`,x:384,z:154.92},{kind:`fence`,x:384,z:157.94},{kind:`fence`,x:384,z:160.96},{kind:`fence`,x:384,z:163.98},{kind:`fence`,x:384,z:167},{kind:`fence`,x:384,z:170.02},{kind:`fence`,x:384,z:173.04},{kind:`fence`,x:384,z:176.06},{kind:`fence`,x:384,z:179.08},{kind:`fence`,x:384,z:182.1},{kind:`fence`,x:384,z:185.12},{kind:`fence`,x:384,z:188.14},{kind:`fence`,x:384,z:191.16},{kind:`fence`,x:384,z:194.18},{kind:`fence`,x:384,z:197.2},{kind:`fence`,x:384,z:200.22},{kind:`fence`,x:384,z:203.24},{kind:`fence`,x:384,z:206.26},{kind:`fence`,x:384,z:209.28},{kind:`fence`,x:384,z:212.3},{kind:`fence`,x:384,z:215.32},{kind:`fence`,x:384,z:218.34},{kind:`fence`,x:384,z:221.36},{kind:`fence`,x:384,z:224.38},{kind:`fence`,x:384,z:227.4},{kind:`fence`,x:384,z:230.42},{kind:`fence`,x:384,z:233.44},{kind:`fence`,x:384,z:236.46},{kind:`fence`,x:384,z:239.48},{kind:`fence`,x:384,z:242.5},{kind:`fence`,x:384,z:245.52},{kind:`fence`,x:384,z:248.54},{kind:`fence`,x:384,z:251.56},{kind:`fence`,x:384,z:254.58},{kind:`fence`,x:384,z:257.6},{kind:`fence`,x:384,z:260.62},{kind:`fence`,x:384,z:263.64},{kind:`fence`,x:384,z:266.66},{kind:`fence`,x:384,z:269.68},{kind:`fence`,x:384,z:272.7},{kind:`fence`,x:384,z:275.72},{kind:`fence`,x:384,z:278.74},{kind:`fence`,x:384,z:281.76},{kind:`fence`,x:384,z:284.78},{kind:`fence`,x:384,z:287.8},{kind:`fence`,x:384,z:290.82},{kind:`fence`,x:384,z:293.84},{kind:`fence`,x:384,z:296.86},{kind:`fence`,x:384,z:299.88},{kind:`fence`,x:384,z:302.9},{kind:`fence`,x:384,z:305.92},{kind:`fence`,x:384,z:308.94},{kind:`fence`,x:384,z:311.96},{kind:`fence`,x:384,z:314.98},{kind:`fence`,x:384,z:318},{kind:`fence`,x:384,z:321.02},{kind:`fence`,x:384,z:324.04},{kind:`fence`,x:384,z:327.06},{kind:`fence`,x:384,z:330.08},{kind:`fence`,x:384,z:333.1},{kind:`fence`,x:384,z:336.12},{kind:`fence`,x:384,z:339.14},{kind:`fence`,x:384,z:342.16},{kind:`fence`,x:384,z:345.18},{kind:`fence`,x:384,z:348.2},{kind:`fence`,x:384,z:351.22},{kind:`fence`,x:384,z:354.24},{kind:`fence`,x:384,z:357.26},{kind:`fence`,x:384,z:360.28},{kind:`fence`,x:384,z:363.3},{kind:`fence`,x:384,z:366.32},{kind:`fence`,x:384,z:369.34},{kind:`fence`,x:384,z:372.36},{kind:`fence`,x:384,z:375.38},{kind:`fence`,x:384,z:378.4},{kind:`fence`,x:384,z:381.42},{kind:`fence`,x:384,z:384.44},{kind:`fence`,x:384,z:387.46},{kind:`fence`,x:384,z:390.48},{kind:`fence`,x:384,z:393.5},{kind:`fence`,x:384,z:396.52},{kind:`fence`,x:384,z:399.54},{kind:`fence`,x:384,z:402.56},{kind:`fence`,x:384,z:405.58},{kind:`fence`,x:384,z:408.6},{kind:`fence`,x:384,z:411.62},{kind:`fence`,x:384,z:414.64},{kind:`fence`,x:384,z:417.66},{kind:`fence`,x:384,z:420.68},{kind:`fence`,x:384,z:423.7},{kind:`fence`,x:384,z:426.72},{kind:`fence`,x:384,z:429.74},{kind:`fence`,x:384,z:432.76},{kind:`fence`,x:384,z:435.78},{kind:`fence`,x:384,z:438.8},{kind:`fence`,x:384,z:441.82},{kind:`fence`,x:384,z:444.84},{kind:`fence`,x:384,z:447.86},{kind:`fence`,x:384,z:450.88},{kind:`fence`,x:384,z:453.9},{kind:`fence`,x:384,z:456.92},{kind:`fence`,x:384,z:459.94},{kind:`fence`,x:384,z:462.96},{kind:`fence`,x:384,z:465.98},{kind:`fence`,x:384,z:469},{kind:`fence`,x:384,z:472.02},{kind:`fence`,x:384,z:475.04},{kind:`fence`,x:384,z:478.06},{kind:`fence`,x:384,z:481.08},{kind:`fence`,x:384,z:484.1},{kind:`fence`,x:384,z:487.12},{kind:`fence`,x:384,z:490.14},{kind:`fence`,x:384,z:493.16},{kind:`fence`,x:384,z:496.18},{kind:`fence`,x:384,z:499.2},{kind:`fence`,x:384,z:502.22},{kind:`fence`,x:384,z:505.24},{kind:`fence`,x:384,z:508.26},{kind:`fence`,x:384,z:511.28},{kind:`fence`,x:384,z:514.3},{kind:`fence`,x:384,z:517.32},{kind:`fence`,x:384,z:520.34},{kind:`fence`,x:384,z:523.36},{kind:`fence`,x:384,z:526.38},{kind:`fence`,x:384,z:529.4},{kind:`fence`,x:384,z:532.42},{kind:`fence`,x:384,z:535.44},{kind:`fence`,x:384,z:538.46},{kind:`fence`,x:384,z:541.48},{kind:`fence`,x:384,z:544.5},{kind:`fence`,x:384,z:547.52},{kind:`fence`,x:384,z:550.54},{kind:`fence`,x:384,z:553.56},{kind:`fence`,x:384,z:556.58},{kind:`fence`,x:384,z:559.6},{kind:`fence`,x:384,z:562.62},{kind:`fence`,x:384,z:565.64},{kind:`fence`,x:384,z:568.66},{kind:`fence`,x:384,z:571.68},{kind:`fence`,x:384,z:574.7},{kind:`fence`,x:384,z:577.72},{kind:`fence`,x:384,z:580.74},{kind:`fence`,x:384,z:583.76},{kind:`fence`,x:384,z:586.78},{kind:`tree`,x:373,z:-576,heading:-1.208},{kind:`tree`,x:373,z:-552,heading:-.896},{kind:`tree`,x:373,z:-528,heading:-.584},{kind:`tree`,x:373,z:-504,heading:-.272},{kind:`tree`,x:373,z:-480,heading:-3.1},{kind:`tree`,x:373,z:-456,heading:-2.788},{kind:`tree`,x:373,z:-432,heading:-2.476},{kind:`tree`,x:373,z:-408,heading:-2.164},{kind:`tree`,x:373,z:-384,heading:-1.852},{kind:`tree`,x:373,z:-360,heading:-1.54},{kind:`tree`,x:373,z:-336,heading:-1.228},{kind:`tree`,x:373,z:-312,heading:-.916},{kind:`tree`,x:373,z:-288,heading:-.604},{kind:`tree`,x:373,z:-264,heading:-.292},{kind:`tree`,x:373,z:-240,heading:-3.12},{kind:`tree`,x:373,z:-216,heading:-2.808},{kind:`tree`,x:373,z:-192,heading:-2.496},{kind:`tree`,x:373,z:-168,heading:-2.184},{kind:`tree`,x:373,z:-144,heading:-1.872},{kind:`tree`,x:373,z:-120,heading:-1.56},{kind:`tree`,x:373,z:-96,heading:-1.248},{kind:`tree`,x:373,z:-72,heading:-.936},{kind:`tree`,x:373,z:-48,heading:-.624},{kind:`tree`,x:373,z:-24,heading:-.312},{kind:`tree`,x:373,z:24,heading:.312},{kind:`tree`,x:373,z:48,heading:.624},{kind:`tree`,x:373,z:72,heading:.936},{kind:`tree`,x:373,z:96,heading:1.248},{kind:`tree`,x:373,z:120,heading:1.56},{kind:`tree`,x:373,z:144,heading:1.872},{kind:`tree`,x:373,z:168,heading:2.184},{kind:`tree`,x:373,z:192,heading:2.496},{kind:`tree`,x:373,z:216,heading:2.808},{kind:`tree`,x:373,z:240,heading:3.12},{kind:`tree`,x:373,z:264,heading:.292},{kind:`tree`,x:373,z:288,heading:.604},{kind:`tree`,x:373,z:312,heading:.916},{kind:`tree`,x:373,z:336,heading:1.228},{kind:`tree`,x:373,z:360,heading:1.54},{kind:`tree`,x:373,z:384,heading:1.852},{kind:`tree`,x:373,z:408,heading:2.164},{kind:`tree`,x:373,z:432,heading:2.476},{kind:`tree`,x:373,z:456,heading:2.788},{kind:`tree`,x:373,z:480,heading:3.1},{kind:`tree`,x:373,z:504,heading:.272},{kind:`tree`,x:373,z:528,heading:.584},{kind:`tree`,x:373,z:552,heading:.896},{kind:`tree`,x:373,z:576,heading:1.208},{kind:`lamp`,x:371.5,z:-564,heading:-1.5708},{kind:`lamp`,x:371.5,z:-528,heading:-1.5708},{kind:`lamp`,x:371.5,z:-492,heading:-1.5708},{kind:`lamp`,x:371.5,z:-456,heading:-1.5708},{kind:`lamp`,x:371.5,z:-420,heading:-1.5708},{kind:`lamp`,x:371.5,z:-384,heading:-1.5708},{kind:`lamp`,x:371.5,z:-348,heading:-1.5708},{kind:`lamp`,x:371.5,z:-312,heading:-1.5708},{kind:`lamp`,x:371.5,z:-276,heading:-1.5708},{kind:`lamp`,x:371.5,z:-240,heading:-1.5708},{kind:`lamp`,x:371.5,z:-204,heading:-1.5708},{kind:`lamp`,x:371.5,z:-168,heading:-1.5708},{kind:`lamp`,x:371.5,z:-132,heading:-1.5708},{kind:`lamp`,x:371.5,z:-96,heading:-1.5708},{kind:`lamp`,x:371.5,z:-60,heading:-1.5708},{kind:`lamp`,x:371.5,z:-24,heading:-1.5708},{kind:`lamp`,x:371.5,z:12,heading:-1.5708},{kind:`lamp`,x:371.5,z:48,heading:-1.5708},{kind:`lamp`,x:371.5,z:84,heading:-1.5708},{kind:`lamp`,x:371.5,z:120,heading:-1.5708},{kind:`lamp`,x:371.5,z:156,heading:-1.5708},{kind:`lamp`,x:371.5,z:192,heading:-1.5708},{kind:`lamp`,x:371.5,z:228,heading:-1.5708},{kind:`lamp`,x:371.5,z:264,heading:-1.5708},{kind:`lamp`,x:371.5,z:300,heading:-1.5708},{kind:`lamp`,x:371.5,z:336,heading:-1.5708},{kind:`lamp`,x:371.5,z:372,heading:-1.5708},{kind:`lamp`,x:371.5,z:408,heading:-1.5708},{kind:`lamp`,x:371.5,z:444,heading:-1.5708},{kind:`lamp`,x:371.5,z:480,heading:-1.5708},{kind:`lamp`,x:371.5,z:516,heading:-1.5708},{kind:`lamp`,x:371.5,z:552,heading:-1.5708},{kind:`bench`,x:380,z:-552,heading:1.5708},{kind:`bench`,x:380,z:-504,heading:1.5708},{kind:`bench`,x:380,z:-456,heading:1.5708},{kind:`bench`,x:380,z:-408,heading:1.5708},{kind:`bench`,x:380,z:-360,heading:1.5708},{kind:`bench`,x:380,z:-312,heading:1.5708},{kind:`bench`,x:380,z:-264,heading:1.5708},{kind:`bench`,x:380,z:-216,heading:1.5708},{kind:`bench`,x:380,z:-168,heading:1.5708},{kind:`bench`,x:380,z:-120,heading:1.5708},{kind:`bench`,x:380,z:-72,heading:1.5708},{kind:`bench`,x:380,z:-24,heading:1.5708},{kind:`bench`,x:380,z:24,heading:1.5708},{kind:`bench`,x:380,z:72,heading:1.5708},{kind:`bench`,x:380,z:120,heading:1.5708},{kind:`bench`,x:380,z:168,heading:1.5708},{kind:`bench`,x:380,z:216,heading:1.5708},{kind:`bench`,x:380,z:264,heading:1.5708},{kind:`bench`,x:380,z:312,heading:1.5708},{kind:`bench`,x:380,z:360,heading:1.5708},{kind:`bench`,x:380,z:408,heading:1.5708},{kind:`bench`,x:380,z:456,heading:1.5708},{kind:`bench`,x:380,z:504,heading:1.5708},{kind:`bench`,x:380,z:552,heading:1.5708},{kind:`tree`,x:-459.19,z:-477.58,heading:.6},{kind:`tree`,x:-477.58,z:-459.19,heading:1.9},{kind:`tree`,x:-440.81,z:-459.19,heading:.6},{kind:`tree`,x:-459.19,z:-440.81,heading:1.9},{kind:`tree`,x:-422.42,z:-440.81,heading:.6},{kind:`tree`,x:-440.81,z:-422.42,heading:1.9},{kind:`tree`,x:-359.19,z:-377.58,heading:.6},{kind:`tree`,x:-377.58,z:-359.19,heading:1.9},{kind:`tree`,x:-340.81,z:-359.19,heading:.6},{kind:`tree`,x:-359.19,z:-340.81,heading:1.9},{kind:`tree`,x:-322.42,z:-340.81,heading:.6},{kind:`tree`,x:-340.81,z:-322.42,heading:1.9},{kind:`tree`,x:-259.19,z:-277.58,heading:.6},{kind:`tree`,x:-277.58,z:-259.19,heading:1.9},{kind:`tree`,x:-240.81,z:-259.19,heading:.6},{kind:`tree`,x:-259.19,z:-240.81,heading:1.9},{kind:`tree`,x:-222.42,z:-240.81,heading:.6},{kind:`tree`,x:-240.81,z:-222.42,heading:1.9},{kind:`tree`,x:-159.19,z:-177.58,heading:.6},{kind:`tree`,x:-177.58,z:-159.19,heading:1.9},{kind:`tree`,x:-140.81,z:-159.19,heading:.6},{kind:`tree`,x:-159.19,z:-140.81,heading:1.9},{kind:`tree`,x:-122.42,z:-140.81,heading:.6},{kind:`tree`,x:-140.81,z:-122.42,heading:1.9},{kind:`tree`,x:-59.19,z:-77.58,heading:.6},{kind:`tree`,x:-77.58,z:-59.19,heading:1.9},{kind:`tree`,x:-40.81,z:-59.19,heading:.6},{kind:`tree`,x:-59.19,z:-40.81,heading:1.9},{kind:`tree`,x:-22.42,z:-40.81,heading:.6},{kind:`tree`,x:-40.81,z:-22.42,heading:1.9},{kind:`tree`,x:40.81,z:22.42,heading:.6},{kind:`tree`,x:22.42,z:40.81,heading:1.9},{kind:`tree`,x:59.19,z:40.81,heading:.6},{kind:`tree`,x:40.81,z:59.19,heading:1.9},{kind:`tree`,x:77.58,z:59.19,heading:.6},{kind:`tree`,x:59.19,z:77.58,heading:1.9},{kind:`tree`,x:140.81,z:122.42,heading:.6},{kind:`tree`,x:122.42,z:140.81,heading:1.9},{kind:`tree`,x:159.19,z:140.81,heading:.6},{kind:`tree`,x:140.81,z:159.19,heading:1.9},{kind:`tree`,x:177.58,z:159.19,heading:.6},{kind:`tree`,x:159.19,z:177.58,heading:1.9},{kind:`tree`,x:240.81,z:222.42,heading:.6},{kind:`tree`,x:222.42,z:240.81,heading:1.9},{kind:`tree`,x:259.19,z:240.81,heading:.6},{kind:`tree`,x:240.81,z:259.19,heading:1.9},{kind:`tree`,x:277.58,z:259.19,heading:.6},{kind:`tree`,x:259.19,z:277.58,heading:1.9},{kind:`tree`,x:320.81,z:322.42,heading:.6},{kind:`tree`,x:310,z:340.81,heading:1.9},{kind:`tree`,x:339.19,z:340.81,heading:.6},{kind:`tree`,x:320.81,z:359.19,heading:1.9},{kind:`tree`,x:347,z:359.19,heading:.6},{kind:`tree`,x:339.19,z:377.58,heading:1.9},{kind:`fence`,x:394,z:9.6,heading:1.5708},{kind:`fence`,x:394,z:-9.6,heading:1.5708},{kind:`fence`,x:397.05,z:9.6,heading:1.5708},{kind:`fence`,x:397.05,z:-9.6,heading:1.5708},{kind:`fence`,x:400.1,z:9.6,heading:1.5708},{kind:`fence`,x:400.1,z:-9.6,heading:1.5708},{kind:`fence`,x:403.15,z:9.6,heading:1.5708},{kind:`fence`,x:403.15,z:-9.6,heading:1.5708},{kind:`fence`,x:406.2,z:9.6,heading:1.5708},{kind:`fence`,x:406.2,z:-9.6,heading:1.5708},{kind:`fence`,x:409.25,z:9.6,heading:1.5708},{kind:`fence`,x:409.25,z:-9.6,heading:1.5708},{kind:`fence`,x:412.3,z:9.6,heading:1.5708},{kind:`fence`,x:412.3,z:-9.6,heading:1.5708},{kind:`fence`,x:415.35,z:9.6,heading:1.5708},{kind:`fence`,x:415.35,z:-9.6,heading:1.5708},{kind:`fence`,x:418.4,z:9.6,heading:1.5708},{kind:`fence`,x:418.4,z:-9.6,heading:1.5708},{kind:`fence`,x:421.45,z:9.6,heading:1.5708},{kind:`fence`,x:421.45,z:-9.6,heading:1.5708},{kind:`fence`,x:424.5,z:9.6,heading:1.5708},{kind:`fence`,x:424.5,z:-9.6,heading:1.5708},{kind:`fence`,x:427.55,z:9.6,heading:1.5708},{kind:`fence`,x:427.55,z:-9.6,heading:1.5708},{kind:`fence`,x:430.6,z:9.6,heading:1.5708},{kind:`fence`,x:430.6,z:-9.6,heading:1.5708},{kind:`fence`,x:433.65,z:9.6,heading:1.5708},{kind:`fence`,x:433.65,z:-9.6,heading:1.5708},{kind:`fence`,x:436.7,z:9.6,heading:1.5708},{kind:`fence`,x:436.7,z:-9.6,heading:1.5708},{kind:`fence`,x:439.75,z:9.6,heading:1.5708},{kind:`fence`,x:439.75,z:-9.6,heading:1.5708},{kind:`fence`,x:442.8,z:9.6,heading:1.5708},{kind:`fence`,x:442.8,z:-9.6,heading:1.5708},{kind:`fence`,x:445.85,z:9.6,heading:1.5708},{kind:`fence`,x:445.85,z:-9.6,heading:1.5708},{kind:`fence`,x:448.9,z:9.6,heading:1.5708},{kind:`fence`,x:448.9,z:-9.6,heading:1.5708},{kind:`fence`,x:451.95,z:9.6,heading:1.5708},{kind:`fence`,x:451.95,z:-9.6,heading:1.5708},{kind:`fence`,x:455,z:9.6,heading:1.5708},{kind:`fence`,x:455,z:-9.6,heading:1.5708},{kind:`fence`,x:458.05,z:9.6,heading:1.5708},{kind:`fence`,x:458.05,z:-9.6,heading:1.5708},{kind:`fence`,x:461.1,z:9.6,heading:1.5708},{kind:`fence`,x:461.1,z:-9.6,heading:1.5708},{kind:`fence`,x:464.15,z:9.6,heading:1.5708},{kind:`fence`,x:464.15,z:-9.6,heading:1.5708},{kind:`fence`,x:467.2,z:9.6,heading:1.5708},{kind:`fence`,x:467.2,z:-9.6,heading:1.5708},{kind:`fence`,x:470.25,z:9.6,heading:1.5708},{kind:`fence`,x:470.25,z:-9.6,heading:1.5708},{kind:`fence`,x:473.3,z:9.6,heading:1.5708},{kind:`fence`,x:473.3,z:-9.6,heading:1.5708},{kind:`fence`,x:476.35,z:9.6,heading:1.5708},{kind:`fence`,x:476.35,z:-9.6,heading:1.5708},{kind:`fence`,x:479.4,z:9.6,heading:1.5708},{kind:`fence`,x:479.4,z:-9.6,heading:1.5708},{kind:`fence`,x:482.45,z:9.6,heading:1.5708},{kind:`fence`,x:482.45,z:-9.6,heading:1.5708},{kind:`fence`,x:485.5,z:9.6,heading:1.5708},{kind:`fence`,x:485.5,z:-9.6,heading:1.5708},{kind:`fence`,x:488.55,z:9.6,heading:1.5708},{kind:`fence`,x:488.55,z:-9.6,heading:1.5708},{kind:`fence`,x:491.6,z:9.6,heading:1.5708},{kind:`fence`,x:491.6,z:-9.6,heading:1.5708},{kind:`fence`,x:494.65,z:9.6,heading:1.5708},{kind:`fence`,x:494.65,z:-9.6,heading:1.5708},{kind:`fence`,x:497.7,z:9.6,heading:1.5708},{kind:`fence`,x:497.7,z:-9.6,heading:1.5708},{kind:`fence`,x:500.75,z:9.6,heading:1.5708},{kind:`fence`,x:500.75,z:-9.6,heading:1.5708},{kind:`fence`,x:503.8,z:9.6,heading:1.5708},{kind:`fence`,x:503.8,z:-9.6,heading:1.5708},{kind:`fence`,x:506.85,z:9.6,heading:1.5708},{kind:`fence`,x:506.85,z:-9.6,heading:1.5708},{kind:`fence`,x:509.9,z:9.6,heading:1.5708},{kind:`fence`,x:509.9,z:-9.6,heading:1.5708},{kind:`fence`,x:512.95,z:9.6,heading:1.5708},{kind:`fence`,x:512.95,z:-9.6,heading:1.5708},{kind:`fence`,x:516,z:9.6,heading:1.5708},{kind:`fence`,x:516,z:-9.6,heading:1.5708},{kind:`fence`,x:519.05,z:9.6,heading:1.5708},{kind:`fence`,x:519.05,z:-9.6,heading:1.5708},{kind:`fence`,x:522.1,z:9.6,heading:1.5708},{kind:`fence`,x:522.1,z:-9.6,heading:1.5708},{kind:`fence`,x:525.15,z:9.6,heading:1.5708},{kind:`fence`,x:525.15,z:-9.6,heading:1.5708},{kind:`fence`,x:528.2,z:9.6,heading:1.5708},{kind:`fence`,x:528.2,z:-9.6,heading:1.5708},{kind:`fence`,x:531.25,z:9.6,heading:1.5708},{kind:`fence`,x:531.25,z:-9.6,heading:1.5708},{kind:`fence`,x:534.3,z:9.6,heading:1.5708},{kind:`fence`,x:534.3,z:-9.6,heading:1.5708},{kind:`lamp`,x:400,z:10.8,heading:3.1416},{kind:`lamp`,x:400,z:-10.8},{kind:`lamp`,x:430,z:10.8,heading:3.1416},{kind:`lamp`,x:430,z:-10.8},{kind:`lamp`,x:460,z:10.8,heading:3.1416},{kind:`lamp`,x:460,z:-10.8},{kind:`lamp`,x:490,z:10.8,heading:3.1416},{kind:`lamp`,x:490,z:-10.8},{kind:`lamp`,x:520,z:10.8,heading:3.1416},{kind:`lamp`,x:520,z:-10.8},{kind:`billboard`,x:586,z:20,heading:3.1416},{kind:`billboard`,x:586,z:-20},{kind:`billboard`,x:-20,z:110,heading:3.1416},{kind:`billboard`,x:150,z:-90,heading:3.1416},{kind:`billboard`,x:-250,z:210,heading:3.1416},{kind:`billboard`,x:50,z:-190},{kind:`billboard`,x:-350,z:390}]};function Bu(e,t,n,r,i){let a=n-e,o=r-t,s=Math.hypot(a,o);return{x:(e+n)/2,z:(t+r)/2,hx:i,hz:s/2,angle:s>1e-9?Math.atan2(a,o):0}}function Vu(e,t,n,r,i,a){let o=i-n,s=a-r,c=o*o+s*s;if(c<1e-12)return Math.hypot(e-n,t-r);let l=((e-n)*o+(t-r)*s)/c;return l=l<0?0:l>1?1:l,Math.hypot(e-(n+o*l),t-(r+s*l))}function Hu(e){return{x:e.x,z:e.z,hx:e.hx,hz:e.hz,angle:0}}function Uu(e,t,n,r,i,a,o,s){let c=n-e,l=r-t,u=o-i,d=s-a,f=c*d-l*u;if(Math.abs(f)<1e-9)return null;let p=i-e,m=a-t,h=(p*d-m*u)/f,g=(p*l-m*c)/f;if(h<-1e-4||h>1.0001||g<-1e-4||g>1.0001)return null;let _=h<0?0:h>1?1:h;return{t:_,u:g<0?0:g>1?1:g,x:e+c*_,z:t+l*_}}function Wu(e,t,n,r,i,a,o,s){let c=n-e,l=r-t,u=o-i,d=s-a,f=Math.hypot(c,l),p=Math.hypot(u,d);if(f<1e-9||p<1e-9||Math.abs(c*d-l*u)>1e-6*f*p||Math.abs((i-e)*l-(a-t)*c)/f>.05)return!1;let m=c/f,h=l/f,g=f,_=(i-e)*m+(a-t)*h,v=(o-e)*m+(s-t)*h;return Math.min(g,Math.max(_,v))-Math.max(0,Math.min(_,v))>.5}function Gu(){return{plates:[],buildings:[],props:[],colliders:[]}}function Ku(e){e.plates.length=0,e.buildings.length=0,e.props.length=0,e.colliders.length=0}function qu(e,t){return e===`park`||e===`promenade`?t.colors.park:e===`parking`?t.colors.parking:t.colors.sidewalk}function Ju(e){return{kind:e.kind,x:e.x,z:e.z,heading:e.heading,scale:e.scale,variant:e.variant,collidable:gl(e.kind)!==void 0}}function Yu(e){let t=gl(e.kind);if(t)return{id:0,x:e.x,z:e.z,hx:t.hx,hz:t.hz,angle:e.heading}}function Xu(e,t,n,r){let i=t.rect;r.plates.push({x:i.x,z:i.z,w:i.hx*2,d:i.hz*2,color:n});for(let t=0;t<e.buildings.length;t+=1){let n=e.buildings[t],a=n.w*i.hx*2,o=n.d*i.hz*2,s=i.x+n.x*i.hx,c=i.z+n.z*i.hz;r.buildings.push({x:s,z:c,w:a,d:o,h:n.h,color:n.color,roofColor:n.roofColor}),r.colliders.push({id:0,x:s,z:c,hx:a/2,hz:o/2,angle:0})}for(let t=0;t<e.props.length;t+=1){let n=e.props[t],a=i.x+n.x*i.hx,o=i.z+n.z*i.hz;r.props.push({kind:n.kind,x:a,z:o,heading:n.heading,scale:n.scale,variant:n.variant,collidable:gl(n.kind)!==void 0});let s=gl(n.kind);s&&r.colliders.push({id:0,x:a,z:o,hx:s.hx,hz:s.hz,angle:n.heading})}return r}var Zu=1,Qu=[.25,.55,.8],$u=.05,ed=1e-4,td=.05;function nd(e,t,n,r,i){let a=e[t.from],o=e[t.to],s=X(n,0,1),c=o.x-a.x,l=o.z-a.z,u=X(Math.floor(r),0,t.lanes-1),d=t.laneOffsets[u]??0,f=t.length>1e-6?1/t.length:0,p=l*f,m=-c*f;return i.x=a.x+c*s+p*d,i.z=a.z+l*s+m*d,i}function rd(e,t,n){let r=Array(e);for(let t=0;t<e;t+=1)r[t]=[];for(let e=0;e<t.length;e+=1)r[t[e].from].push(t[e].to);let i=new Uint8Array(e),a=[n];i[n]=1;let o=1;for(let e=0;e<a.length;e+=1){let t=r[a[e]];for(let e=0;e<t.length;e+=1){let n=t[e];i[n]||(i[n]=1,o+=1,a.push(n))}}return{flags:i,count:o}}function id(e){let t=0,n=1/0;for(let r=0;r<e.length;r+=1){let i=e[r].x*e[r].x+e[r].z*e[r].z;i<n&&(n=i,t=r)}return t}function ad(e,t,n){let r=0,i=0;for(let e=0;e<n.length;e+=1)n[e].oneWay&&(r+=1);for(let e=0;e<t.length;e+=1)t[e].lights&&(i+=1);let a=id(t),o=rd(t.length,n,a),s={nodes:t.length,edges:n.length,oneWayEdges:r,lights:i,connected:o.count===t.length},c=[],l={x:0,z:0};for(let e=0;e<n.length;e+=1){let r=n[e];for(let e=0;e<Qu.length;e+=1)for(let n=0;n<r.lanes;n+=1)nd(t,r,Qu[e],n,l),c.push({x:l.x,z:l.z,heading:r.heading,tag:`car`})}return{seed:e,nodes:t,edges:n,spawnPoints:c,stats:s,nearestNode:(e,n)=>{let r=-1,i=1/0;for(let a=0;a<t.length;a+=1){let o=t[a].x-e,s=t[a].z-n,c=o*o+s*s;c<i&&(i=c,r=a)}return r},nearestEdge:(e,r)=>{let i=-1,a=1/0;for(let o=0;o<n.length;o+=1){let s=n[o],c=t[s.from],l=t[s.to],u=l.x-c.x,d=l.z-c.z,f=u*u+d*d,p=f>1e-9?X(((e-c.x)*u+(r-c.z)*d)/f,0,1):0,m=c.x+u*p-e,h=c.z+d*p-r,g=m*m+h*h;g<a&&(a=g,i=o)}return i},lanePoint:(e,r,i,a)=>{let o=n[e];return o?nd(t,o,r,i,a):(a.x=0,a.z=0,a)},edgeHeading:e=>n[e]?.heading??0,isConnected:()=>s.connected,toJSON:()=>od(e,t,n)}}function od(e,t,n){let r=[];for(let e=0;e<t.length;e+=1){let n=t[e];r.push({id:n.id,x:n.x,z:n.z,kind:n.kind,lights:n.lights,lightPhase:n.lightPhase})}let i=[];for(let e=0;e<n.length;e+=1){let t=n[e];i.push({from:t.from,to:t.to,lanes:t.lanes,speed:t.speed,oneWay:t.oneWay,arterial:t.arterial,laneWidth:t.laneWidth})}return{version:Zu,seed:e,nodes:r,edges:i}}function sd(e){let t=[];for(let n=0;n<e.roads.length;n+=1){let r=e.roads[n].points;for(let i=0;i+1<r.length;i+=1){let[a,o]=r[i],[s,c]=r[i+1],l=Math.hypot(s-a,c-o);if(l<td)throw Error(`RoadGraph: у дороги "${e.roads[n].id}" нулевой отрезок #${i}`);t.push({road:n,index:i,x1:a,z1:o,x2:s,z2:c,length:l})}}return t}function cd(e){let t=sd(e),n=t.map(e=>[{t:0,x:e.x1,z:e.z1},{t:1,x:e.x2,z:e.z2}]);for(let e=0;e<t.length;e+=1){let r=t[e];for(let i=e+1;i<t.length;i+=1){let a=t[i];if(r.road===a.road&&Math.abs(r.index-a.index)<=1)continue;let o=Uu(r.x1,r.z1,r.x2,r.z2,a.x1,a.z1,a.x2,a.z2);o&&(n[e].push({t:o.t,x:o.x,z:o.z}),n[i].push({t:o.u,x:o.x,z:o.z}))}}let r=[],i=new Map,a=(e,t)=>{let n=`${Math.round(e/$u)}:${Math.round(t/$u)}`,a=i.get(n);if(a!==void 0)return a;let o=r.length;return r.push({id:o,x:e,z:t,kind:`cross`}),i.set(n,o),o},o=[],s=[];for(let r=0;r<t.length;r+=1){let i=e.roads[t[r].road],c=n[r];c.sort((e,t)=>e.t-t.t);let l=[];for(let e=0;e<c.length;e+=1){let t=l[l.length-1];t&&Math.abs(c[e].t-t.t)<ed||l.push(c[e])}let u=i.width/(i.lanes*2),d=Array(i.lanes);for(let e=0;e<i.lanes;e+=1)d[e]=u*(e+.5);for(let e=0;e+1<l.length;e+=1){let t=l[e],n=l[e+1],r=a(t.x,t.z),c=a(n.x,n.z);if(r===c)continue;let f=n.x-t.x,p=n.z-t.z,m=Math.hypot(f,p);if(m<td)continue;let h=Math.atan2(f,p),g=Math.abs(f)>=Math.abs(p)?0:1,_=o.length;o.push({from:r,to:c,lanes:i.lanes,speed:i.speed,oneWay:i.oneWay,arterial:i.arterial,axis:g,length:m,laneWidth:u,laneOffsets:d,heading:h});let v=-1;i.oneWay||(v=o.length,o.push({from:c,to:r,lanes:i.lanes,speed:i.speed,oneWay:!1,arterial:i.arterial,axis:g,length:m,laneWidth:u,laneOffsets:d,heading:Math.atan2(-f,-p)})),s.push({a:r,b:c,axis:g,lanes:i.lanes,speed:i.speed,arterial:i.arterial,oneWay:i.oneWay,forward:_,reverse:v})}}let c=Array(r.length),l=new Int32Array(r.length);for(let e=0;e<r.length;e+=1)c[e]=new Set;for(let e=0;e<o.length;e+=1){let t=o[e];c[t.from].add(t.to),c[t.to].add(t.from),t.arterial&&(l[t.from]+=1,l[t.to]+=1)}for(let e=0;e<r.length;e+=1){let t=r[e],n=c[e].size;t.kind=n<=1?`dead`:n===3?`t`:`cross`;let i=n>=3&&l[e]>=2;t.lights=i,t.lightPhase=i?(Math.abs(Math.round(t.x))*7+Math.abs(Math.round(t.z))*13)%1e3/1e3:void 0}let u=id(r),d=rd(r.length,o,u);if(d.count!==r.length){for(let e=0;e<s.length;e+=1){let t=s[e];if(!t.oneWay)continue;let n=o[t.forward];n.oneWay=!1,o.push({from:n.to,to:n.from,lanes:n.lanes,speed:n.speed,oneWay:!1,arterial:n.arterial,axis:n.axis,length:n.length,laneWidth:n.laneWidth,laneOffsets:n.laneOffsets,heading:Math.atan2(r[n.from].x-r[n.to].x,r[n.from].z-r[n.to].z)}),t.oneWay=!1,t.reverse=o.length-1}if(d=rd(r.length,o,u),d.count!==r.length)throw Error(`RoadGraph: карта дала несвязный граф — проверьте дороги`)}return ad(e.seed,r,o)}function ld(e){return JSON.stringify(e.toJSON())}var ud=.05,dd=.6,fd=.05;function pd(e){throw Error(`CityMap: ${e}`)}function md(e,t,n,r){(Math.abs(e)>n+.01||Math.abs(t)>n+.01)&&pd(`${r} (${e}; ${t}) за границей карты ±${n}`)}function hd(e,t,n){e.hx>0&&e.hz>0||pd(`${n}: стороны должны быть положительными`),md(e.x,e.z,t,n),md(e.x-e.hx,e.z-e.hz,t,`${n} (угол)`),md(e.x+e.hx,e.z+e.hz,t,`${n} (угол)`)}function gd(e,t,n){return Hc(e,t,n)&&n.depth>ud}function _d(e){let t=[];for(let n=0;n<e.roads.length;n+=1){let r=e.roads[n];for(let e=0;e+1<r.points.length;e+=1){let[n,i]=r.points[e],[a,o]=r.points[e+1];t.push({rect:Bu(n,i,a,o,r.width/2),roadId:r.id})}}return t}function vd(e){let t=new Map;for(let n=0;n<e.prefabs.length;n+=1){let r=e.prefabs[n];t.has(r.id)&&pd(`префаб "${r.id}" описан дважды`),t.set(r.id,r)}return t}function yd(e){e.size>=400&&e.size<=4e3||pd(`size=${e.size}: ожидалось 400…4000 м`),e.chunkSize>=32&&e.chunkSize<=512||pd(`chunkSize=${e.chunkSize}: вне 32…512`),e.laneWidth>=2&&e.laneWidth<=5||pd(`laneWidth=${e.laneWidth}: вне 2…5`),Number.isInteger(e.size)||pd(`size должен быть целым числом метров`),Number.isInteger(e.chunkSize)||pd(`chunkSize должен быть целым числом метров`);let t=new Set;for(let n=0;n<e.districts.length;n+=1){let r=e.districts[n];t.has(r.id)&&pd(`район "${r.id}" описан дважды`),t.add(r.id)}let n=[`center`,`industrial`,`waterfront`];for(let e=0;e<n.length;e+=1)t.has(n[e])||pd(`в карте нет района "${n[e]}"`)}function bd(e){let t=e.size/2,n=new Set;for(let r=0;r<e.roads.length;r+=1){let i=e.roads[r];n.has(i.id)&&pd(`дорога "${i.id}" описана дважды`),n.add(i.id),i.points.length<2&&pd(`дорога "${i.id}": нужно минимум 2 точки`),i.width>=6&&i.width<=40||pd(`дорога "${i.id}": width вне 6…40 м`),i.speed>0||pd(`дорога "${i.id}": speed должен быть > 0`);for(let e=0;e+1<i.points.length;e+=1){let[n,r]=i.points[e],[a,o]=i.points[e+1];md(n,r,t,`дорога "${i.id}" точка ${e}`),md(a,o,t,`дорога "${i.id}" точка ${e+1}`),Math.hypot(a-n,o-r)<1&&pd(`дорога "${i.id}": отрезок #${e} короче 1 м`)}}for(let t=0;t<e.roads.length;t+=1){let n=e.roads[t];for(let r=t+1;r<e.roads.length;r+=1){let t=e.roads[r];for(let e=0;e+1<n.points.length;e+=1){let[r,i]=n.points[e],[a,o]=n.points[e+1];for(let e=0;e+1<t.points.length;e+=1){let[s,c]=t.points[e],[l,u]=t.points[e+1];Wu(r,i,a,o,s,c,l,u)&&pd(`дороги "${n.id}" и "${t.id}" наложены друг на друга`)}}}}let r={nx:0,nz:0,depth:0};for(let t=0;t<e.roads.length;t+=1){let n=e.roads[t];for(let t=0;t+1<n.points.length;t+=1){let[i,a]=n.points[t],[o,s]=n.points[t+1],c=Bu(i,a,o,s,n.width/2);for(let t=0;t<e.water.length;t+=1)gd(c,Hu(e.water[t]),r)&&n.kind!==`bridge`&&pd(`дорога "${n.id}" проходит по воде — разрешён только kind="bridge"`)}}let i=cd(e);i.stats.connected||pd(`дорожный граф несвязен (${i.stats.nodes} узлов): проверьте тупики и односторонние улицы`);for(let t=0;t<e.roads.length;t+=1){let n=e.roads[t];for(let r=t+1;r<e.roads.length;r+=1){let t=e.roads[r];for(let e=0;e+1<n.points.length;e+=1){let[r,a]=n.points[e],[o,s]=n.points[e+1];for(let e=0;e+1<t.points.length;e+=1){let[c,l]=t.points[e],[u,d]=t.points[e+1],f=Uu(r,a,o,s,c,l,u,d);if(!f)continue;let p=i.nodes[i.nearestNode(f.x,f.z)];(!p||Math.hypot(p.x-f.x,p.z-f.z)>.2)&&pd(`пересечение "${n.id}" и "${t.id}" в (${f.x.toFixed(1)}; ${f.z.toFixed(1)}) не стало узлом графа`)}}}}}function xd(e,t,n){let r=e.size/2,i={nx:0,nz:0,depth:0},a=new Set,o=[],s=Gu();for(let c=0;c<e.blocks.length;c+=1){let l=e.blocks[c];a.has(l.id)&&pd(`квартал "${l.id}" описан дважды`),a.add(l.id),hd(l.rect,r,`квартал "${l.id}"`);let u=n.get(l.prefab);u||pd(`квартал "${l.id}": нет префаба "${l.prefab}"`);for(let t=c+1;t<e.blocks.length;t+=1)gd(Hu(l.rect),Hu(e.blocks[t].rect),i)&&pd(`кварталы "${l.id}" и "${e.blocks[t].id}" пересекаются`);for(let t=0;t<e.water.length;t+=1)gd(Hu(l.rect),Hu(e.water[t]),i)&&pd(`квартал "${l.id}" заходит в воду`);for(let e=0;e<t.length;e+=1)gd(Hu(l.rect),t[e].rect,i)&&pd(`плита квартала "${l.id}" перекрывает дорогу "${t[e].roadId}"`);Ku(s),Xu(u,l,0,s);for(let n=0;n<s.buildings.length;n+=1){let a=s.buildings[n],c=`квартал "${l.id}", здание #${n}`,u={x:a.x,z:a.z,hx:a.w/2,hz:a.d/2,angle:0};(Math.abs(a.x-l.rect.x)+a.w/2>l.rect.hx+.01||Math.abs(a.z-l.rect.z)+a.d/2>l.rect.hz+.01)&&pd(`${c} выходит за плиту квартала`),md(a.x,a.z,r,c);for(let e=0;e<t.length;e+=1)gd(u,t[e].rect,i)&&pd(`${c} стоит на дороге "${t[e].roadId}"`);for(let t=0;t<e.water.length;t+=1)gd(u,Hu(e.water[t]),i)&&pd(`${c} стоит в воде`);for(let e=0;e<o.length;e+=1)gd(u,o[e].rect,i)&&pd(`${c} пересекается с ${o[e].id}`);o.push({rect:u,id:c})}for(let e=0;e<s.colliders.length;e+=1){let n=s.colliders[e],r={x:n.x,z:n.z,hx:n.hx,hz:n.hz,angle:n.angle??0};for(let e=0;e<t.length;e+=1)gd(r,t[e].rect,i)&&pd(`объект квартала "${l.id}" стоит на дороге "${t[e].roadId}"`)}}}function Sd(e,t,n){let r=e.size/2,i={nx:0,nz:0,depth:0};for(let a=0;a<e.props.length;a+=1){let o=e.props[a],s=`пропс "${o.kind}" #${a}`;md(o.x,o.z,r,s);let c=Yu(o);if(!c)continue;let l={x:c.x,z:c.z,hx:c.hx,hz:c.hz,angle:c.angle??0};n.push(l);for(let e=0;e<t.length;e+=1)gd(l,t[e].rect,i)&&pd(`${s} стоит на дороге "${t[e].roadId}"`)}}function Cd(e,t,n){for(let r=0;r<e.roads.length;r+=1){let i=e.roads[r];for(let e=0;e+1<i.points.length;e+=1){let[r,a]=i.points[e],[o,s]=i.points[e+1];if(Vu(t,n,r,a,o,s)<=i.width/2+fd)return!0}}return!1}function wd(e,t){let n=e.size/2,r={nx:0,nz:0,depth:0},i=e.spawns.player;md(i.x,i.z,n,`старт игрока`),Cd(e,i.x,i.z)||pd(`старт игрока не на проезжей части`);let a=[];for(let t=0;t<e.spawns.cars.length;t+=1){let n=e.spawns.cars[t];a.push({x:n.x,z:n.z,tag:`машина`,index:t})}for(let t=0;t<e.spawns.peds.length;t+=1){let n=e.spawns.peds[t];a.push({x:n.x,z:n.z,tag:`пешеход`,index:t})}for(let t=0;t<e.spawns.cops.length;t+=1){let n=e.spawns.cops[t];a.push({x:n.x,z:n.z,tag:`коп`,index:t})}for(let i=0;i<a.length;i+=1){let o=a[i],s=`спавн ${o.tag} #${o.index}`;md(o.x,o.z,n,s),o.tag===`машина`&&!Cd(e,o.x,o.z)&&pd(`${s} (${o.x}; ${o.z}) не на проезжей части`);for(let e=0;e<t.length;e+=1)Vc(o.x,o.z,dd,t[e],r)&&pd(`${s} (${o.x}; ${o.z}) стоит в препятствии`)}for(let t=0;t<e.landmarks.length;t+=1){let r=e.landmarks[t];md(r.x,r.z,n,`ориентир "${r.id}"`),r.radius>0||pd(`ориентир "${r.id}": radius должен быть > 0`)}for(let t=0;t<e.missions.length;t+=1){let r=e.missions[t];md(r.x,r.z,n,`миссия "${r.id}"`),r.radius>0||pd(`миссия "${r.id}": radius должен быть > 0`)}}function Td(e){yd(e);let t=e.size/2;for(let n=0;n<e.water.length;n+=1)hd(e.water[n],t,`вода #${n}`);let n=_d(e),r=vd(e);xd(e,n,r);let i=[];Sd(e,n,i);let a=Gu();for(let t=0;t<e.blocks.length;t+=1){let n=e.blocks[t],o=r.get(n.prefab);if(o){Ku(a),Xu(o,n,0,a);for(let e=0;e<a.colliders.length;e+=1){let t=a.colliders[e];i.push({x:t.x,z:t.z,hx:t.hx,hz:t.hz,angle:t.angle??0})}}}bd(e),wd(e,i)}var Ed={city:zu},Dd=`city`,Od=[`center`,`industrial`,`waterfront`],kd=[`build`,`park`,`parking`,`promenade`],Ad=[`ring`,`arterial`,`street`,`boulevard`,`bridge`],jd=[`garage`,`police`,`hospital`,`stadium`,`mall`,`docks`,`bridge`],Md=[`pickup`,`delivery`,`race`];function Nd(e,t){throw Error(`CityMap: ${e}: ${t}`)}function Pd(e,t){return(typeof e!=`object`||!e||Array.isArray(e))&&Nd(t,`ожидался объект`),e}function Fd(e,t){return Array.isArray(e)||Nd(t,`ожидался массив`),e}function Id(e,t){return(typeof e!=`string`||e.length===0)&&Nd(t,`ожидалась непустая строка`),e}function Ld(e,t){return typeof e==`number`&&Number.isFinite(e)||Nd(t,`ожидалось число`),e}function Rd(e,t,n){return e===void 0?n:Ld(e,t)}function zd(e,t,n){return e===void 0?n:(typeof e!=`boolean`&&Nd(t,`ожидалось true/false`),e)}function Bd(e,t){if(typeof e==`number`&&Number.isFinite(e))return e>>>0;if(typeof e==`string`){let n=e.trim();return/^#[0-9a-fA-F]{6}$/.test(n)||Nd(t,`неверный цвет "${e}"`),Number.parseInt(n.slice(1),16)>>>0}return Nd(t,`ожидался цвет "#rrggbb"`)}function Vd(e,t,n){let r=Id(e,n);for(let e=0;e<t.length;e+=1)if(t[e]===r)return t[e];return Nd(n,`неизвестное значение "${r}" (допустимо: ${t.join(`, `)})`)}function Hd(e,t){let n=Pd(e,t);return{x:Ld(n.x,`${t}.x`),z:Ld(n.z,`${t}.z`),hx:Ld(n.hx,`${t}.hx`),hz:Ld(n.hz,`${t}.hz`)}}function Ud(e,t){let n=Pd(e,t);return{id:Vd(n.id,Od,`${t}.id`),name:Id(n.name,`${t}.name`),bounds:Hd(n.bounds,`${t}.bounds`)}}function Wd(e,t,n){let r=Pd(e,t),i=Fd(r.points,`${t}.points`).map((e,n)=>{let r=Fd(e,`${t}.points[${n}]`);return r.length!==2&&Nd(`${t}.points[${n}]`,`ожидалась пара [x, z]`),[Ld(r[0],`${t}.points[${n}][0]`),Ld(r[1],`${t}.points[${n}][1]`)]}),a=Ld(r.width,`${t}.width`),o=Math.min(3,Math.max(1,Math.round(a/(2*n))));return{id:Id(r.id,`${t}.id`),kind:Vd(r.kind,Ad,`${t}.kind`),points:i,width:a,speed:Ld(r.speed,`${t}.speed`),arterial:zd(r.arterial,`${t}.arterial`,!1),oneWay:zd(r.oneWay,`${t}.oneWay`,!1),lanes:o}}function Gd(e,t){let n=Pd(e,t),r=Id(n.kind,`${t}.kind`);r in ml||Nd(`${t}.kind`,`неизвестный пропс "${r}"`);let i=r,a=ml[i].variants.length,o=Math.trunc(Rd(n.variant,`${t}.variant`,0));return(o<0||o>=a)&&Nd(`${t}.variant`,`у "${i}" ${a} вариантов`),{kind:i,x:Ld(n.x,`${t}.x`),z:Ld(n.z,`${t}.z`),heading:Rd(n.heading,`${t}.heading`,0),variant:o,scale:Rd(n.scale,`${t}.scale`,1)}}function Kd(e,t){let n=Pd(e,t),r=Fd(n.buildings??[],`${t}.buildings`).map((e,n)=>{let r=Pd(e,`${t}.buildings[${n}]`),i=`${t}.buildings[${n}]`;return{x:Ld(r.x,`${i}.x`),z:Ld(r.z,`${i}.z`),w:Ld(r.w,`${i}.w`),d:Ld(r.d,`${i}.d`),h:Ld(r.h,`${i}.h`),color:Bd(r.color,`${i}.color`),roofColor:Bd(r.roof,`${i}.roof`)}}),i=Fd(n.props??[],`${t}.props`).map((e,n)=>Gd(e,`${t}.props[${n}]`));return{id:Id(n.id,`${t}.id`),plate:n.plate===void 0?void 0:Bd(n.plate,`${t}.plate`),buildings:r,props:i}}function qd(e,t){let n=Pd(e,t);return{id:Id(n.id,`${t}.id`),kind:Vd(n.kind,jd,`${t}.kind`),name:Id(n.name,`${t}.name`),x:Ld(n.x,`${t}.x`),z:Ld(n.z,`${t}.z`),radius:Ld(n.radius,`${t}.radius`)}}function Jd(e,t){let n=Pd(e,t);return{id:Id(n.id,`${t}.id`),kind:Vd(n.kind,Md,`${t}.kind`),name:Id(n.name,`${t}.name`),x:Ld(n.x,`${t}.x`),z:Ld(n.z,`${t}.z`),radius:Ld(n.radius,`${t}.radius`)}}function Yd(e,t){let n=Pd(e,t);return{x:Ld(n.x,`${t}.x`),z:Ld(n.z,`${t}.z`),heading:Rd(n.heading,`${t}.heading`,0)}}function Xd(e,t){return e===void 0?[]:Fd(e,t).map((e,n)=>Yd(e,`${t}[${n}]`))}function Zd(e,t){let n=Pd(e,t);return{player:Yd(n.player,`${t}.player`),cars:Xd(n.cars,`${t}.cars`),peds:Xd(n.peds,`${t}.peds`),cops:Xd(n.cops,`${t}.cops`)}}function Qd(e,t=`map`){let n=Pd(e,t),r=Ld(n.version,`${t}.version`);r!==1&&Nd(`${t}.version`,`неподдерживаемая версия ${r}`);let i=Ld(n.laneWidth,`${t}.laneWidth`),a=Fd(n.prefabs,`${t}.prefabs`).map((e,n)=>Kd(e,`${t}.prefabs[${n}]`)),o=Fd(n.blocks,`${t}.blocks`).map((e,n)=>{let r=Pd(e,`${t}.blocks[${n}]`),i=`${t}.blocks[${n}]`;return{id:Id(r.id,`${i}.id`),rect:Hd(r.rect,`${i}.rect`),district:Vd(r.district,Od,`${i}.district`),kind:Vd(r.kind,kd,`${i}.kind`),prefab:Id(r.prefab,`${i}.prefab`)}});return{version:1,id:Id(n.id,`${t}.id`),name:Id(n.name,`${t}.name`),seed:Ld(n.seed,`${t}.seed`)>>>0,size:Ld(n.size,`${t}.size`),chunkSize:Ld(n.chunkSize,`${t}.chunkSize`),laneWidth:i,districts:Fd(n.districts,`${t}.districts`).map((e,n)=>Ud(e,`${t}.districts[${n}]`)),water:Fd(n.water??[],`${t}.water`).map((e,n)=>Hd(e,`${t}.water[${n}]`)),roads:Fd(n.roads,`${t}.roads`).map((e,n)=>Wd(e,`${t}.roads[${n}]`,i)),prefabs:a,blocks:o,landmarks:Fd(n.landmarks??[],`${t}.landmarks`).map((e,n)=>qd(e,`${t}.landmarks[${n}]`)),missions:Fd(n.missions??[],`${t}.missions`).map((e,n)=>Jd(e,`${t}.missions[${n}]`)),spawns:Zd(n.spawns,`${t}.spawns`),props:Fd(n.props??[],`${t}.props`).map((e,n)=>Gd(e,`${t}.props[${n}]`))}}function $d(e=Dd){let t=Ed[e];if(!t)throw Error(`CityMap: неизвестная карта "${e}" (доступно: ${Object.keys(Ed).join(`, `)})`);let n=Qd(t,e);return Td(n),n}var ef=64,tf=128;function nf(e,t){return(e+ef)*tf+(t+ef)}function rf(e){return Math.floor(e/tf)-ef}function af(e){return e%tf-ef}function of(e,t){return Math.floor(e/t)}function sf(e,t,n,r){let i=new Set,a=[],o=n.nodes.length;for(let e=0;e<n.edges.length;e+=1){let t=n.edges[e],r=Math.min(t.from,t.to),s=Math.max(t.from,t.to),c=r*o+s;if(i.has(c))continue;i.add(c);let l=n.nodes[t.from],u=n.nodes[t.to];a.push({x1:l.x,z1:l.z,x2:u.x,z2:u.z,width:t.laneWidth*t.lanes*2,arterial:t.arterial})}let s=[],c=[];for(let e=0;e<t.length;e+=1){let n=t[e];s.push({x:n.x,z:n.z,hx:n.hx,hz:n.hz,district:n.district,kind:n.kind}),(n.kind===`park`||n.kind===`promenade`)&&c.push({x:n.x,z:n.z,hx:n.hx,hz:n.hz})}return{bounds:e,roads:a,blocks:s,water:r,parks:c}}function cf(e,t,n,r){let i=e*n,a=t*n,o=i+n,s=a+n,c=[];for(let e=0;e<r.roads.length;e+=1){let t=r.roads[e],n=t.width/2,l=Math.min(t.x1,t.x2)-n,u=Math.max(t.x1,t.x2)+n,d=Math.min(t.z1,t.z2)-n,f=Math.max(t.z1,t.z2)+n;u<i||l>o||f<a||d>s||c.push(t)}let l=[];for(let e=0;e<r.blocks.length;e+=1){let t=r.blocks[e];t.x<i||t.x>=o||t.z<a||t.z>=s||l.push(t)}let u=[];for(let e=0;e<r.water.length;e+=1){let t=r.water[e];t.x+t.hx<i||t.x-t.hx>o||t.z+t.hz<a||t.z-t.hz>s||u.push(t)}return{cx:e,cz:t,minX:i,minZ:a,maxX:o,maxZ:s,roads:c,blocks:l,water:u}}function lf(e,t,n,r,i){let a=i(),o=nf(t,n),s=e.chunkBlocks.get(o),c=Gu(),l=[],u=[],d=[],f=[];if(s)for(let t=0;t<s.length;t+=1){let n=e.blocks[s[t]],r=e.prefabs.get(n.prefab);if(r){Ku(c),Xu(r,n,r.plate??qu(n.kind,e.config),c);for(let e=0;e<c.plates.length;e+=1)l.push(c.plates[e]);for(let e=0;e<c.buildings.length;e+=1)u.push(c.buildings[e]);for(let e=0;e<c.props.length;e+=1)d.push(c.props[e]);for(let e=0;e<c.colliders.length;e+=1)f.push(c.colliders[e])}}let p=e.chunkProps.get(o);if(p)for(let e=0;e<p.length;e+=1)d.push(p[e]);let m=e.chunkPropColliders.get(o);if(m)for(let e=0;e<m.length;e+=1)f.push(m[e]);for(let e=0;e<f.length;e+=1)f[e].id=r();let h=cf(t,n,e.chunkSize,e.minimap),g=[];for(let e=0;e<l.length;e+=1){let t=l[e];g.push({x:t.x,z:t.z,hx:t.w/2,hz:t.d/2})}let _=[];for(let e=0;e<h.blocks.length;e+=1){let t=h.blocks[e].district;_.includes(t)||_.push(t)}let v=i()-a;return{cx:t,cz:n,colliders:f,plates:l,buildings:u,props:d,roads:h.roads,sidewalks:g,water:h.water,districts:_,minimap:h,renderRef:o+1,genMs:v}}var uf=class{layout;hash;now;radius;hysteresis;maxPerUpdate;minCx;maxCx;minCz;maxCz;chunks=new Map;active=[];queue=[];removeBuffer=[];focusCx=NaN;focusCz=NaN;nextId=1;rev=0;genLast=0;genMax=0;generatedCount=0;generatedTotal=0;updateMs=0;constructor(e,t,n){this.layout=e,this.hash=t,this.now=n,this.radius=Math.max(0,Math.floor(e.config.streamRadius)),this.hysteresis=Math.max(0,Math.floor(e.config.streamHysteresis)),this.maxPerUpdate=Math.max(1,Math.floor(e.config.maxChunksPerUpdate));let r=e.chunkSize;this.minCx=Math.floor(e.bounds.minX/r),this.maxCx=Math.ceil(e.bounds.maxX/r)-1,this.minCz=Math.floor(e.bounds.minZ/r),this.maxCz=Math.ceil(e.bounds.maxZ/r)-1}get activeChunks(){return this.active}get revision(){return this.rev}get loaded(){return this.chunks.size}get pending(){return this.queue.length}get genLastMs(){return this.genLast}get genMaxMs(){return this.genMax}get genCount(){return this.generatedCount}get genTotalMs(){return this.generatedTotal}get lastUpdateMs(){return this.updateMs}allocStaticId(){let e=this.nextId;return this.nextId+=1,e}getChunk(e,t){return this.chunks.get(nf(e,t))}update(e,t){let n=this.now(),r=this.clampX(of(e,this.layout.chunkSize)),i=this.clampZ(of(t,this.layout.chunkSize)),a=!1;(r!==this.focusCx||i!==this.focusCz)&&(this.focusCx=r,this.focusCz=i,this.rebuildQueue(r,i),a=this.unloadFar(r,i)||a);let o=0;for(;this.queue.length>0&&o<this.maxPerUpdate;){let e=this.queue.shift();if(e===void 0)break;this.chunks.has(e)||(this.createChunk(e),o+=1,a=!0)}a&&this.refreshActive(),this.updateMs=this.now()-n}prefetch(e,t){let n=this.now(),r=this.clampX(of(e,this.layout.chunkSize)),i=this.clampZ(of(t,this.layout.chunkSize));this.focusCx=r,this.focusCz=i,this.rebuildQueue(r,i),this.unloadFar(r,i);let a=!1;for(;this.queue.length>0;){let e=this.queue.shift();if(e===void 0)break;this.chunks.has(e)||(this.createChunk(e),a=!0)}return a&&this.refreshActive(),this.updateMs=this.now()-n,this.updateMs}unloadAll(){for(let e of this.chunks.values())for(let t=0;t<e.colliders.length;t+=1)this.hash.remove(e.colliders[t]);this.chunks.clear(),this.queue.length=0,this.active.length=0,this.rev+=1}createChunk(e){let t=this.now(),n=rf(e),r=af(e),i=lf(this.layout,n,r,()=>this.allocStaticId(),this.now);for(let e=0;e<i.colliders.length;e+=1)this.hash.insert(i.colliders[e]);this.chunks.set(e,i);let a=this.now()-t;this.genLast=a,a>this.genMax&&(this.genMax=a),this.generatedCount+=1,this.generatedTotal+=a}rebuildQueue(e,t){this.queue.length=0;let n=this.radius;for(let r=-n;r<=n;r+=1){let i=t+r;if(!(i<this.minCz||i>this.maxCz))for(let t=-n;t<=n;t+=1){let n=e+t;if(n<this.minCx||n>this.maxCx)continue;let r=nf(n,i);this.chunks.has(r)||this.queue.push(r)}}let r=e,i=t;this.queue.sort((e,t)=>{let n=rf(e)-r,a=af(e)-i,o=rf(t)-r,s=af(t)-i;return n*n+a*a-(o*o+s*s)})}unloadFar(e,t){let n=this.radius+this.hysteresis;this.removeBuffer.length=0;for(let r of this.chunks){let i=r[1],a=Math.abs(i.cx-e),o=Math.abs(i.cz-t);Math.max(a,o)>n&&this.removeBuffer.push(r[0])}if(this.removeBuffer.length===0)return!1;for(let e=0;e<this.removeBuffer.length;e+=1){let t=this.removeBuffer[e],n=this.chunks.get(t);if(n){for(let e=0;e<n.colliders.length;e+=1)this.hash.remove(n.colliders[e]);this.chunks.delete(t)}}return!0}refreshActive(){this.active.length=0;for(let e of this.chunks.values())this.active.push(e);this.rev+=1}clampX(e){return Math.min(this.maxCx,Math.max(this.minCx,e))}clampZ(e){return Math.min(this.maxCz,Math.max(this.minCz,e))}};function df(e,t,n){let r=e.get(t);r||(r=[],e.set(t,r)),r.push(n)}function ff(e,t){if(e.chunkSize!==t.chunkSize)throw Error(`CityLayout: chunkSize карты (${e.chunkSize}) не совпадает с конфигом (${t.chunkSize})`);let n=e.size/2,r={minX:-n,minZ:-n,maxX:n,maxZ:n},i=e.chunkSize,a=new Map;for(let t=0;t<e.prefabs.length;t+=1)a.set(e.prefabs[t].id,e.prefabs[t]);let o=e.blocks,s=cd(e),c=e.water.map(e=>({x:e.x,z:e.z,hx:e.hx,hz:e.hz})),l=sf(r,o.map(e=>({x:e.rect.x,z:e.rect.z,hx:e.rect.hx,hz:e.rect.hz,district:e.district,kind:e.kind})),s,c),u=new Map;for(let e=0;e<o.length;e+=1){let t=o[e];df(u,nf(of(t.rect.x,i),of(t.rect.z,i)),e)}let d=new Map,f=new Map;for(let t=0;t<e.props.length;t+=1){let n=e.props[t],r=nf(of(n.x,i),of(n.z,i));df(d,r,Ju(n));let a=Yu(n);a&&df(f,r,a)}let p=e.spawns.player,m={x:p.x,z:p.z,heading:p.heading,tag:`car`},h=[];for(let t=0;t<e.spawns.cars.length;t+=1){let n=e.spawns.cars[t];h.push({x:n.x,z:n.z,heading:n.heading,tag:`car`})}for(let t=0;t<e.spawns.peds.length;t+=1){let n=e.spawns.peds[t];h.push({x:n.x,z:n.z,heading:n.heading,tag:`ped`})}for(let t=0;t<e.spawns.cops.length;t+=1){let n=e.spawns.cops[t];h.push({x:n.x,z:n.z,heading:n.heading,tag:`cop`})}return{config:t,map:e,seed:e.seed,bounds:r,chunkSize:i,blocks:o,prefabs:a,roadGraph:s,minimap:l,water:c,chunkBlocks:u,chunkProps:d,chunkPropColliders:f,defaultSpawn:m,extraSpawns:h}}var pf=1e3;function mf(e){return Math.round(e*pf)}function hf(e){let t=[`m|${e.map.id}|${mf(e.map.size)}`],n=Gu(),r=e.blocks.slice().sort((e,t)=>e.id<t.id?-1:+(e.id>t.id));for(let i=0;i<r.length;i+=1){let a=r[i],o=e.prefabs.get(a.prefab);if(!o)throw Error(`CityLayout: у квартала "${a.id}" нет префаба "${a.prefab}"`);t.push(`b|${a.id}|${mf(a.rect.x)}|${mf(a.rect.z)}|${mf(a.rect.hx)}|${mf(a.rect.hz)}|${a.district}|${a.kind}|${a.prefab}`),Ku(n),Xu(o,a,o.plate??qu(a.kind,e.config),n);for(let e=0;e<n.plates.length;e+=1){let r=n.plates[e];t.push(`p|${mf(r.x)}|${mf(r.z)}|${mf(r.w)}|${mf(r.d)}|${r.color}`)}for(let e=0;e<n.buildings.length;e+=1){let r=n.buildings[e];t.push(`s|${mf(r.x)}|${mf(r.z)}|${mf(r.w)}|${mf(r.d)}|${mf(r.h)}|${r.color}|${r.roofColor}`)}for(let e=0;e<n.props.length;e+=1){let r=n.props[e];t.push(`r|${r.kind}|${mf(r.x)}|${mf(r.z)}|${mf(r.heading)}|${mf(r.scale)}|${r.variant}`)}}for(let n=0;n<e.roadGraph.nodes.length;n+=1){let r=e.roadGraph.nodes[n];t.push(`n|${r.id}|${mf(r.x)}|${mf(r.z)}|${r.kind}|${+!!r.lights}|${r.lightPhase===void 0?``:mf(r.lightPhase)}`)}for(let n=0;n<e.roadGraph.edges.length;n+=1){let r=e.roadGraph.edges[n];t.push(`e|${r.from}|${r.to}|${r.lanes}|${mf(r.speed)}|${+!!r.oneWay}|${+!!r.arterial}`)}for(let n=0;n<e.water.length;n+=1){let r=e.water[n];t.push(`w|${mf(r.x)}|${mf(r.z)}|${mf(r.hx)}|${mf(r.hz)}`)}t.sort();let i=2166136261;for(let e=0;e<t.length;e+=1){let n=t[e];for(let e=0;e<n.length;e+=1)i^=n.charCodeAt(e),i=Math.imul(i,16777619)}return i>>>0}function gf(e){let t=Gu(),n=0;for(let r=0;r<e.blocks.length;r+=1){let i=e.blocks[r],a=e.prefabs.get(i.prefab);a&&(Ku(t),Xu(a,i,0,t),n+=t.buildings.length)}let r=e.map.props.length;for(let t=0;t<e.blocks.length;t+=1){let n=e.prefabs.get(e.blocks[t].prefab);n&&(r+=n.props.length)}return{blocks:e.blocks.length,roads:e.map.roads.length,landmarks:e.map.landmarks.length,nodes:e.roadGraph.nodes.length,edges:e.roadGraph.edges.length,lights:e.roadGraph.stats.lights,buildings:n,props:r}}var _f=[-14,0,14];function vf(e){let t=[];for(let n=0;n<e.roadGraph.spawnPoints.length;n+=1)t.push(e.roadGraph.spawnPoints[n]);for(let n=0;n<e.extraSpawns.length;n+=1)t.push(e.extraSpawns[n]);for(let n=0;n<e.blocks.length;n+=1){let r=e.blocks[n];if(r.kind===`park`)continue;let i=r.rect.hx-1.6,a=r.rect.hz-1.6;if(!(i<3||a<3))for(let e=0;e<4;e+=1)for(let n=0;n<_f.length;n+=1){let o=_f[n],s=r.rect.x,c=r.rect.z,l=0;e===0?(s+=Math.min(Math.abs(o),i)*Math.sign(o||1),c-=a,l=Math.PI/2):e===1?(s+=Math.min(Math.abs(o),i)*Math.sign(o||1),c+=a,l=-Math.PI/2):e===2?(s-=i,c+=Math.min(Math.abs(o),a)*Math.sign(o||1),l=0):(s+=i,c+=Math.min(Math.abs(o),a)*Math.sign(o||1),l=Math.PI),t.push({x:s,z:c,heading:l,tag:`ped`})}}for(let n=0;n<e.roadGraph.nodes.length;n+=1){let r=e.roadGraph.nodes[n];r.lights&&t.push({x:r.x+11,z:r.z+11,heading:Math.PI,tag:`cop`})}return t}var yf=.6;function bf(e,t,n){let r=e.roads.filter(e=>e.kind===`bridge`);for(let i of e.water){let e=[{lo:i.z-i.hz,hi:i.z+i.hz}];for(let t of r){let n=t.points[0][1],r=t.width/2+1,i=[];for(let t of e)n+r<=t.lo||n-r>=t.hi?i.push(t):(t.lo<n-r&&i.push({lo:t.lo,hi:n-r}),t.hi>n+r&&i.push({lo:n+r,hi:t.hi}));e=i}for(let r of e){let e=(r.hi-r.lo)/2;e<.5||t.insert({id:n.allocStaticId(),x:i.x,z:(r.lo+r.hi)/2,hx:i.hx,hz:e,angle:0})}}}function xf(){return typeof performance>`u`?Date.now():performance.now()}function Sf(e,t,n={}){let r=ff(e,t),i=n.hash??new ul(Ql.spatialCellSize),a=new uf(r,i,n.now??xf),o=vf(r);bf(e,i,a);let s=[],c=-1,l=0,u=!1,d=null,f={chunksLoaded:0,chunksPending:0,genLastMs:0,genMaxMs:0,genCount:0,genTotalMs:0,updateMs:0,colliders:0,spawnPoints:o.length,revision:0},p=[],m={nx:0,nz:0,depth:0},h=()=>{if(a.revision===c)return;c=a.revision,s.length=0;let e=a.activeChunks;for(let t=0;t<e.length;t+=1)s.push(e[t].minimap)},g=()=>{f.chunksLoaded=a.loaded,f.chunksPending=a.pending,f.genLastMs=a.genLastMs,f.genMaxMs=a.genMaxMs,f.genCount=a.genCount,f.genTotalMs=a.genTotalMs,f.updateMs=a.lastUpdateMs,f.colliders=i.size,f.revision=a.revision},_=(e,t)=>{i.queryCircle(e,t,yf+Ql.collisionSkin,p);for(let n=0;n<p.length;n+=1)if(Vc(e,t,yf,p[n],m))return!1;return!0},v=()=>(u||=(l=hf(r),!0),l);return{mapId:e.id,map:e,seed:e.seed,bounds:r.bounds,chunkSize:r.chunkSize,config:t,roadGraph:r.roadGraph,minimap:r.minimap,defaultSpawn:r.defaultSpawn,colliders:i,get minimapTiles(){return h(),s},get activeChunks(){return a.activeChunks},get revision(){return a.revision},get layoutHash(){return v()},get info(){return d||=gf(r),d},get stats(){return g(),f},update(e,t){a.update(e,t),h()},prefetch(e,t){let n=a.prefetch(e,t);return h(),n},getChunk(e,t){return a.getChunk(e,t)},queryColliders(e,t){return i.queryRect(e.x,e.z,e.hx,e.hz,t)},querySpawnPoints(e,t,n,r,i){i.length=0;let a=n*n;for(let n=0;n<o.length;n+=1){let s=o[n];if(s.tag!==r)continue;let c=s.x-e,l=s.z-t;c*c+l*l>a||_(s.x,s.z)&&i.push(s)}return i},computeLayoutHash(){return v()},allocStaticId(){return a.allocStaticId()},unloadAll(){a.unloadAll(),h()}}}var Cf=.5;function wf(){return{drawCalls:0,triangles:0,speedKmh:0,colliders:0,movingColliders:0,entities:0,overrun:0,debtMs:0,logicMs:0,logicMaxMs:0,physMaxMs:0,chunks:0,chunkGenMaxMs:0,chunkGenLastMs:0,worldUpdateMs:0,mapId:``,roads:0,blocks:0,landmarks:0,seed:0,layoutHash:0,showWorld:!1,stressActive:!1,vehicles:0,targetLabel:``,playerMode:``,vehicleHp:0}}var Tf=class{element;frames=0;elapsed=0;frameMsSum=0;logicMsSum=0;constructor(e){this.element=e}update(e,t){if(this.frames+=1,this.elapsed+=e,this.frameMsSum+=e*1e3,this.logicMsSum+=t.logicMs,this.elapsed<Cf||!this.element)return;let n=this.frames/this.elapsed,r=this.frameMsSum/this.frames,i=this.logicMsSum/this.frames,a=`fps ${Math.round(n)}   frame ${r.toFixed(1)} ms   logic ${i.toFixed(2)} ms (max ${t.logicMaxMs.toFixed(2)})   phys max ${t.physMaxMs.toFixed(2)} ms   speed ${Math.round(t.speedKmh)} km/h\nvehicles ${t.vehicles}   target ${t.targetLabel} (${t.playerMode})   hp ${Math.round(t.vehicleHp)}%\ndraw calls ${t.drawCalls}   tris ${(t.triangles/1e3).toFixed(1)}k   colliders ${t.colliders} (dyn ${t.movingColliders})   entities ${t.entities}\noverrun ${t.overrun} steps   debt ${t.debtMs.toFixed(0)} ms`;if(t.showWorld){let e=t.layoutHash>>>0;a+=`\nmap ${t.mapId}   roads ${t.roads}   blocks ${t.blocks}   landmarks ${t.landmarks}\nchunks ${t.chunks}   gen max ${t.chunkGenMaxMs.toFixed(1)} ms   last ${t.chunkGenLastMs.toFixed(1)} ms   world ${t.worldUpdateMs.toFixed(2)} ms\nseed ${t.seed}   layout ${e.toString(16).padStart(8,`0`)}`}t.stressActive&&(a+=`   stress on`),this.element.textContent=a,this.frames=0,this.elapsed=0,this.frameMsSum=0,this.logicMsSum=0}},Ef=`★`,Df=`☆`,Of=2.4;function kf(e){if(!e)return{update:()=>void 0,notify:()=>void 0,dispose:()=>void 0};let t=document.createElement(`div`);t.id=`life-hud`,t.style.position=`absolute`,t.style.right=`12px`,t.style.top=`12px`,t.style.display=`flex`,t.style.flexDirection=`column`,t.style.alignItems=`flex-end`,t.style.gap=`4px`,t.style.fontSize=`13px`,t.style.fontVariantNumeric=`tabular-nums`,t.style.color=`#e6edf3`;let n=()=>{let e=document.createElement(`div`);return e.style.padding=`4px 10px`,e.style.borderRadius=`8px`,e.style.background=`rgba(13, 17, 23, 0.72)`,e.style.border=`1px solid rgba(255, 255, 255, 0.12)`,e.style.whiteSpace=`nowrap`,t.appendChild(e),e},r=n(),i=n(),a=n(),o=document.createElement(`div`);o.style.color=`#ffd43b`,o.style.fontSize=`15px`,o.style.padding=`2px 6px`,t.appendChild(o),e.appendChild(t);let s=0,c=-1,l=-1,u=``;return{update:(e,t)=>{let n=Math.max(0,Math.min(5,Math.round(e.stars)));if(n!==c){c=n;let e=``;for(let t=0;t<5;t+=1)e+=t<n?Ef:Df;r.textContent=e,r.style.color=n>0?`#ffd43b`:`rgba(230, 237, 243, 0.35)`,r.style.display=n>0?`block`:`none`}let d=Math.round(e.health);d!==l&&(l=d,i.textContent=`HP ${d}`,i.style.color=d<30?`#ff6b6b`:`#e6edf3`);let f=e.reloading?`перезарядка`:`${e.mag} / ${e.reserve}`,p=`${e.weapon} · ${f}`;p!==u&&(u=p,a.textContent=p,a.style.color=e.mag===0&&!e.reloading?`#ff8787`:`#9da7b3`),s>0&&(s-=t,s<=0&&(o.textContent=``))},notify(e){o.textContent=e,s=Of},dispose(){e.removeChild(t)}}}var Af=.25,jf=110,Mf=130,Nf=62,Pf=6,Ff=.3,If=5,Lf=6,Rf=3,zf=[`sports`,`van`,`truck`,`sedan`,`sports`,`van`],Bf=.1,Vf=128,Hf=14,Uf=44,Wf=20,Gf=Object.freeze({throttle:1,brake:0,steer:0,handbrake:!1}),Kf=.3,qf=1,Jf=.55,Yf=85294677,Xf=150,Zf=.4,Qf=1.2,$f=.7,ep=9147297,tp=.7,np=1.4,rp=1.5,ip=16,ap=38,op=24,sp=16755021;function cp(){let e=document.getElementById(`game`);if(!e)throw Error(`Не найден контейнер #game`);let t=new URLSearchParams(window.location.search),n=t.get(`debug`)===`1`,r=t.get(`stress`)===`1`,i=$d(t.get(`map`)??`city`),a=i.seed,o=new Jc,s=new Qc;$c(s,window);let c=Yc(),l=new Tf(document.getElementById(`stats`)),u=document.getElementById(`hint`),d=kf(document.getElementById(`hud`)),f=wf();f.seed=a,f.mapId=i.id,f.showWorld=n,f.stressActive=r;let p=new Ic({antialias:!0,powerPreference:`high-performance`});p.setPixelRatio(Math.min(window.devicePixelRatio,2)),p.setSize(window.innerWidth,window.innerHeight),p.shadowMap.enabled=!0,p.shadowMap.type=1,p.toneMapping=4,p.toneMappingExposure=1.1,e.appendChild(p.domElement);let m=new hn;m.background=new J(1053722);let h=new Vi(13623551,3813156,1.75);m.add(h);let g=new na(16773332,2.5);g.castShadow=!0,g.shadow.mapSize.set(1024,1024),g.shadow.camera.left=-65,g.shadow.camera.right=65,g.shadow.camera.top=65,g.shadow.camera.bottom=-65,g.shadow.camera.near=1,g.shadow.camera.far=260,g.shadow.bias=-6e-4,m.add(g),m.add(g.target);let _=Sf(i,$l),v=_.colliders,y=new al(v),b=[],x={nx:0,nz:0,depth:0},S=[],C={nx:0,nz:0,depth:0},w=_.bounds.maxX-_.bounds.minX,T=_.bounds.maxZ-_.bounds.minZ,E=Math.hypot(w,T)/2,D=X(E*.33,220,300);m.fog=new mn(1053722,D*.5,D);let O=Math.max(700,E*1.8),k=_.defaultSpawn,A=y.create(`player`),j=A.transform;j.x=k.x,j.z=k.z,j.heading=k.heading,j.prevX=k.x,j.prevZ=k.z,j.prevHeading=k.heading;let M=new uu,ee=du(M,y,{type:`sedan`,x:k.x,z:k.z,heading:k.heading,colorIndex:0});function N(e,t,n){v.queryCircle(e,t,n+Ql.collisionSkin,S);for(let r=0;r<S.length;r+=1)if(Vc(e,t,n,S[r],C))return!1;return!0}function te(e,t,n){v.queryCircle(e,t,n+Ql.collisionSkin,S);for(let r=0;r<S.length;r+=1)if(!(S[r].id<0)&&Vc(e,t,n,S[r],C))return!1;return!0}function P(e,t,n,r){v.queryCircle(e,t,n+Ql.collisionSkin,S);for(let i=0;i<S.length;i+=1){let a=S[i];if(a.id!==r&&Vc(e,t,n,a,C))return!1}return!0}function ne(){let e=_.map.spawns.cars;if(e.length===0)return;let t=NaN,n=NaN;for(let e=0;e<_.map.landmarks.length;e+=1){let r=_.map.landmarks[e];if(r.kind===`police`){t=r.x,n=r.z;break}}let r=-1;if(Number.isFinite(t)){let i=1/0;for(let a=0;a<e.length;a+=1){let o=e[a].x-t,s=e[a].z-n,c=o*o+s*s;c<i&&(i=c,r=a)}}let i=[];for(let t=0;t<e.length;t+=1){let n=e[t],r=n.x-k.x,a=n.z-k.z;r*r+a*a<625||N(n.x,n.z,Rf)&&i.push(t)}for(let t=0;t<e.length&&i.length<5;t+=1){if(i.includes(t))continue;let n=e[t],r=n.x-k.x,a=n.z-k.z;r*r+a*a<625||i.push(t)}let a=i.slice(0,Lf);r>=0&&!a.includes(r)&&i.includes(r)&&(a.length>0?a[a.length-1]=r:a.push(r));for(let t=0;t<a.length;t+=1){let n=a[t],i=e[n],o=n===r?`police`:zf[t%zf.length];du(M,y,{type:o,x:i.x,z:i.z,heading:i.heading,colorIndex:(t+1)%4})}}ne();let F=[],re=0,ie=new an,ae=null,oe=ee.transform.x,se=ee.transform.z;r&&I();function I(){let e=Ql.stressStaticColliders,t=Ql.stressMovingColliders,n=new Gr(new ni(1,1,1),new _i({color:16777215}),e+t);n.receiveShadow=!0,ae=n;let r=new J,i=sl(Yf),a=0,o=0;for(;a<e&&o<e*10;){o+=1;let e=oe+i.range(-150,Xf),t=se+i.range(-150,Xf);if(Math.abs(e-oe)<6&&Math.abs(t-se)<6)continue;let s=i.range(Zf,Qf),c=i.range(Zf,Qf);v.insert({id:_.allocStaticId(),x:e,z:t,hx:s,hz:c,angle:0}),ie.position.set(e,$f/2,t),ie.rotation.set(0,0,0),ie.scale.set(s*2,$f,c*2),ie.updateMatrix(),n.setMatrixAt(a,ie.matrix),n.setColorAt(a,r.setHex(ep)),a+=1}let s=Math.floor(t/2);for(let e=0;e<t;e+=1){let t=e<s?0:1,i=e%2==0?1:-1,o=Math.floor(e/2)%2==0?1:-1,c=a+e,l=e*2.399963229728653,u=.5+e%5*.08,d=y.create(`prop`),f=d.transform;f.x=oe+(t===0?o*ap+Math.sin(l)*op:i*ip+Math.cos(l)*rp),f.z=se+(t===0?i*ip+Math.cos(l)*rp:o*ap+Math.sin(l)*op),f.prevX=f.x,f.prevZ=f.z,y.attachCollider(d.id,tp,tp,0),y.attachRenderRef(d.id,c);let p={id:d.id,handle:c,axis:t,lane:i*ip,center:o*ap,amplitude:op,omega:u,phase:l,anchorX:oe,anchorZ:se};F.push(p),ce(n,p.handle,f.x,f.z,0),n.setColorAt(c,r.setHex(sp))}n.count=a+t,n.instanceMatrix.needsUpdate=!0,n.instanceColor&&(n.instanceColor.needsUpdate=!0),m.add(n)}function ce(e,t,n,r,i){ie.position.set(n,np/2,r),ie.rotation.set(0,i,0),ie.scale.set(tp*2,np,tp*2),ie.updateMatrix(),e.setMatrixAt(t,ie.matrix)}let le=wl(m,_.config),ue=Xl(m,{maxVehicles:Vf}),de=Wl(m),L=new Uc({viewHeight:jf,height:Mf,backOffset:Nf,damp:Pf,lookAhead:Ff,maxLookAhead:If,far:O});L.resize(window.innerWidth,window.innerHeight);let fe=new ea(L.frustum.left,L.frustum.right,L.frustum.top,L.frustum.bottom,L.frustum.near,L.frustum.far);L.snapTo(k.x,k.z);let pe=0,me=0,he=0;function ge(){let e=_.bounds;L.position.x=X(L.position.x,e.minX,e.maxX),L.position.z=X(L.position.z,e.minZ,e.maxZ),L.target.x=X(L.target.x,e.minX,e.maxX),L.target.z=X(L.target.z,e.minZ,e.maxZ);let t=0,n=0;pe>0&&(t=Math.sin(he*1.7)*me*Jf,n=Math.cos(he*1.3)*me*Jf),fe.position.set(L.position.x+t,L.position.y,L.position.z+n),fe.lookAt(L.target.x+t*.4,L.target.y,L.target.z+n*.4)}ge();let _e=Ou(),ve=new Du(y,M,v,Ql,_.bounds,_e),R=new ku(M,v,Ql,_.bounds,A.id,j);R.startInVehicle(ee);let ye=Ml(m),be=Ul(m),xe=new bu($.maxCops+8),Se=_.map.blocks.map(e=>e.rect),Ce=new ju({registry:y,fleet:M,hash:v,graph:_.roadGraph,physics:ve,bounds:_.bounds,seed:_.seed^31249}),we=new Nu({registry:y,fleet:M,hash:v,blocks:Se,water:_.map.water,bounds:_.bounds,playerId:A.id,seed:_.seed^20973}),Te=new Lu({hash:v,fleet:M,pools:[we.pool,xe],playerId:A.id,seed:_.seed^49407}),Ee=new Ru({registry:y,fleet:M,hash:v,graph:_.roadGraph,physics:ve,combat:Te,npcPool:xe,playerId:A.id,seed:_.seed^39537});we.onCrime=(e,t,n)=>Ee.addCrime(e,t,n),Te.onCrime=(e,t,n)=>Ee.addCrime(e,t,n),Te.onGunshot=(e,t)=>we.gunshot(e,t),Te.onShot=(e,t,n,r,i)=>ye.tracer(e,t,n,r,i),Te.onImpact=(e,t,n)=>ye.impact(e,t,n),Ce.onHonk=(e,t)=>we.alertAt(e,t,16,`alert`),Ee.onLevelChanged=e=>{d.notify(e>0?`Розыск ${e}`:`Розыск снят`)},Ee.onPlayerCaught=e=>{let t=Ve(k.x,k.z,3.5),n=R.vehicle;R.mode===`driving`&&n?(pu(y,n,t.x,t.z,t.heading),hu(n),R.syncInsideVehicle()):R.teleport(t.x,t.z),L.snapTo(t.x,t.z),_.prefetch(t.x,t.z),pe=0,Ee.reset(),d.notify(e===`arrest`?`Арест! Розыск снят`:`Выведен из строя`)},Ce.prefill(Hf,k.x,k.z),we.prefill(Uf,k.x,k.z);let De={x:k.x,z:k.z,vx:0,vz:0,heading:k.heading,onFoot:!1,vehicle:ee},Oe={wantedLevel:0,sirenX:0,sirenZ:0},ke=0,Ae=!1,z=!1,je=!1,Me=!1,Ne=-1,B={x:0,y:0},Pe=new ba,Fe=new pr(new K(0,1,0),0),V=new K,H=new st;function Ie(){return H.set(B.x,B.y),Pe.setFromCamera(H,fe),Pe.ray.intersectPlane(Fe,V)!==null}function Le(){let e=R.mode===`driving`?R.vehicle:null,t=e?e.transform.x:j.x,n=e?e.transform.z:j.z;if(e&&(t+=Math.sin(e.transform.heading)*(e.config.length*.5+.4),n+=Math.cos(e.transform.heading)*(e.config.length*.5+.4)),!Ie())return;let r=V.x-t,i=V.z-n,a=Math.hypot(r,i);a<.4||(r/=a,i/=a,Te.tryFire(t,n,r,i,e?e.id:-1))}function Re(e){B.x=e.clientX/window.innerWidth*2-1,B.y=-(e.clientY/window.innerHeight)*2+1}window.addEventListener(`mousedown`,e=>{e.button===0&&(Re(e),Ae=!0,z=!0)}),window.addEventListener(`mouseup`,e=>{e.button===0&&(Ae=!1)}),window.addEventListener(`mousemove`,e=>Re(e)),window.addEventListener(`contextmenu`,e=>e.preventDefault());let ze=[],Be=.35;function Ve(e,t,n){let r=(n*2+3)*(n*2+3);_.querySpawnPoints(e,t,450,`car`,ze);let i=null,a=null,o=1/0,s=1/0;for(let c=0;c<ze.length;c+=1){let l=ze[c];if(!N(l.x,l.z,n+Be))continue;let u=l.x-e,d=l.z-t,f=u*u+d*d;f<s&&(s=f,a=l),f<r||f<o&&(o=f,i=l)}if(i)return i;if(a)return a;let c=_.roadGraph.spawnPoints,l=null,u=1/0;for(let r=0;r<c.length;r+=1){let i=c[r];if(!N(i.x,i.z,n+Be))continue;let a=i.x-e,o=i.z-t,s=a*a+o*o;s<u&&(u=s,l=i)}return l??_.defaultSpawn}function He(){let e=R.vehicle;if(R.mode===`driving`&&e){let t=Ve(e.transform.x,e.transform.z,eu(e.config));pu(y,e,t.x,t.z,t.heading),hu(e),R.syncInsideVehicle(),L.snapTo(t.x,t.z),_.prefetch(t.x,t.z),pe=0;return}let t=Ve(j.x,j.z,au.radius+.75);R.teleport(t.x,t.z),L.snapTo(t.x,t.z),_.prefetch(t.x,t.z),pe=0}function Ue(){if(!R.toggleVehicle())return!1;let e=R.vehicle,t=e?e.transform:j;return L.snapTo(t.x,t.z),_.prefetch(t.x,t.z),pe=0,!0}let We=!1;window.addEventListener(`keydown`,e=>{e.repeat||(e.code===`KeyE`?We=!0:e.code===`KeyH`?Me=!0:e.code===`KeyF`?je=!0:e.code===`Digit1`?Ne=0:e.code===`Digit2`?Ne=1:e.code===`Digit3`&&(Ne=2))});function Ge(e){if(F.length!==0){re+=e;for(let e=0;e<F.length;e+=1){let t=F[e],n=y.get(t.id);if(!n)continue;let r=n.transform;r.prevX=r.x,r.prevZ=r.z,r.prevHeading=r.heading;let i=re*t.omega+t.phase,a=Math.sin(i),o=Math.cos(i);t.axis===0?(r.x=t.anchorX+t.center+a*t.amplitude,r.z=t.anchorZ+t.lane+o*rp,r.vx=o*t.amplitude*t.omega,r.vz=-a*rp*t.omega):(r.z=t.anchorZ+t.center+a*t.amplitude,r.x=t.anchorX+t.lane+o*rp,r.vz=o*t.amplitude*t.omega,r.vx=-a*rp*t.omega),r.heading=Math.atan2(r.vx,r.vz);let s={x:r.x,z:r.z,hx:tp,hz:tp,angle:r.heading};qc(s,v,b,x,Ql,!0)&&(r.x=s.x,r.z=s.z),y.updateCollider(t.id)}}}function Ke(e){let t=ae;if(t){for(let n=0;n<F.length;n+=1){let r=F[n],i=y.get(r.id);if(!i)continue;let a=i.transform;ce(t,r.handle,Rc(a.prevX,a.x,e),Rc(a.prevZ,a.z,e),Bc(a.prevHeading,a.heading,e))}t.instanceMatrix.needsUpdate=!0}}let U=_.prefetch(k.x,k.z);le.sync(_);{let e=()=>R.vehicle??M.list[0]??null;window.__tmc={mapId:_.mapId,seed:a,get layoutHash(){return _.layoutHash},exportRoadGraph:()=>ld(_.roadGraph),stats:()=>{let e=_.stats,t=_.info;return{mapId:_.mapId,seed:a,layoutHash:_.layoutHash,roads:t.roads,blocks:t.blocks,landmarks:t.landmarks,nodes:t.nodes,edges:t.edges,lights:t.lights,buildings:t.buildings,props:t.props,chunks:_.activeChunks.length,colliders:e.colliders,genMaxMs:e.genMaxMs,genLastMs:e.genLastMs,genCount:e.genCount,updateMs:e.updateMs,spawnPoints:e.spawnPoints,drawCalls:p.info.render.calls,triangles:p.info.render.triangles,prefetchMs:U,vehicles:M.size,mode:R.mode,onFoot:+(R.mode===`foot`),hp:R.vehicle?Number(R.vehicle.hp.toFixed(1)):0,type:R.vehicle?R.vehicle.type:``,physMaxMs:Number(f.physMaxMs.toFixed(3)),logicSteps:$e,inputReads:et}},teleport:(e,t)=>{let n=X(e,_.bounds.minX+3,_.bounds.maxX-3),r=X(t,_.bounds.minZ+3,_.bounds.maxZ-3),i=R.vehicle;R.mode===`driving`&&i?pu(y,i,n,r,i.transform.heading):R.teleport(n,r),L.snapTo(n,r),_.prefetch(n,r),pe=0},carState:()=>{let t=e(),n=R.mode===`foot`,r=Math.hypot(j.vx,j.vz)*3.6;if(!t)return{vehicles:M.size,mode:R.mode,onFoot:+!!n,hp:0,type:``,x:Number(j.x.toFixed(2)),z:Number(j.z.toFixed(2)),speedKmh:Number(r.toFixed(1)),playerX:Number(j.x.toFixed(2)),playerZ:Number(j.z.toFixed(2)),playerSpeedKmh:Number(r.toFixed(1)),physMaxMs:Number(f.physMaxMs.toFixed(3))};let i=t.transform,a=Math.hypot(i.vx,i.vz)*3.6,o=eu(t.config),s=n?N(j.x,j.z,au.radius):P(i.x,i.z,o,-t.id-1);return{id:t.id,type:t.type,name:t.config.label,x:Number((n?j.x:i.x).toFixed(2)),z:Number((n?j.z:i.z).toFixed(2)),heading:Number((n?j.heading:i.heading).toFixed(3)),speedKmh:Number((n?r:a).toFixed(1)),carX:Number(i.x.toFixed(2)),carZ:Number(i.z.toFixed(2)),carSpeedKmh:Number(a.toFixed(1)),playerX:Number(j.x.toFixed(2)),playerZ:Number(j.z.toFixed(2)),playerSpeedKmh:Number(r.toFixed(1)),forward:Number(t.forward.toFixed(2)),lateral:Number(t.lateral.toFixed(2)),slip:Number(t.slip.toFixed(2)),hp:Number(t.hp.toFixed(1)),maxHp:t.maxHp,hpPct:Number((t.hp/t.maxHp*100).toFixed(1)),wrecked:+!!t.wrecked,driver:t.driver,mode:R.mode,onFoot:+!!n,vehicles:M.size,physMaxMs:Number(f.physMaxMs.toFixed(3)),staticClear:+!!te(i.x,i.z,o),spawnClear:+!!s}},vehicleStats:()=>{let e={sedan:0,sports:0,van:0,truck:0,police:0};for(let t=0;t<M.list.length;t+=1)e[M.list[t].type]+=1;let t=R.vehicle;return{total:M.size,sedan:e.sedan,sports:e.sports,van:e.van,truck:e.truck,police:e.police,mode:R.mode,onFoot:+(R.mode===`foot`),target:t?t.config.label:`Пешеход`,targetType:t?t.type:``,hp:t?Number(t.hp.toFixed(1)):0,physMaxMs:Number(f.physMaxMs.toFixed(3))}},spawnVehicle:(e,t,n,r)=>{let i=e!==void 0&&ru(e)?e:`sedan`,a,o,s;if(t!==void 0&&n!==void 0&&Number.isFinite(t)&&Number.isFinite(n))a=t,o=n,s=r??0;else{let e=Ve(j.x,j.z,Rf);a=e.x,o=e.z,s=e.heading}return N(a,o,Rf)?(du(M,y,{type:i,x:a,z:o,heading:s}),M.size):-1},damageActive:t=>{let n=e();return n?+!!mu(n,t):0},repairActive:()=>{let t=e();t&&hu(t)},enterVehicle:()=>+!!R.enterNearest(),exitVehicle:()=>+!!R.exitVehicle(),speedProbe:()=>{let e={},t=Math.ceil(20/Ql.fixedStep);for(let n=0;n<nu.length;n+=1){let r=nu[n],i=new ul(Ql.spatialCellSize),a=new al(i),o=new uu,s=new Du(a,o,i,Ql,null),c=du(o,a,{type:r,x:0,z:0,heading:0}),l=0,u=-1;for(let e=0;e<t;e+=1){s.step(c,Gf,Ql.fixedStep);let t=Math.hypot(c.transform.vx,c.transform.vz);t>l&&(l=t),u<0&&t>=c.config.maxSpeed-.05&&(u=(e+1)*Ql.fixedStep)}e[r]=Number(l.toFixed(2)),e[`${r}Max`]=c.config.maxSpeed,e[`${r}Reached`]=+(u>=0),e[`${r}Time`]=Number(u.toFixed(2))}return e},stressState:()=>{let e=0;for(let t=0;t<F.length;t+=1){let n=F[t],r=y.get(n.id);if(!r)continue;let i=Math.hypot(r.transform.x-n.anchorX,r.transform.z-n.anchorZ);i>e&&(e=i)}return{active:+!!r,movers:F.length,anchorX:Number(oe.toFixed(2)),anchorZ:Number(se.toFixed(2)),maxDistance:Number(e.toFixed(2))}},physicsBench:(e=60,t=120)=>{let n=[];_.querySpawnPoints(0,0,5e3,`car`,n);let r=[];for(let t=0;t<n.length&&r.length<e;t+=1){let e=n[t];if(!N(e.x,e.z,3))continue;let i=du(M,y,{type:nu[r.length%nu.length],x:e.x,z:e.z,heading:e.heading}),a=Math.sin(e.heading),o=Math.cos(e.heading);i.transform.vx=a*12,i.transform.vz=o*12,r.push(i)}let i=r.length;for(let e=0;e<5;e+=1)for(let e=0;e<r.length;e+=1)ve.step(r[e],Tu,Ql.fixedStep);for(let e=0;e<5;e+=1)for(let e=0;e<r.length;e+=1)ve.step(r[e],Tu,Ql.fixedStep);let a=0,o=0,s=[];for(let e=0;e<t;e+=1){let e=performance.now();for(let e=0;e<r.length;e+=1)ve.step(r[e],Tu,Ql.fixedStep);let t=performance.now()-e;a+=t,s.push(t),t>o&&(o=t)}for(let e=0;e<r.length;e+=1)fu(M,y,r[e]);y.flush();let c=t>0?a/t:0;s.sort((e,t)=>e-t);let l=e=>{if(s.length===0)return 0;let t=Math.min(s.length-1,Math.floor(e*s.length));return s[t]};return{vehicles:i,ticks:t,avgMs:Number(c.toFixed(3)),maxMs:Number(o.toFixed(3)),p50Ms:Number(l(.5).toFixed(3)),p95Ms:Number(l(.95).toFixed(3)),p99Ms:Number(l(.99).toFixed(3)),perCarMs:Number((i>0?c/i:0).toFixed(4))}},wanted:()=>{let e=Ee.stats;return{level:e.level,heat:Number(e.heat.toFixed(1)),cars:e.cars,foot:e.foot,health:Number(e.health.toFixed(1)),seen:e.seen,unseen:Number(e.unseen.toFixed(1)),arrests:e.arrests,spawned:e.spawned,despawned:e.despawned,copShots:e.copShots,copHits:e.copHits,nearestCar:Number(e.nearestCar.toFixed(1)),nearestFoot:Number(e.nearestFoot.toFixed(1)),updateMs:Number(e.updateMs.toFixed(3)),maxUpdateMs:Number(e.maxUpdateMs.toFixed(3))}},setWanted:e=>(Ee.setLevel(e),Ee.level),trafficStats:()=>{let e=Ce.stats;return{vehicles:e.vehicles,near:e.near,stopped:e.stopped,avgSpeed:Number(e.avgSpeed.toFixed(2)),spawned:e.spawned,despawned:e.despawned,updateMs:Number(e.updateMs.toFixed(3)),maxUpdateMs:Number(e.maxUpdateMs.toFixed(3))}},pedStats:()=>{let e=we.stats;return{total:e.total,near:e.near,idle:e.idle,walk:e.walking,alert:e.alert,flee:e.fleeing,panic:e.panic,down:e.down,knocked:e.knocked,spawned:e.spawned,despawned:e.despawned,updateMs:Number(e.updateMs.toFixed(3)),maxUpdateMs:Number(e.maxUpdateMs.toFixed(3))}},spawnCop:(e,t)=>Ee.spawnCop(e,t),combatState:()=>({weapon:Te.weapon,label:Te.weaponSpec.label,mag:Te.magAmmo,reserve:Te.reserveAmmo,reloading:+!!Te.isReloading,recoil:Number(Te.recoil.toFixed(2)),wanted:Ee.level,health:Number(Ee.health.toFixed(1))})}}if(n){f.layoutHash=_.layoutHash,f.mapId=_.mapId;let e=_.info;f.roads=e.roads,f.blocks=e.blocks,f.landmarks=e.landmarks}let W=0,qe=``;function Je(){if(d.update({stars:Ee.level,health:Ee.health,weapon:Te.weaponSpec.label,mag:Te.magAmmo,reserve:Te.reserveAmmo,reloading:Te.isReloading,driving:R.mode===`driving`},Bf),!u)return;let e=R.mode===`driving`?R.vehicle:null,t=`ЛКМ — огонь · 1/2/3 — оружие · F — перезарядка · H — сигнал`,n;if(e){let r=Math.round(Math.hypot(e.transform.vx,e.transform.vz)*3.6),i=Math.round(e.hp/e.maxHp*100),a=e.wrecked?` · уничтожена`:``;n=`${e.config.label} · ${e.type} · HP ${i}%${a} · ${r} км/ч · E — выйти · R — на дорогу · ${t}`}else{let e=R.nearest;n=`Пешком · E — сесть в машину${e?` · рядом: ${e.config.label}`:``} · WASD — идти · ${t}`}n!==qe&&(u.textContent=n,qe=n)}let Ye=0,Xe=0,Ze=0,Qe=0,$e=0,et=0,G=0;function tt(){let e=R.vehicle;return R.mode===`driving`&&e?e.transform:j}function nt(e){let t=performance.now();if(s.read(c),et+=1,$e+=1,ke+=e,c.reset&&He(),We){We=!1,Ue();let e=R.vehicle;e&&(Ce.forget(e.id),Ee.releaseVehicle(e.id))}R.mode===`driving`?R.syncInsideVehicle():R.stepFoot(e,c);let n=R.mode===`driving`?R.vehicle:null;De.x=n?n.transform.x:j.x,De.z=n?n.transform.z:j.z,De.vx=n?n.transform.vx:j.vx,De.vz=n?n.transform.vz:j.vz,De.heading=n?n.transform.heading:j.heading,De.onFoot=R.mode===`foot`,De.vehicle=n,Oe.wantedLevel=Ee.level,Oe.sirenX=Ee.sirenPositionX,Oe.sirenZ=Ee.sirenPositionZ,Ce.update(e,ke,De.x,De.z,Oe),Ee.update(e,De),Te.update(e),Ne>=0&&(Te.selectWeapon(cu[Ne]),Ne=-1),je&&(je=!1,Te.reload()),Me&&(Me=!1,we.alertAt(De.x,De.z,Wf,`alert`)),Ae&&(z||Te.weaponSpec.auto)&&Le(),z=!1;let r=performance.now();for(let t=0;t<M.list.length;t+=1){let r=M.list[t];r===n?ve.step(r,c,e):Ce.owns(r.id)||Ee.owns(r.id)||ve.step(r,Tu,e)}let i=performance.now()-r;i>Qe&&(Qe=i),Ge(e),we.update(e,ke,De.x,De.z,Ee.sirenPositionX,Ee.sirenPositionZ,Ee.level,Ee.sirenNear),Te.recoil>.01&&(me=Math.max(me,X(Te.recoil,.15,qf)*.5),pe=Math.max(pe,Kf*.5)),n&&n.impactPulse>0&&(me=X(n.impactPulse/18,.2,qf),pe=Kf,n.impactPulse=0);for(let e=0;e<M.list.length;e+=1){let t=M.list[e];t.justWrecked&&(t.justWrecked=!1,ue.burst(t.transform.x,t.transform.z,1),t===n&&(me=qf,pe=Kf))}if(y.flush(),G+=e,G>=Af){G=0;let e=tt();_.update(e.x,e.z)}let a=performance.now()-t;Ye+=a,Xe+=1,a>Ze&&(Ze=a)}function rt(e,t){let n=R.mode===`driving`&&R.vehicle?R.vehicle.transform:j,r=Rc(n.prevX,n.x,e),i=Rc(n.prevZ,n.z,e);ue.sync(M.list,e,t),be.sync(we.pool.list,xe.list,e,t),ye.sync(t);let a=Rc(j.prevX,j.x,e),o=Rc(j.prevZ,j.z,e),s=Bc(j.prevHeading,j.heading,e);de.sync(a,o,s,R.mode===`foot`),Ke(e),le.sync(_),pe>0&&(pe=Math.max(0,pe-t),he+=t*46,pe===0&&(me=0)),L.update(t,r,i,n.vx,n.vz),ge(),g.position.set(r+55,105,i+40),g.target.position.set(r,0,i),g.target.updateMatrixWorld(),p.render(m,fe);let c=p.info.render,u=_.stats,d=R.vehicle,h=d?Math.hypot(d.transform.vx,d.transform.vz)*3.6:Math.hypot(j.vx,j.vz)*3.6;f.drawCalls=c.calls,f.triangles=c.triangles,f.speedKmh=h,f.colliders=v.size,f.movingColliders=y.dynamicColliders,f.entities=y.total,f.overrun=it.overrun,f.debtMs=it.debt*1e3,f.logicMs=Xe>0?Ye/Xe:0,f.logicMaxMs=Ze,f.physMaxMs=Qe,f.chunks=_.activeChunks.length,f.chunkGenMaxMs=u.genMaxMs,f.chunkGenLastMs=u.genLastMs,f.worldUpdateMs=u.updateMs,f.vehicles=M.size,f.playerMode=R.mode===`driving`?`car`:`onFoot`,f.targetLabel=d?`${d.config.label} [${d.type}] #${d.handle}`:`Пешеход`,f.vehicleHp=d?d.hp/d.maxHp*100:100,Ye=0,Xe=0,Ze=0,Qe=0,W-=t,W<=0&&(W=Bf,Je()),l.update(t,f)}let it=new el(nt,rt,{fixedStep:Ql.fixedStep,maxSteps:Ql.maxSubsteps,maxFrameDelta:Ql.maxFrameDelta});o.on(`pause`,e=>{e.paused?(it.pause(),s.clear()):it.resume()});function at(e){o.emit(`pause`,{paused:e})}window.addEventListener(`blur`,()=>at(!0)),window.addEventListener(`focus`,()=>{document.hidden||at(!1)}),document.addEventListener(`visibilitychange`,()=>at(document.hidden));function ot(){let e=window.innerWidth,t=window.innerHeight;p.setPixelRatio(Math.min(window.devicePixelRatio,2)),p.setSize(e,t),L.resize(e,t);let n=L.frustum;fe.left=n.left,fe.right=n.right,fe.top=n.top,fe.bottom=n.bottom,fe.updateProjectionMatrix()}window.addEventListener(`resize`,ot);let ct=document.getElementById(`loading`);ct&&ct.classList.add(`hidden`),Je(),it.start(),document.hidden&&at(!0)}cp();