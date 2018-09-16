#version 300 es

precision mediump float;

in vec4 vPosition;
in vec3 vNormal;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

out vec3 vCoords;

void main() {
    vCoords = vPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
}