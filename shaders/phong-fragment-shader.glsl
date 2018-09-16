#version 300 es

precision mediump float;

uniform mat4 modelViewMatrix;

// light:
uniform vec4 lightPosition;
vec4 lightDiffuse = vec4(1.5, 1.5, 1.5, 1.0);
vec4 lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
vec4 lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);

// material:
uniform vec4 materialColor;
uniform vec4 materialAmbient;
uniform vec4 materialSpecular;
uniform float shininess;

uniform bool hasMap;
uniform sampler2D map;

in vec2 fTextureCoordinate;
in vec3 interpolatedNormal, vertexPosition;
out vec4 fColor;

void main() {
    vec4 diffuseColor = materialColor * lightDiffuse;
    if (hasMap == true) {
        diffuseColor = diffuseColor * texture(map, fTextureCoordinate);
    }
    vec3 ambientColor = (lightAmbient * materialAmbient).xyz;
    vec3 specularColor = (lightSpecular * materialSpecular).xyz;

    vec3 normal = normalize(interpolatedNormal);

    vec3 lightPos = lightPosition.xyz;

    vec3 lightDir = normalize(lightPos - vertexPosition);
    vec3 reflectDir = reflect(-lightDir, normal);
    vec3 viewDir = normalize(-vertexPosition);

    float lambertian = max(dot(lightDir, normal), 0.0);
    float specular = 0.0;

    if (lambertian > 0.0) {
       float specAngle = max(dot(reflectDir, viewDir), 0.0);
       specular = pow(specAngle, shininess);
    }

    fColor = vec4(ambientColor + (lambertian * diffuseColor).xyz + (specular * specularColor), 1.0);
}