import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

class ThreeDMap extends React.Component {
    
    constructor(props) {
        super(props),
        this.state = {
            geometry: {}
        }
    }

    addGeoObject(group, svgObject) {

        let paths = svgObject.paths;
        for (var i = 0; i < paths.length; i++) {
            let path = geometry.transformSVGPath(paths[i]);
        }
    }

    render() {
        return (
            <div>
                hello
            </div>
        );
    }

    propTypes = {
        name: PropTypes.string
    };
}

export default ThreeDMap;
