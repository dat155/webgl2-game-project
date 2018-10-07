#version 300 es

__DEFINES__

precision mediump float;

layout(location = 0) in vec4 POSITION;
layout(location = 3) in vec2 TEXCOORD_0;

out vec2 fTextureCoordinate;

uniform mat4 modelViewProjectionMatrix;

void main() {
	fTextureCoordinate = TEXCOORD_0;
    gl_Position = modelViewProjectionMatrix * POSITION;
}