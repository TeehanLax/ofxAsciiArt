#pragma once

#include "ofMain.h"
#include "ofxAsciiArt.h"
#include "gui/ofPanel.h"
#include "gui/ofSlider.h"

class testApp : public ofBaseApp{
	public:
		void setup();
		void update();
		void draw();
		
		void keyPressed(int key);
	
		bool draw_gui;
		ofPanel gui;
		ofSlider contrast_slider;
		ofSlider depth_slider;
	
		ofVideoGrabber vidGrabber;
	
		ofxAsciiArt asciiArt;
};
