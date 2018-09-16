#version 300 es

precision mediump float;

in vec3 vCoords;
out vec4 fColor;

uniform samplerCube map;

void main() {
    fColor = texture(map, vCoords);
}