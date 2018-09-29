#version 300 es

__DEFINES__

precision mediump float;

layout(location = 0) in vec4 POSITION;
layout(location = 2) in vec2 TEXCOORD_0;

out vec2 fTextureCoordinate;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
	fTextureCoordinate = TEXCOORD_0;
    gl_Position = projectionMatrix * modelViewMatrix * POSITION;
}