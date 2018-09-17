#version 300 es

__DEFINES__

precision mediump float;

layout(location = 0) in vec4 vPosition;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

out vec3 vCoordinates;

void main() {
    vCoordinates = vPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
}