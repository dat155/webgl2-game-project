#version 300 es

precision mediump float;

in vec4 vPosition;
in vec2 vTextureCoordinate;
out vec2 fTextureCoordinate;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
	fTextureCoordinate = vTextureCoordinate;
    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
}