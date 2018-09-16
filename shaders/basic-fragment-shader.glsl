#version 300 es

precision mediump float;

uniform vec4 color;
uniform sampler2D map;

uniform bool hasMap;

out vec4 fColor;
in vec2 fTextureCoordinate;

void main() {

    if (hasMap) {
        fColor = color * texture(map, fTextureCoordinate);
    } else {
        fColor = color;
    }

}