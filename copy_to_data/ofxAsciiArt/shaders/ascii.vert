#version 120  
  
attribute float a_mode;
attribute float a_contrast;
attribute float a_depth;

varying vec2 texCoord; 
varying float mode;
varying float contrast;
varying float depth;
  
void main()  
{   
	mode = a_mode;
	contrast = a_contrast;
	depth = a_depth;
    gl_Position = ftransform();
}  