#version 120    
  
uniform sampler2D inputTexture;  
uniform sampler2D asciiTexture;  
uniform sampler2D hashTexture;
uniform vec2 imageSize;
uniform vec2 canvasSize;

varying float mode;
varying float contrast;
varying float depth;

const float charMapSize = 2048.0;
const float numChars = 256.0;
const vec2 fontSize = vec2(8.0, 8.0);
const vec2 hashSize = vec2(256.0, 256.0);

vec4 pix = vec4(0.0, 0.0, 0.0, 1.0);
vec2 ratio;
float colorDepth;

float packColor(vec4 color) {   
	return (color.r + (color.g*256.0) + (color.b*256.0*256.0) + (color.a*256.0*256.0*256.0));
}

vec4 contrastPix(float _x, float _y, float _contrast) {
	float factor = (259.0 * (_contrast + 255.0)) / (255.0 * (259.0 - _contrast));
	vec4 pix = texture2D(inputTexture, vec2(_x, _y));
	
	pix.r = (factor * ((pix.r*255.0) - 128.0) + 128.0)/255.0;
	pix.g = (factor * ((pix.g*255.0) - 128.0) + 128.0)/255.0;
	pix.b = (factor * ((pix.b*255.0) - 128.0) + 128.0)/255.0;
	
	return pix;
}

vec4 analyseQuads(vec2 _offset) {
	
	// TODO: Clear these magic numbers.
	float i_x = 1.0/(canvasSize.x*0.62);
	float i_y = 1.0/(canvasSize.y*0.93);
	
	float h_fs_x = (fontSize.x/2.0)/canvasSize.x;
	float h_fs_y = (fontSize.y/2.0)/canvasSize.y;
	
	vec4 lut_pix;
	vec4 t_pix;
	vec4 key = vec4(0.0, 0.0, 0.0, 0.0);
	
	for(float y=_offset.y; y<_offset.y+h_fs_y; y+=i_y) {
		for(float x=_offset.x; x<_offset.x+h_fs_x; x+=i_x) {
			t_pix = vec4(0.0, 0.0, 0.0, 1.0);
		
			lut_pix = contrastPix(x, y, contrast);
			key.r += lut_pix.g;
			lut_pix.r = (floor((lut_pix.r*255.0)/colorDepth)*colorDepth)/255.0;
			lut_pix.g = (floor((lut_pix.g*255.0)/colorDepth)*colorDepth)/255.0;
			lut_pix.b = (floor((lut_pix.b*255.0)/colorDepth)*colorDepth)/255.0;
			t_pix += lut_pix;
			
			lut_pix = contrastPix(x+h_fs_x, y, contrast);
			key.g += lut_pix.g;
			lut_pix.r = (floor((lut_pix.r*255.0)/colorDepth)*colorDepth)/255.0;
			lut_pix.g = (floor((lut_pix.g*255.0)/colorDepth)*colorDepth)/255.0;
			lut_pix.b = (floor((lut_pix.b*255.0)/colorDepth)*colorDepth)/255.0;
			t_pix += lut_pix;
			
			lut_pix = contrastPix(x, y+h_fs_y, contrast);
			key.b += lut_pix.g;
			lut_pix.r = (floor((lut_pix.r*255.0)/colorDepth)*colorDepth)/255.0;
			lut_pix.g = (floor((lut_pix.g*255.0)/colorDepth)*colorDepth)/255.0;
			lut_pix.b = (floor((lut_pix.b*255.0)/colorDepth)*colorDepth)/255.0;
			t_pix += lut_pix;
			
			lut_pix = contrastPix(x+h_fs_x, y+h_fs_y, contrast);
			key.a += lut_pix.g;
			lut_pix.r = (floor((lut_pix.r*255.0)/colorDepth)*colorDepth)/255.0;
			lut_pix.g = (floor((lut_pix.g*255.0)/colorDepth)*colorDepth)/255.0;
			lut_pix.b = (floor((lut_pix.b*255.0)/colorDepth)*colorDepth)/255.0;
			t_pix += lut_pix;
			
			t_pix /= 4.0;
			pix += t_pix;
		}
	}
	
	pix /= fontSize.x+fontSize.y;
	key = floor(key)/16.0;
	
	return key;
}

void main()  
{  
	int m = int(mode);
	colorDepth = 255.0/depth;

	ivec2 ioffset = ivec2(gl_FragCoord.xy/fontSize.xy);
	ioffset *= ivec2(fontSize.xy);
	vec2 offset = vec2(ioffset);
	offset /= canvasSize;

	vec4 hashKey = analyseQuads(offset);
	float index = packColor( hashKey )/256.0;
	
	float hash_x = mod(floor(index), hashSize.x); 
	float hash_y = (index-hash_x)/hashSize.x;

	vec4 char_pix = texture2D(hashTexture, vec2(hash_x/255.0, hash_y/255.0));
	float char = floor((char_pix.g)*255.0);

	vec2 pos = mod(gl_FragCoord.xy, fontSize.xy);
  	pos = pos / vec2(fontSize.x*numChars, fontSize.y);
	pos.x += ((char*fontSize.x)/charMapSize);
	
	vec4 ascii_pix = vec4(texture2D(asciiTexture, pos).rgb, 1.0);
	
	if(ascii_pix.r > 0.0) {
		if(m==1) {
			ascii_pix.rgb = pix.rgb;
		} else if(m==2) {
			ascii_pix.rgb = vec3(pix.g*0.1, pix.g, pix.g*0.1);
		} else if(m==3) {
			float gray = (pix.r+pix.g+pix.b)/3.0;
			ascii_pix.rgb = vec3(gray);
		} 
	} 
	
	gl_FragColor = ascii_pix;
}  