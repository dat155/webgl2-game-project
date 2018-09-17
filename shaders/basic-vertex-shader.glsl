#version 300 es

__DEFINES__

precision mediump float;

layout(location = 0) in vec4 vPosition;
layout(location = 2) in vec2 vTextureCoordinate;

out vec2 fTextureCoordinate;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
	fTextureCoordinate = vTextureCoordinate;
    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
}