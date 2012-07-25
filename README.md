
# ofxAsciiArt - Real-time ASCII Art filter for oF.

This add-on was inspired by Sol's work with [TextFX](http://sol.gfxile.net/textfx/index.html), the major difference being ofxAsciiArt runs on the GPU. Font data and LUT creation were taken from TextFX.

## Sample Usage

.h:

	ofxAsciiArt asciiArt;

.cpp:

	void testApp::setup(){
		ofDisableArbTex(); 
		
		vidGrabber.initGrabber(512, 512, true); 

		asciiArt.init(vidGrabber.getTextureReference(), ofGetWidth(), ofGetHeight());
	}

	void testApp::update(){
		ofBackground(0);	
		
		vidGrabber.grabFrame();
		
		asciiArt.setContrast(contrast_slider.getValue());
		asciiArt.setColorDepth(depth_slider.getValue());
		asciiArt.update();
	}

	void testApp::draw(){
		asciiArt.draw((ofGetWidth() - asciiArt.getWidth())/2, (ofGetHeight() - asciiArt.getHeight())/2);
	}