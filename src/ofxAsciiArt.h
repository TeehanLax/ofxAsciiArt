/*
 *  This add-on was inspired by Sol's work with TextFX http://sol.gfxile.net/textfx/index.html ,
 *	the major difference being ofxAsciiArt runs on the GPU. Font data and LUT creation were 
 *	taken from TextFX.
 *
 *  Created by Peter Nitsch on 12-06-21.
 *  Copyright 2012 Teehan+Lax. All rights reserved.
 *
 */

#pragma once

#include "ofMain.h"

#define CHAR_WIDTH 8
#define CHAR_HEIGHT 8

#define ASCII_MODE_RAW 0
#define ASCII_MODE_COLOR 1
#define ASCII_MODE_GREEN 2
#define ASCII_MODE_GRAY 3

class ofxAsciiArt {
	
public:
	void init(ofTexture _source, int w, int h);
	void update();
	void draw(int x, int y);
	void setMode(int _mode) {
		if(_mode >= 0 && _mode <= 6) {
			mode = _mode;
		}
	};
	void setContrast(float _contrast) {
		if(_contrast >= -100.0 && _contrast <= 100.0) {
			contrast = _contrast;
		}
	};
	void setColorDepth(float _depth) {
		if(_depth >= 1.0 && _depth <= 24.0) {
			depth = _depth;
		}
	};
	
	bool isReady;
	int getWidth(){ return fbo.getWidth(); };
	int getHeight(){ return fbo.getHeight(); };
	float getContrast() { return contrast; };
	unsigned char* getPixels() {
		fbo.readToPixels(pixels);
		return pixels.getPixels();
	};
	
private:
	void buildHash();
	
	ofFbo fbo;
	ofPixels pixels;
	ofTexture source;
	ofImage ascii;
	ofImage hash;
	
	ofShader shader;
	int mode;
	float contrast;
	float depth;
	bool isModeSet;
	unsigned char * pix; 
};