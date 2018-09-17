#version 300 es

__DEFINES__

precision mediump float;

in vec3 vCoordinates;
out vec4 fColor;

uniform samplerCube map;

void main() {
    fColor = texture(map, vCoordinates);
}