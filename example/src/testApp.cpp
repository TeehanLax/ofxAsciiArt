#include "testApp.h"

//--------------------------------------------------------------
void testApp::setup(){
	ofDisableArbTex(); 
	ofSetFrameRate(24);
		
	draw_gui = true;
	gui.setup("controls", 0, 0);
	gui.add(contrast_slider.setup("contrast", 1.0, -100.0, 100.0, true));
	gui.add(depth_slider.setup("color depth", 8.0, 1.0, 24.0, true));
	
	vidGrabber.setVerbose(true);
	
	/* Currently, the input source needs to have power-of-2 dimensions.
	 * This will change soon once I get NPOT textures working.
	 */
	vidGrabber.initGrabber(512, 512, true); 
	
	/* Pass in only the texture reference, not the image object. 
	 */
	asciiArt.init(vidGrabber.getTextureReference(), ofGetWidth(), ofGetHeight());
}

//--------------------------------------------------------------
void testApp::update(){
	ofBackground(0);	
	
	vidGrabber.grabFrame();
	
	asciiArt.setContrast(contrast_slider.getValue());
	asciiArt.setColorDepth(depth_slider.getValue());
	asciiArt.update();
}



//--------------------------------------------------------------
void testApp::draw(){
	ofSetColor(255); 
	
	asciiArt.draw((ofGetWidth() - asciiArt.getWidth())/2, (ofGetHeight() - asciiArt.getHeight())/2);
	if(draw_gui) gui.draw();
}

//--------------------------------------------------------------
void testApp::keyPressed(int key){
	
	switch(key) {
		case '0': asciiArt.setMode(ASCII_MODE_RAW); break;
		case '1': asciiArt.setMode(ASCII_MODE_COLOR); break;
		case '2': asciiArt.setMode(ASCII_MODE_GREEN); break;
		case '3': asciiArt.setMode(ASCII_MODE_GRAY); break;
		case ' ': draw_gui = !draw_gui; break;
	}
}