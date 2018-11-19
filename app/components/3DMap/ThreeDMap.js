import React from 'react';
import PropTypes from 'prop-types';
import mapData from '../../data/mapgeo.json';
import { d3threeD } from '../../utils/d3threeD';
import geojson2svg from 'geojson2svg';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import './style.scss';

class ThreeDMap extends React.Component {
    
    constructor(props) {
        super(props),
        this.data = mapData;
        this.geometry = {};
        this.camera;
        this.renderer;
        this.scene;
        this.color_list = ['0xa92717','0xa2a0b3','0xdeded2','0xb9a727','0x2c395c'];
    }

    generateRng(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    addGeoObject(group, svgObject) {
        let svgCord = [];
        let converter = geojson2svg({output: 'path'});
        for (let q = 0; q < svgObject.features.length; q++) {
            // convert geojson coords to svg coords
            let svg_coordinates = converter.convertGeometry(svgObject.features[q].geometry);
            for (let i = 0; i < svg_coordinates.length; i++) {
                // convert to threejs path
                let path = this.geometry.transformSVGPath(svg_coordinates[i]);
                let color = new THREE.Color(this.color_list[this.generateRng(this.color_list.length)]);
                //let color = new THREE.Color('skyblue');
                let material = new THREE.MeshLambertMaterial({
                    color: color,
                    emissive: color
                });

                let depth = svgObject.features[q].properties.CENSUSAREA;
                let simpleShape = path.toShapes(true);

                for (let r = 0; r < simpleShape.length; r++) {
                    let shape = simpleShape[r];
                    let shape3D = new THREE.ExtrudeBufferGeometry(shape, {
                        depth: depth, // needs to be reduced
                        develEnabled: false
                    });

                    let mesh = new THREE.Mesh(shape3D, material);
                    //mesh.rotation.x = Math.PI;
                    mesh.translateZ(- depth - 1);
                    mesh.translateX(- 365);
                    mesh.translateY(- 125);

                    group.add(mesh);
                }
            }
            // for (let i = 0; i < svgObject.features[q].geometry.coordinates.length; i++) {
            //     let path = this.geometry.transformSVGPath(svgObject.features[q].geometry[i]);
            // }
        }
    }

    initMap() {
        //let x = new THREE.ShapePath();
        d3threeD(this.geometry);

        let scene = new THREE.Scene();
        scene.background = new THREE.Color(0xb0b0b0);

        let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.set(0, 0, 200);

        let group = new THREE.Group();
        scene.add(group);

        let directional_light = new THREE.DirectionalLight(0xffffff, 0.6);
        directional_light.position.set(0.75, 0.75, 1.0).normalize();
        scene.add(directional_light);

        let ambient_light = new THREE.AmbientLight(0xcccccc, 0.2);
        scene.add(ambient_light);

        let grid_helper = new THREE.GridHelper(160, 10);
        grid_helper.rotation.x = Math.PI / 2;
        group.add(grid_helper);

        this.addGeoObject(group, this.data)

        let render = new THREE.WebGLRenderer({antialias: true});
        render.setPixelRatio(window.devicePixelRatio);
        render.setSize(window.innerWidth, window.innerHeight);
        // append to dom element here
        let controls = new OrbitControls(camera, render.domElement);

        this.node.appendChild(render.domElement);
        this.camera = camera;
        this.renderer = render;
        this.scene = scene;
        this.camera = camera;
        window.addEventListener('resize', this.onWindowResize, false);
        //render.render(scene, camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    componentDidMount() {
        this.renderer.render(this.scene, this.camera)
        this.animate();
        //console.log(mapData);
    }

    render() {
        return (
            <div ref={(node) => this.node = node}/>
        );
    }

    static propTypes = {
        name: PropTypes.string
    };
}

export default ThreeDMap;
