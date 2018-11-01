import React from 'react';
import PropTypes from 'prop-types';
import mapData from '../../data/mapgeo.json';
import { d3threeD } from '../../utils/d3threeD';
import geojson2svg from 'geojson2svg';
import * as THREE from 'three';
import './style.scss';

class ThreeDMap extends React.Component {
    
    constructor(props) {
        super(props),
        this.data = mapData;
        this.geometry = {};
    }

    addGeoObject(group, svgObject) {
        //let paths = svgObject.;
        let svgCord = [];
        let converter = geojson2svg({output: 'path'});
        for (let q = 0; q < svgObject.features.length; q++) {
            let svg_coordinates = converter.convertGeometry(svgObject.features[q].geometry);
            console.log(svg_coordinates);
            console.log(this.geometry.transformSVGPath(svg_coordinates[0]));
            // for (let i = 0; i < svgObject.features[q].geometry.coordinates.length; i++) {
            //     let path = this.geometry.transformSVGPath(svgObject.features[q].geometry[i]);
            // }
        }
    }

    initMap() {
        //let x = new THREE.ShapePath();
        d3threeD(this.geometry);
    }

    componentDidMount() {
        this.initMap();
        this.addGeoObject('', this.data);
        //console.log(mapData);
    }

    render() {
        return (
            <div>
                hello
            </div>
        );
    }

    static propTypes = {
        name: PropTypes.string
    };
}

export default ThreeDMap;
