// Experimental, dependency-free WebGL relief of the supplied vector silhouette.
// The distance texture is derived from its exact alpha, not a replacement logo.
const vertex = `#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `#version 300 es
precision highp float;
uniform sampler2D field;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float progress;
out vec4 outputColor;
float silhouette(vec2 p){
  vec2 uv=p*.5+.5;
  float d=(texture(field,clamp(uv,0.,1.)).r*128.-64.)/1024.;
  return any(greaterThan(abs(p),vec2(1.))) ? max(d,length(max(abs(p)-1.,0.))) : d;
}
float solid(vec3 p){
  float d=silhouette(p.xy);
  vec2 q=vec2(d+.022,abs(p.z)-.023);
  return min(max(q.x,q.y),0.)+length(max(q,0.))-.022;
}
vec3 normalAt(vec3 p){
  vec2 e=vec2(.004,0.);
  return normalize(vec3(solid(p+e.xyy)-solid(p-e.xyy),solid(p+e.yxy)-solid(p-e.yxy),solid(p+e.yyx)-solid(p-e.yyx)));
}
mat3 rotation(float a,float b){
  return mat3(cos(a),0.,sin(a),0.,1.,0.,-sin(a),0.,cos(a))*mat3(1.,0.,0.,0.,cos(b),-sin(b),0.,sin(b),cos(b));
}
vec3 light(vec3 p,vec3 n,vec3 v,vec3 source,float strength){
  vec3 l=normalize(source-p),h=normalize(l+v);
  float nv=max(dot(n,v),.025),nl=max(dot(n,l),0.),nh=max(dot(n,h),0.);
  float a=.24*.24,a2=a*a,den=nh*nh*(a2-1.)+1.;
  float distribution=a2/(3.14159*den*den);
  float k=.19,visibility=nv/(nv*(1.-k)+k)*nl/(nl*(1.-k)+k);
  vec3 fresnel=vec3(.82,.84,.86)+(vec3(1.)-vec3(.82,.84,.86))*pow(1.-max(dot(v,h),0.),5.);
  return fresnel*distribution*visibility/(4.*nv*max(nl,.025))*nl*strength;
}
void main(){
  vec2 screen=gl_FragCoord.xy/resolution*2.-1.;screen.x*=resolution.x/resolution.y;
  float p=smoothstep(0.,1.,progress);
  mat3 turn=rotation(-.10*(1.-p)+pointer.x*.09,.045*(1.-p)+pointer.y*.055);
  vec3 ro=turn*vec3(screen*.9454,3.),rd=turn*vec3(0.,0.,-1.);
  vec3 inv=1./rd,t0=(-vec3(1.01,1.01,.048)-ro)*inv,t1=(vec3(1.01,1.01,.048)-ro)*inv;
  vec3 lo=min(t0,t1),hi=max(t0,t1);
  float near=max(max(lo.x,lo.y),lo.z),far=min(min(hi.x,hi.y),hi.z);
  if(near>far){outputColor=vec4(0.);return;}
  float t=max(near,0.);bool hit=false;vec3 point;
  for(int i=0;i<40;i++){
    point=ro+rd*t;float distance=solid(point);
    if(distance<.00065){hit=true;break;}
    t+=max(distance*.85,.0003);if(t>far)break;
  }
  if(!hit){outputColor=vec4(0.);return;}
  vec3 n=normalAt(point),v=-rd,r=reflect(-v,n);
  vec3 key=vec3(mix(-2.6,1.1,p),mix(1.5,.7,p),mix(.65,2.8,p));
  vec3 envA=normalize(key),envB=normalize(vec3(-1.,-.4,1.5));
  vec3 softbox=normalize(vec3(mix(-.9,.3,p),.45,mix(.15,1.2,p)));
  float studio=.022+mix(.045,.12,p)+.90*pow(max(dot(r,softbox),0.),12.)+.62*pow(max(dot(r,envB),0.),18.);
  float grazing=pow(1.-max(dot(n,v),0.),2.);
  vec3 silver=vec3(.66,.69,.72)*(studio+.07*grazing);
  silver+=light(point,n,v,key,mix(.55,.90,p));
  silver+=light(point,n,v,vec3(-2.,-.8,2.),.35);
  silver+=light(point,n,v,vec3(1.8,2.,.4),.10);
  silver=pow(silver/(silver+vec3(.52)),vec3(1./2.2));
  outputColor=vec4(min(silver,vec3(.94)),1.);
}`;

export async function mountSilverStudy(base: string) {
  const emblem = document.querySelector<HTMLElement>('#top .hero-brand-mark');
  if (!emblem) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const canvas = document.createElement('canvas');
  canvas.className = 'silver-study-canvas';canvas.setAttribute('aria-hidden','true');
  const controls = document.createElement('div');controls.className = 'sculpture-controls';
  const label=document.createElement('span');label.textContent='Проба света';
  const replay=document.createElement('button');replay.type='button';replay.textContent='Повторить';
  const compare=document.createElement('a');compare.textContent='Обычная версия';
  const controlURL=new URL(location.href);controlURL.searchParams.delete('scene');controlURL.hash='top';compare.href=controlURL.href;
  controls.append(label,replay,compare);emblem.closest('figure')?.append(controls);
  document.body.classList.add('sculpture-preview');
  let frame=0,visible=true,started=performance.now(),last=0,px=0,py=0,tx=0,ty=0;
  function fallback(){
    cancelAnimationFrame(frame);frame=0;canvas.hidden=true;emblem!.classList.remove('sculpture-is-ready');
    document.body.dataset.sculptureState='static';replay.disabled=true;label.textContent='Статичный просмотр';
  }
  if(reduced.matches){fallback();return;}
  try{
    const gl=canvas.getContext('webgl2',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'low-power'});
    if(!gl){fallback();return;}
    function shader(type:number,source:string){
      const shader=gl!.createShader(type)!;gl!.shaderSource(shader,source);gl!.compileShader(shader);
      if(!gl!.getShaderParameter(shader,gl!.COMPILE_STATUS))throw Error(gl!.getShaderInfoLog(shader)??'Shader unavailable');return shader;
    }
    const program=gl.createProgram()!;gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Material program unavailable');gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const attribute=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
    const image=new Image();image.src=`${base}brand/family-distance.png`;await image.decode();
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program,'field'),0);
    const uResolution=gl.getUniformLocation(program,'resolution'),uPointer=gl.getUniformLocation(program,'pointer'),uProgress=gl.getUniformLocation(program,'progress');
    emblem.append(canvas);
    function resize(){
      const r=emblem!.getBoundingClientRect(),width=Math.round(Math.min(r.width*devicePixelRatio,520));
      canvas.width=width;canvas.height=Math.round(width*r.height/r.width);gl!.viewport(0,0,canvas.width,canvas.height);request();
    }
    function render(now:number){
      frame=0;if(!visible||document.hidden||reduced.matches)return;
      if(now-last<32){request();return;}last=now;
      px+=(tx-px)*.16;py+=(ty-py)*.16;
      const progress=Math.max(0,Math.min(1,(now-started)/3400));
      gl!.uniform2f(uResolution,canvas.width,canvas.height);gl!.uniform2f(uPointer,px,py);gl!.uniform1f(uProgress,progress);
      gl!.clearColor(0,0,0,0);gl!.clear(gl!.COLOR_BUFFER_BIT);gl!.drawArrays(gl!.TRIANGLES,0,3);
      canvas.dataset.sceneProgress=progress.toFixed(3);canvas.dataset.frames=String(Number(canvas.dataset.frames??0)+1);
      emblem!.classList.add('sculpture-is-ready');document.body.dataset.sculptureState='ready';
      if(progress<1||Math.abs(tx-px)+Math.abs(ty-py)>.001)request();
    }
    function request(){if(!frame&&!reduced.matches&&visible&&!document.hidden)frame=requestAnimationFrame(render);}
    replay.addEventListener('click',()=>{started=performance.now();px=py=tx=ty=0;request();});
    document.querySelector('#top')?.addEventListener('pointermove',event=>{
      if(!fine.matches||reduced.matches||!(event instanceof PointerEvent))return;
      const r=emblem!.getBoundingClientRect();tx=Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1));ty=Math.max(-1,Math.min(1,(event.clientY-r.top)/r.height*2-1));request();
    },{passive:true});
    document.querySelector('#top')?.addEventListener('pointerleave',()=>{tx=ty=0;request();});
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)request();else{cancelAnimationFrame(frame);frame=0;}},{threshold:.01}).observe(emblem);
    new ResizeObserver(resize).observe(emblem);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else request();});
    reduced.addEventListener('change',()=>{if(reduced.matches)fallback();else{canvas.hidden=false;replay.disabled=false;label.textContent='Проба света';started=performance.now()-3400;request();}});
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();fallback();});
    resize();started=performance.now();request();
  }catch(error){console.warn('Silver study uses static fallback:',String(error));fallback();}
}
