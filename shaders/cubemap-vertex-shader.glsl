#version 300 es

__DEFINES__

precision mediump float;

layout(location = 0) in vec4 vPosition;
layout(location = 1) in vec3 vNormal;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

out vec3 fTextureCoordinate;;

void main() {
    fTextureCoordinate = vNormal;
    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
}