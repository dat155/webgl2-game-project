#version 300 es

__DEFINES__

precision mediump float;

uniform vec4 color;

#ifdef HAS_MAP
uniform sampler2D map;
#endif

out vec4 fColor;
in vec2 fTextureCoordinate;

void main() {

    #ifdef HAS_MAP
    fColor = color * texture(map, fTextureCoordinate);
    #else
    fColor = color;
    #endif

}