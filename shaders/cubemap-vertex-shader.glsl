#version 300 es

__DEFINES__

precision mediump float;

layout(location = 0) in vec4 POSITION;

out vec3 vCoordinates;

uniform mat4 modelViewProjectionMatrix;

void main() {
    vCoordinates = POSITION.xyz;
    gl_Position = modelViewProjectionMatrix * POSITION;
}