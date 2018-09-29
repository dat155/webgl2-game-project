#version 300 es

__DEFINES__

precision mediump float;

layout(location = 0) in vec4 POSITION;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

out vec3 vCoordinates;

void main() {
    vCoordinates = POSITION.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * POSITION;
}