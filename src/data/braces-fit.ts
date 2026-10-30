/** Artistic anchors measured on the unchanged 1536×1024 smile source. Clinical approval pending. */
export const smileFrame={x:150,y:-10,width:900,height:600,sourceWidth:1536,sourceHeight:1024};
export const bracketFit=[
 {x:464,y:396,s:.22,sx:.58,tooth:'left outer'},
 {x:496,y:402,s:.25,sx:.68,tooth:'left premolar'},
 {x:546,y:409,s:.32,sx:.82,tooth:'left canine'},
 {x:615,y:422,s:.38,sx:.94,tooth:'left lateral'},
 {x:710,y:429,s:.44,sx:1,tooth:'left central'},
 {x:825,y:430,s:.44,sx:1,tooth:'right central'},
 {x:920,y:421,s:.38,sx:.94,tooth:'right lateral'},
 {x:990,y:411,s:.32,sx:.82,tooth:'right canine'},
 {x:1045,y:402,s:.25,sx:.68,tooth:'right premolar'},
 {x:1086,y:394,s:.22,sx:.58,tooth:'right outer'},
] as const;
export const bracketAnchors=bracketFit.map(p=>({...p,x:smileFrame.x+p.x*smileFrame.width/smileFrame.sourceWidth,y:smileFrame.y+p.y*smileFrame.height/smileFrame.sourceHeight}));
export const smileFocus=bracketAnchors[4];
