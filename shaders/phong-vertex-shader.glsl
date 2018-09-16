#version 300 es

precision mediump float;

in vec4 vPosition;
in vec3 vNormal;
in vec2 vTextureCoordinate;
out vec2 fTextureCoordinate;

out vec3 interpolatedNormal;
out vec3 vertexPosition;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

void main() {

	vec4 vp = modelViewMatrix * vPosition;
	vertexPosition = vp.xyz / vp.w;

	interpolatedNormal = normalMatrix * vNormal;
	
	fTextureCoordinate = vTextureCoordinate;
    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
}